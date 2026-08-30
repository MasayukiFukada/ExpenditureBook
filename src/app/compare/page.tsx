import { getDb } from "@/lib/db";
import { MonthlyData } from "@/types";
import {
  MultiYearBarChart,
  MultiYearLineChart,
  YearlySummaryData,
  MultiYearMonthlyTrend,
} from "@/components/multi-year-charts";
import {
  MultiYearCategoryCompare,
  YearlyDataWithCategories,
} from "@/components/multi-year-category-compare";
import { CATEGORIES } from "@/const/categories";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Layers,
  ArrowLeft,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ComparePage() {
  const db = await getDb();
  const allMonthlyData = db.data.monthly;

  // 利用可能な年のリストを取得（昇順：古い年→新しい年）
  const years = Array.from(
    new Set(allMonthlyData.map((d) => d.year_month.split("-")[0]))
  ).sort((a, b) => a.localeCompare(b));

  const currentYearStr = new Date().getFullYear().toString();

  // 年ごとの集計データを作成
  const yearlySummaries: YearlySummaryData[] = [];
  const yearlyDataWithCategories: YearlyDataWithCategories[] = [];
  const yearTotalsMap: { [year: string]: number } = {};
  const yearMonthlyDataMap: { [year: string]: { [monthNum: string]: number } } = {};

  // データ内の全カテゴリを収集（定義済みカテゴリ＋その他）
  const dynamicCategoriesSet = new Set<string>(CATEGORIES);

  years.forEach((year) => {
    const yearMonths = allMonthlyData.filter((d) =>
      d.year_month.startsWith(year)
    );
    const monthsCount = yearMonths.length;

    let totalAmount = 0;
    const categoryTotals: { [category: string]: number } = {};
    yearMonthlyDataMap[year] = {};

    yearMonths.forEach((m) => {
      let monthTotal = 0;
      for (const day in m.days) {
        m.days[day].forEach((item) => {
          monthTotal += item.amount;
          const cat = item.category || "未設定";
          dynamicCategoriesSet.add(cat);
          categoryTotals[cat] = (categoryTotals[cat] || 0) + item.amount;
        });
      }

      totalAmount += monthTotal;
      const monthNum = m.year_month.split("-")[1];
      yearMonthlyDataMap[year][monthNum] = monthTotal;
    });

    yearTotalsMap[year] = totalAmount;
    const monthlyAverage =
      monthsCount > 0 ? Math.round(totalAmount / monthsCount) : 0;
    const isCurrentYear = year === currentYearStr;
    const projectedTotal =
      isCurrentYear && monthsCount > 0 && monthsCount < 12
        ? Math.round(monthlyAverage * 12)
        : undefined;

    yearlySummaries.push({
      year,
      totalAmount,
      monthsCount,
      monthlyAverage,
      projectedTotal,
      isCurrentYear,
    });

    yearlyDataWithCategories.push({
      year,
      totalAmount,
      monthsCount,
      monthlyAverage,
      projectedTotal,
      isCurrentYear,
      categoryTotals,
    });
  });

  const allCategories = Array.from(dynamicCategoriesSet);

  // 全期間の統計計算
  const totalAllTimeSpend = yearlySummaries.reduce(
    (sum, y) => sum + y.totalAmount,
    0
  );
  const totalRecordedYears = yearlySummaries.length;
  const averageYearlySpend =
    totalRecordedYears > 0
      ? Math.round(totalAllTimeSpend / totalRecordedYears)
      : 0;

  // 最高支出年・最低支出年
  const completedYears = yearlySummaries.filter(
    (y) => !y.isCurrentYear || y.monthsCount === 12
  );
  const maxSpendYear =
    completedYears.length > 0
      ? [...completedYears].sort((a, b) => b.totalAmount - a.totalAmount)[0]
      : yearlySummaries[0];
  const minSpendYear =
    completedYears.length > 0
      ? [...completedYears].sort((a, b) => a.totalAmount - b.totalAmount)[0]
      : yearlySummaries[0];

  // 12ヶ月分の月別比較推移データ（マルチライン用）
  const multiYearMonthlyData: MultiYearMonthlyTrend[] = Array.from(
    { length: 12 },
    (_, i) => {
      const monthNum = String(i + 1).padStart(2, "0");
      const row: MultiYearMonthlyTrend = {
        month: `${i + 1}月`,
      };

      years.forEach((year) => {
        if (yearMonthlyDataMap[year] && yearMonthlyDataMap[year][monthNum] !== undefined) {
          row[year] = yearMonthlyDataMap[year][monthNum];
        }
      });

      return row;
    }
  );

  return (
    <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm gap-1"
            >
              <ArrowLeft size={16} />
              <span>トップへ戻る</span>
            </Link>
          </div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="text-primary" />
            <span>年間比較ダッシュボード</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            過去全期間の年間支出推移・前年比およびカテゴリ別増減分析
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/subscriptions"
            className="flex items-center gap-2 border px-3 py-2 rounded-lg hover:bg-muted text-sm font-medium"
          >
            <span>サブスク管理</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-medium hover:bg-secondary/80 transition-colors text-sm"
          >
            <span>単年詳細へ</span>
          </Link>
        </div>
      </header>

      {/* サマリー指標カード */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SummaryCard
          title="記録年数"
          value={totalRecordedYears}
          unit="年間"
          icon={<Calendar className="text-muted-foreground" size={20} />}
        />
        <SummaryCard
          title="全期間総支出"
          value={`¥${totalAllTimeSpend.toLocaleString()}`}
          icon={<Layers className="text-muted-foreground" size={20} />}
        />
        <SummaryCard
          title="年間平均支出"
          value={`¥${averageYearlySpend.toLocaleString()}`}
          unit="/年"
          icon={<TrendingUp className="text-muted-foreground" size={20} />}
        />
        {maxSpendYear && (
          <SummaryCard
            title="過去最高支出年"
            value={`${maxSpendYear.year}年`}
            subValue={`¥${maxSpendYear.totalAmount.toLocaleString()}`}
            icon={<TrendingDown className="text-amber-500" size={20} />}
          />
        )}
      </div>

      <div className="space-y-10">
        {/* グラフセクション 1: 年間総支出推移 */}
        <section className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">年間総支出の推移</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                年ごとの総支出（現在の年は見込み額も表示）
              </p>
            </div>
          </div>
          <MultiYearBarChart data={yearlySummaries} />
        </section>

        {/* グラフセクション 2: 複数年の月別推移比較 */}
        <section className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">月別支出推移の重ね合わせ</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                各年の月別支出カーブを比較して季節性やトレンドを把握できます
              </p>
            </div>
          </div>
          <MultiYearLineChart data={multiYearMonthlyData} years={years} />
        </section>

        {/* カテゴリ別前年比較 & 年次データ展開テーブル & マトリクス */}
        <MultiYearCategoryCompare
          yearlyData={yearlyDataWithCategories}
          allCategories={allCategories}
          allYears={years}
        />
      </div>
    </div>
  );
}

function calculateMonthTotal(month: MonthlyData): number {
  let total = 0;
  for (const day in month.days) {
    total += month.days[day].reduce((sum, item) => sum + item.amount, 0);
  }
  return total;
}

function SummaryCard({
  title,
  value,
  subValue,
  unit = "",
  icon,
}: {
  title: string;
  value: string | number;
  subValue?: string;
  unit?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="bg-card p-5 rounded-xl border shadow-sm flex items-start justify-between">
      <div>
        <h3 className="text-xs font-medium text-muted-foreground">{title}</h3>
        <p className="text-2xl font-bold mt-1 tracking-tight">
          {typeof value === "number" ? value.toLocaleString() : value}
          <span className="text-sm font-normal ml-1">{unit}</span>
        </p>
        {subValue && (
          <p className="text-xs text-muted-foreground mt-0.5">{subValue}</p>
        )}
      </div>
      {icon && <div className="p-2 bg-muted/60 rounded-lg">{icon}</div>}
    </div>
  );
}
