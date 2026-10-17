import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { UnassignedItem } from "@/types";
import { eventEmitter, EVENT_EXPENDITURE_UPDATED } from "@/lib/events";

export async function GET() {
  try {
    const db = await getDb();
    const items: UnassignedItem[] = [];

    for (const monthly of db.data.monthly) {
      for (const day in monthly.days) {
        const expenditures = monthly.days[day] || [];
        for (const item of expenditures) {
          if (item.category === "未設定") {
            const date = `${monthly.year_month}-${day.padStart(2, "0")}`;
            items.push({
              yearMonth: monthly.year_month,
              day,
              date,
              id: item.id,
              category: item.category,
              amount: item.amount,
              note: item.note,
              updated_at: item.updated_at,
            });
          }
        }
      }
    }

    // 日付昇順（古い未設定項目から順に仕分け）
    items.sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error("Error fetching unassigned items:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { yearMonth, day, id, category, note, amount } = (await req.json()) as {
      yearMonth: string;
      day: string;
      id: string;
      category: string;
      note?: string;
      amount?: number;
    };

    if (!yearMonth || !day || !id || !category) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const monthlyIndex = db.data.monthly.findIndex(
      (m) => m.year_month === yearMonth
    );
    if (monthlyIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Month not found" },
        { status: 404 }
      );
    }

    const dayItems = db.data.monthly[monthlyIndex].days[day];
    if (!dayItems) {
      return NextResponse.json(
        { success: false, error: "Day not found" },
        { status: 404 }
      );
    }

    const itemIndex = dayItems.findIndex((it) => it.id === id);
    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Item not found" },
        { status: 404 }
      );
    }

    dayItems[itemIndex].category = category;
    if (note !== undefined) {
      dayItems[itemIndex].note = note;
    }
    if (amount !== undefined) {
      dayItems[itemIndex].amount = amount;
    }
    dayItems[itemIndex].updated_at = new Date().toISOString();

    await db.write();

    // 他クライアントへのリアルタイム通知（source: 'wizard' として通知）
    eventEmitter.emit(EVENT_EXPENDITURE_UPDATED, {
      source: "wizard",
      type: "item_updated",
      yearMonth,
      day,
      id,
    });

    return NextResponse.json({ success: true, item: dayItems[itemIndex] });
  } catch (error) {
    console.error("Error updating unassigned item:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
