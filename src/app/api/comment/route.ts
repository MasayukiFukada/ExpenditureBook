import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { yearMonth, comment } = await req.json() as {
      yearMonth: string,
      comment: string
    }

    const db = await getDb()
    const monthlyIndex = db.data.monthly.findIndex(m => m.year_month === yearMonth)

    if (monthlyIndex !== -1) {
      db.data.monthly[monthlyIndex].comment = comment
      await db.write()
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, error: 'Month not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
