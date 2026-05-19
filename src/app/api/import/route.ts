import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { Expenditure } from '@/types'

interface ImportItem {
  date: string;    // YYYY-MM-DD
  note: string;
  amount: number;
}

export async function POST(req: NextRequest) {
  try {
    const items = await req.json() as ImportItem[]
    const db = await getDb()

    for (const item of items) {
      const [year, month, day] = item.date.split('-')
      const yearMonth = `${year}-${month}`
      
      let monthlyIndex = db.data.monthly.findIndex(m => m.year_month === yearMonth)
      
      if (monthlyIndex === -1) {
        db.data.monthly.push({
          year_month: yearMonth,
          comment: "",
          days: {}
        })
        // ソート
        db.data.monthly.sort((a, b) => b.year_month.localeCompare(a.year_month))
        monthlyIndex = db.data.monthly.findIndex(m => m.year_month === yearMonth)
      }

      const newExpenditure: Expenditure = {
        id: crypto.randomUUID(),
        category: "未設定", // インポート時はデフォルトで未設定
        amount: item.amount,
        note: item.note,
        updated_at: new Date().toISOString()
      }

      if (!db.data.monthly[monthlyIndex].days[day]) {
        db.data.monthly[monthlyIndex].days[day] = []
      }
      
      db.data.monthly[monthlyIndex].days[day].push(newExpenditure)
    }

    await db.write()
    return NextResponse.json({ success: true, count: items.length })
  } catch (error) {
    console.error('Import Error:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
