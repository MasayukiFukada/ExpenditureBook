'use client'

import { useState } from 'react'
import { Expenditure } from '@/types'
import { CATEGORIES } from '@/const/categories'
import { Trash2, Plus, Save, ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface EditFormProps {
  dateStr: string
  initialExpenditures: Expenditure[]
}

export function EditForm({ dateStr, initialExpenditures }: EditFormProps) {
  const [expenditures, setExpenditures] = useState<Expenditure[]>(
    initialExpenditures.length > 0 
      ? initialExpenditures 
      : [{ id: crypto.randomUUID(), category: '食費', amount: 0, note: '', updated_at: new Date().toISOString() }]
  )
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const addItem = () => {
    setExpenditures([
      ...expenditures,
      { 
        id: crypto.randomUUID(), 
        category: '食費', 
        amount: 0, 
        note: '', 
        updated_at: new Date().toISOString() 
      }
    ])
  }

  const removeItem = (id: string) => {
    setExpenditures(expenditures.filter(item => item.id !== id))
  }

  const updateItem = (id: string, field: keyof Expenditure, value: any) => {
    setExpenditures(expenditures.map(item => 
      item.id === id ? { ...item, [field]: value, updated_at: new Date().toISOString() } : item
    ))
  }

  const handleSave = async () => {
    setIsSaving(true)
    const [year, month, day] = dateStr.split('-')
    const yearMonth = `${year}-${month}`

    try {
      const response = await fetch('/api/expenditure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          yearMonth,
          day,
          expenditures: expenditures.filter(item => item.amount > 0 || item.note !== '')
        })
      })

      if (response.ok) {
        router.push(`/?month=${yearMonth}`)
        router.refresh()
      } else {
        alert('保存に失敗しました')
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('エラーが発生しました')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <div className="hidden md:grid grid-cols-[1fr_120px_2fr_40px] gap-2 p-3 bg-muted text-xs font-bold border-b">
          <div>カテゴリ</div>
          <div>金額</div>
          <div>備考</div>
          <div></div>
        </div>
        <div className="divide-y">
          {expenditures.map((item, index) => (
            <div key={item.id} className="p-3 hover:bg-muted/30 transition-colors">
              <div className="flex flex-col md:grid md:grid-cols-[1fr_120px_2fr_40px] gap-3 items-start md:items-center">
                <div className="w-full">
                  <span className="md:hidden text-[10px] font-bold text-muted-foreground uppercase mb-1 block">カテゴリ</span>
                  <select 
                    className="w-full bg-background border rounded px-2 py-1.5 text-sm"
                    value={item.category}
                    onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="w-full">
                  <span className="md:hidden text-[10px] font-bold text-muted-foreground uppercase mb-1 block">金額</span>
                  <input 
                    type="number"
                    className="w-full bg-background border rounded px-2 py-1.5 text-sm font-mono"
                    value={item.amount || ''}
                    placeholder="0"
                    onChange={(e) => updateItem(item.id, 'amount', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="w-full">
                  <span className="md:hidden text-[10px] font-bold text-muted-foreground uppercase mb-1 block">備考</span>
                  <input 
                    type="text"
                    className="w-full bg-background border rounded px-2 py-1.5 text-sm"
                    value={item.note}
                    placeholder="内容を入力..."
                    onChange={(e) => updateItem(item.id, 'note', e.target.value)}
                  />
                </div>
                <div className="flex justify-end w-full md:w-auto">
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-destructive hover:bg-destructive/10 p-1.5 rounded transition-colors"
                    title="削除"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={addItem}
        className="w-full flex items-center justify-center gap-2 border-2 border-dashed rounded-lg py-3 hover:bg-muted/50 transition-colors text-sm text-muted-foreground"
      >
        <Plus size={18} />
        <span>項目を追加</span>
      </button>

      <div className="flex gap-4 pt-4 border-t">
        <Link 
          href="/"
          className="flex-1 flex items-center justify-center gap-2 bg-muted hover:bg-muted/80 rounded-lg p-3 font-medium transition-colors text-sm"
        >
          <ChevronLeft size={18} />
          <span>戻る</span>
        </Link>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg p-3 font-medium transition-colors disabled:opacity-50 text-sm"
        >
          <Save size={18} />
          <span>{isSaving ? '保存中...' : '保存する'}</span>
        </button>
      </div>
    </div>
  )
}
