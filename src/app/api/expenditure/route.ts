import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { Expenditure } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const { yearMonth, day, expenditures } = await req.json() as {
      yearMonth: string,
      day: string,
      expenditures: Expenditure[]
    }

    const db = await getDb()
    const monthlyIndex = db.data.monthly.findIndex(m => m.year_month === yearMonth)

    if (monthlyIndex === -1) {
      // 新しい月を作成
      db.data.monthly.push({
        year_month: yearMonth,
        comment: "",
        days: {
          [day]: expenditures
        }
      })
      // 月のリストを降順でソート（最新が先頭）
      db.data.monthly.sort((a, b) => b.year_month.localeCompare(a.year_month))
    } else {
      // 既存の月のデータを更新
      db.data.monthly[monthlyIndex].days[day] = expenditures
      
      // もし支出が0件になったらその日のキーを削除してもよいが、
      // 柔軟性のために空配列として残すか、削除するか検討。
      // ここでは空配列なら削除することにする。
      if (expenditures.length === 0) {
        delete db.data.monthly[monthlyIndex].days[day]
      }
    }

    await db.write()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
