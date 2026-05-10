'use client'

import { useState } from 'react'
import { Clipboard, FileJson, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function ImportDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [importText, setImportText] = useState('')
  const [isImporting, setIsImporting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const router = useRouter()

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setImportText(text)
    } catch (err) {
      console.error('Failed to read clipboard:', err)
    }
  }

  const handleImport = async () => {
    if (!importText.trim()) return

    setIsImporting(true)
    setMessage(null)

    try {
      let json: any[] = []
      const trimmedText = importText.trim()

      if (trimmedText.startsWith('[') || trimmedText.startsWith('{')) {
        const parsed = JSON.parse(trimmedText)
        json = Array.isArray(parsed) ? parsed : [parsed]
      } else {
        // CSV/TSV形式のパースを試みる
        const lines = trimmedText.split(/\r?\n/)
        json = lines.map(line => {
          // タブまたはカンマで分割
          const parts = line.split(/[\t,]/)
          if (parts.length >= 3) {
            const amount = parseInt(parts[2].replace(/[^0-9-]/g, ''), 10)
            if (!isNaN(amount)) {
              return {
                date: parts[0].trim().replace(/\//g, '-'), // 2024/01/01 -> 2024-01-01
                note: parts[1].trim(),
                amount: amount
              }
            }
          }
          return null
        }).filter((item): item is { date: string, note: string, amount: number } => item !== null)
      }

      if (json.length === 0) {
        throw new Error('有効なデータが見つかりませんでした。')
      }

      const response = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json)
      })

      if (response.ok) {
        const result = await response.json()
        setMessage({ type: 'success', text: `${result.count}件のデータをインポートしました。` })
        setImportText('')
        router.refresh()
        setTimeout(() => setIsOpen(false), 2000)
      } else {
        setMessage({ type: 'error', text: 'インポートに失敗しました。形式を確認してください。' })
      }
    } catch (e) {
      setMessage({ type: 'error', text: e instanceof Error ? e.message : 'データの解析に失敗しました。' })
    } finally {
      setIsImporting(false)
    }
  }

  const exampleJson = `[
  { "date": "2026-05-10", "note": "スーパー", "amount": 2500 }
]`
  const exampleCsv = `2026-05-10	ランチ代	1200
2026-05-11,コンビニ,500`

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-muted hover:bg-muted/80 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
      >
        <Clipboard size={18} />
        <span>貼り付けインポート</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card w-full max-w-lg rounded-xl shadow-xl border p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FileJson className="text-primary" />
                データインポート
              </h2>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 p-2 rounded-lg">
                  <p className="text-[10px] font-bold mb-1 uppercase text-muted-foreground">JSON形式例</p>
                  <pre className="text-[9px] font-mono bg-background p-1.5 rounded border overflow-x-auto">
                    {exampleJson}
                  </pre>
                </div>
                <div className="bg-muted/50 p-2 rounded-lg">
                  <p className="text-[10px] font-bold mb-1 uppercase text-muted-foreground">CSV/TSV形式例</p>
                  <pre className="text-[9px] font-mono bg-background p-1.5 rounded border overflow-x-auto">
                    {exampleCsv}
                  </pre>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">JSONデータを貼り付け</label>
                  <button 
                    onClick={handlePasteFromClipboard}
                    className="text-xs text-primary hover:underline"
                  >
                    クリップボードから貼り付け
                  </button>
                </div>
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="[{ 'date': '...', 'note': '...', 'amount': ... }]"
                  className="w-full h-40 bg-background border rounded-lg p-3 text-sm font-mono focus:ring-2 focus:ring-primary outline-none resize-none"
                />
              </div>

              {message && (
                <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
                  message.type === 'success' ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive'
                }`}>
                  {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  {message.text}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-2 rounded-lg border hover:bg-muted transition-colors text-sm"
              >
                キャンセル
              </button>
              <button 
                onClick={handleImport}
                disabled={!importText.trim() || isImporting}
                className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 text-sm"
              >
                {isImporting ? "インポート中..." : "インポート実行"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
