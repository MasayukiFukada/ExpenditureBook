const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

// 設定: ファイルパス
const FILES = {
    category: 'category_202605092157.csv',
    expenditure: 'expenditure_202605092157.csv',
    comment: 'monthly_comment_202605092158.csv'
};

function convert() {
    console.log('変換を開始します...');

    // 1. カテゴリマスタの読み込み
    const categoryRaw = fs.readFileSync(path.join(__dirname, FILES.category), 'utf-8');
    const categories = parse(categoryRaw, { columns: true, skip_empty_lines: true });
    const categoryMap = {};
    categories.forEach(c => {
        categoryMap[c.id] = {
            name: c.name,
            type: parseInt(c.type)
        };
    });

    // 2. 月別コメントの読み込み
    const commentRaw = fs.readFileSync(path.join(__dirname, FILES.comment), 'utf-8');
    const comments = parse(commentRaw, { columns: true, skip_empty_lines: true });
    const commentMap = {};
    comments.forEach(c => {
        const key = `${c.year}-${String(c.month).padStart(2, '0')}`;
        commentMap[key] = c.note;
    });

    // 3. 支出データの読み込み
    const expenditureRaw = fs.readFileSync(path.join(__dirname, FILES.expenditure), 'utf-8');
    const expenditures = parse(expenditureRaw, { columns: true, skip_empty_lines: true });

    // 4. 統合処理 (1ヶ月1ドキュメントの構造へ)
    const monthlyData = {};

    expenditures.forEach(e => {
        const date = new Date(e.date);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const monthKey = `${year}-${month}`;

        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = {
                year_month: monthKey,
                comment: commentMap[monthKey] || "",
                days: {},
                summary: {
                    total: 0,
                    by_category: {}
                }
            };
        }

        if (!monthlyData[monthKey].days[day]) {
            monthlyData[monthKey].days[day] = [];
        }

        const category = categoryMap[e.category_id] || { name: "未分類", type: 1 };
        const amount = parseInt(e.ammount);

        monthlyData[monthKey].days[day].push({
            id: e.id,
            category: category.name,
            amount: amount,
            note: e.note,
            updated_at: e.update_at
        });

        // 集計
        monthlyData[monthKey].summary.total += amount;
        monthlyData[monthKey].summary.by_category[category.name] = (monthlyData[monthKey].summary.by_category[category.name] || 0) + amount;
    });

    // 5. JSONファイルとして出力
    const result = Object.values(monthlyData).sort((a, b) => b.year_month.localeCompare(a.year_month));
    const outputDir = 'db';
    if (!fs.existsSync(outputDir)){
        fs.mkdirSync(outputDir);
    }
    fs.writeFileSync(path.join(outputDir, 'migrated_data.json'), JSON.stringify(result, null, 2));

    console.log(`変換完了: db/migrated_data.json に ${result.length} ヶ月分のデータを保存しました。`);
}

// 依存ライブラリ(csv-parse)のチェックと実行
try {
    convert();
} catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
        console.error('エラー: csv-parse がインストールされていません。');
        console.log('以下のコマンドを実行してから再度試してください:');
        console.log('npm install csv-parse');
    } else {
        console.error(err);
    }
}
