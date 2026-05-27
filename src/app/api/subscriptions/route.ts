import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { Subscription } from '@/types'

export async function GET() {
  try {
    const db = await getDb()
    const subscriptions = db.data.subscriptions || []
    return NextResponse.json({ success: true, subscriptions })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json() as Subscription
    const db = await getDb()
    if (!db.data.subscriptions) db.data.subscriptions = []

    // 更新（id があれば更新、それ以外は新規作成）
    if (payload.id) {
      const idx = db.data.subscriptions.findIndex(s => s.id === payload.id)
      if (idx !== -1) {
        db.data.subscriptions[idx] = {
          ...db.data.subscriptions[idx],
          ...payload,
          updated_at: new Date().toISOString()
        }
        await db.write()
        return NextResponse.json({ success: true, subscription: db.data.subscriptions[idx] })
      }
    }

    const newSub: Subscription = {
      ...payload,
      id: (globalThis as any).crypto?.randomUUID ? (globalThis as any).crypto.randomUUID() : Math.random().toString(36).slice(2),
      created_at: new Date().toISOString()
    }

    db.data.subscriptions.unshift(newSub)
    await db.write()
    return NextResponse.json({ success: true, subscription: newSub })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    const db = await getDb()
    if (!db.data.subscriptions) db.data.subscriptions = []
    const idx = db.data.subscriptions.findIndex(s => s.id === id)
    if (idx !== -1) {
      db.data.subscriptions.splice(idx, 1)
      await db.write()
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
