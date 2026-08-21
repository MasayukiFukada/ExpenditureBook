'use client'

import { useState, useEffect } from 'react'
import { QrCode, Smartphone, Copy, Check, Info, Server } from 'lucide-react'

export function PairingDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [origin, setOrigin] = useState('')
  const [mdnsUrl, setMdnsUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentOrigin = window.location.origin
      setOrigin(currentOrigin)

      // mDNSベースの標準URL
      const protocol = window.location.protocol
      const port = window.location.port ? `:${window.location.port}` : ''
      setMdnsUrl(`${protocol}//expenditure.local${port}`)
    }
  }, [])

  const targetUrl = origin || mdnsUrl || 'http://expenditure.local:3000'
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(targetUrl)}`


  const handleCopy = () => {
    navigator.clipboard.writeText(targetUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-3 py-2 rounded-lg font-medium transition-colors text-sm"
        title="スマホPWA連携用ペアリング"
      >
        <Smartphone size={18} />
        <span className="hidden sm:inline">スマホ連携</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card w-full max-w-md rounded-xl shadow-xl border p-6 space-y-4 text-card-foreground">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <QrCode className="text-primary" size={20} />
                スマホPWAペアリング
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-center">
              <p className="text-xs text-muted-foreground">
                スマホのPWAアプリでこのQRコードをスキャンすると、接続先が自動保存されます。
              </p>

              <div className="flex justify-center p-3 bg-white rounded-lg border w-fit mx-auto shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrApiUrl}
                  alt="Pairing QR Code"
                  className="w-44 h-44 object-contain"
                />
              </div>

              <div className="bg-muted/50 p-3 rounded-lg text-left space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                  <span className="flex items-center gap-1">
                    <Server size={14} /> 接続先URL (mDNS / IP)
                  </span>
                  <button
                    onClick={handleCopy}
                    className="text-primary flex items-center gap-1 hover:underline"
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? 'コピー完了' : 'コピー'}
                  </button>
                </div>
                <div className="font-mono text-xs break-all bg-background p-2 rounded border font-semibold">
                  {targetUrl}
                </div>
              </div>

              <div className="bg-blue-500/10 text-blue-600 dark:text-blue-400 p-3 rounded-lg text-xs flex items-start gap-2 text-left">
                <Info size={16} className="mt-0.5 shrink-0" />
                <div>
                  <strong>ヒント:</strong> 同一Wi-Fi環境でDocker起動している場合、<code>expenditure.local:3000</code> で接続可能です。
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:bg-primary/90 text-sm transition-colors"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
