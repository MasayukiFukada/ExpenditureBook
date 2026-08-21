import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { Expenditure } from '@/types'
import { eventEmitter, EVENT_EXPENDITURE_UPDATED } from '@/lib/events'

interface ImportItem {
  date: string;    // YYYY-MM-DD
  note: string;
  amount: number;
  category?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(req: NextRequest) {
  try {
    const rawData = await req.json()
    const items: ImportItem[] = Array.isArray(rawData) ? rawData : [rawData]
    const db = await getDb()

    for (const item of items) {
      if (!item.date || typeof item.amount !== 'number') continue

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
        category: item.category || "未設定",
        amount: item.amount,
        note: item.note || "",
        updated_at: new Date().toISOString()
      }

      if (!db.data.monthly[monthlyIndex].days[day]) {
        db.data.monthly[monthlyIndex].days[day] = []
      }
      
      db.data.monthly[monthlyIndex].days[day].push(newExpenditure)
    }

    await db.write()

    // リアルタイム通知イベントを発火
    eventEmitter.emit(EVENT_EXPENDITURE_UPDATED, { count: items.length, items })

    return NextResponse.json({ success: true, count: items.length }, { headers: corsHeaders })
  } catch (error) {
    console.error('Import Error:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500, headers: corsHeaders })
  }
}


