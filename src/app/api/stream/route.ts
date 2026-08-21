import { NextRequest } from 'next/server'
import { eventEmitter, EVENT_EXPENDITURE_UPDATED } from '@/lib/events'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()

      // 接続開始メッセージ
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected' })}\n\n`))

      // イベントリスナー
      const onExpenditureUpdated = (data: any) => {
        try {
          const payload = `data: ${JSON.stringify({ type: 'expenditure_updated', data })}\n\n`
          controller.enqueue(encoder.encode(payload))
        } catch (e) {
          console.error('Error sending SSE message:', e)
        }
      }

      eventEmitter.on(EVENT_EXPENDITURE_UPDATED, onExpenditureUpdated)

      // キープアライブ (30秒ごと)
      const interval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: keepalive\n\n`))
        } catch (e) {
          clearInterval(interval)
        }
      }, 30000)

      // クライアント切断処理
      req.signal.addEventListener('abort', () => {
        clearInterval(interval)
        eventEmitter.off(EVENT_EXPENDITURE_UPDATED, onExpenditureUpdated)
        try {
          controller.close()
        } catch (e) {
          // すでにクローズされている場合は無視
        }
      })
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  })
}
