'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BellRing } from 'lucide-react'

export function SseListener() {
  const router = useRouter()
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    let eventSource: EventSource | null = null

    try {
      eventSource = new EventSource('/api/stream')

      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data)
          if (payload.type === 'expenditure_updated') {
            if (payload.data?.source === 'wizard') {
              router.refresh()
              return
            }
            const count = payload.data?.count || 1
            setToastMessage(`📱 スマホから${count}件の支出を受信・自動反映しました`)
            router.refresh()

            setTimeout(() => {
              setToastMessage(null)
            }, 4000)
          }
        } catch (e) {
          // ignore non-json
        }
      }

      eventSource.onerror = (err) => {
        // エラー時は自動再接続される
      }
    } catch (e) {
      console.error('SSE initialization error:', e)
    }

    return () => {
      if (eventSource) {
        eventSource.close()
      }
    }
  }, [router])

  if (!toastMessage) return null

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce">
      <div className="bg-primary text-primary-foreground px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-primary/20">
        <BellRing size={20} className="animate-pulse" />
        <span className="text-sm font-semibold">{toastMessage}</span>
      </div>
    </div>
  )
}
