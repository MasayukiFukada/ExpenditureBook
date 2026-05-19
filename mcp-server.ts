import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { getDb } from "./src/lib/db.js";
import { MonthlyData, Expenditure } from "./src/types/index.js";

const server = new Server(
  {
    name: "expenditure-book-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * 支出データの取得と分析ツールの定義
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_monthly_analysis",
        description: "指定した月の支出データを取得し、AIによる分析とコメントを生成するためのコンテキストを提供します。",
        inputSchema: {
          type: "object",
          properties: {
            year_month: {
              type: "string",
              description: "取得したい年月 (YYYY-MM形式)",
            },
          },
          required: ["year_month"],
        },
      },
      {
        name: "predict_upcoming_expenses",
        description: "過去の全支出データをスキャンし、特定の月や周期で発生する支出（税金、年会費など）を予測します。",
        inputSchema: {
          type: "object",
          properties: {
            target_month: {
              type: "string",
              description: "予測したい年月 (YYYY-MM形式)",
            },
          },
          required: ["target_month"],
        },
      },
    ],
  };
});

/**
 * ツールの実行ハンドラー
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    const db = await getDb();
    await db.read();

    if (name === "get_monthly_analysis") {
      const { year_month } = z.object({ year_month: z.string() }).parse(args);
      const monthData = db.data.monthly.find((m) => m.year_month === year_month);

      if (!monthData) {
        return {
          content: [{ type: "text", text: `${year_month} のデータは見つかりませんでした。` }],
        };
      }

      // 支出の集計
      const summary: Record<string, number> = {};
      let total = 0;
      Object.values(monthData.days).forEach((expenditures) => {
        expenditures.forEach((exp) => {
          summary[exp.category] = (summary[exp.category] || 0) + exp.amount;
          total += exp.amount;
        });
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              year_month,
              total_amount: total,
              category_summary: summary,
              original_comment: monthData.comment,
              raw_data: monthData.days,
            }, null, 2),
          },
        ],
      };
    }

    if (name === "predict_upcoming_expenses") {
      const { target_month } = z.object({ target_month: z.string() }).parse(args);
      const targetMonthNum = parseInt(target_month.split("-")[1]);
      
      const recurringExpenses: any[] = [];
      
      // 過去の同じ月（別年）のデータを検索
      db.data.monthly.forEach((m) => {
        const mMonthNum = parseInt(m.year_month.split("-")[1]);
        if (mMonthNum === targetMonthNum && m.year_month !== target_month) {
          Object.entries(m.days).forEach(([day, exps]) => {
            exps.forEach(exp => {
              // 高額な支出や、メモから定期的なものを推測（簡易的）
              if (exp.amount > 5000 || exp.note.includes("税") || exp.note.includes("会費") || exp.note.includes("保険")) {
                recurringExpenses.push({
                  past_date: `${m.year_month}-${day}`,
                  category: exp.category,
                  amount: exp.amount,
                  note: exp.note
                });
              }
            });
          });
        }
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              target_month,
              prediction_basis: "過去の同時期の高額支出または定期キーワードを含む支出に基づいています。",
              potential_recurring_expenses: recurringExpenses,
            }, null, 2),
          },
        ],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error: any) {
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

/**
 * サーバーの起動
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Expenditure MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
