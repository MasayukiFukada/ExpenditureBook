# ExpenditureBook

支出管理のためのWebアプリケーションです。Next.js、Tailwind CSS、Lowdbを使用しています。

## 開発環境のセットアップ

### 依存関係のインストール

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認できます。

## MCP (Model Context Protocol) への対応

本プロジェクトは Gemini CLI を通じて MCP をサポートしており、外部ツールやデータソースとの連携が可能です。

### 接続方法

MCP サーバーの設定は、グローバルまたはプロジェクト単位で行うことができます。

#### 設定ファイルの場所
- **グローバル設定**: `~/.gemini/settings.json`
- **プロジェクト別設定**: `.gemini/settings.json`

#### 設定例 (`settings.json`)

```json
{
  "mcpServers": {
    "expenditure-book-mcp": {
      "command": "npm",
      "args": ["run", "mcp"],
      "dir": "/home/minamo/repository/ExpenditureBook"
    },
    "example-server": {
      "command": "node",
      "args": ["/path/to/server.js"],
      "env": {
        "API_KEY": "$MY_API_KEY"
      }
    }
  }
}
```

### 実装済みのツール

今回のアップデートで、以下のツールが利用可能になりました：

- **get_monthly_analysis**: 指定した月の支出データを集計し、AIによる分析（使いすぎの指摘や節約アドバイス）を可能にします。
- **predict_upcoming_expenses**: 過去のデータをスキャンし、税金や年会費などの定期的な支払いを予測してリマインドします。

#### CLIコマンドによる操作

Gemini CLI を使用して MCP サーバーを管理することも可能です。

- **サーバーの追加**: `gemini mcp add <名前> <コマンド/URL> [引数...]`
- **サーバーの一覧表示**: `gemini mcp list`
- **サーバーの削除**: `gemini mcp remove <名前>`

### Gemini CLI 内での操作

対話モード中に以下のコマンドを使用して状態を確認できます。

- `/mcp list`: 接続中のサーバーと利用可能なツールを表示
- `/mcp reload`: 設定を再読み込みして接続をリフレッシュ
