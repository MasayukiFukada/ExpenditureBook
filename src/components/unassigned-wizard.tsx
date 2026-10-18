'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UnassignedItem } from '@/types'
import { CATEGORIES } from '@/const/categories'
import { 
  Sparkles, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  CheckCircle2, 
  Loader2,
  Calendar,
  AlertCircle
} from 'lucide-react'

// 「未設定」を除外した選択可能カテゴリ一覧
const SELECTABLE_CATEGORIES = CATEGORIES.filter(c => c !== '未設定')

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

function formatDateWithDay(dateStr: string) {
  try {
    const [year, month, day] = dateStr.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    const dayOfWeek = WEEKDAYS[date.getDay()]
    return `${year}年${month}月${day}日 (${dayOfWeek})`
  } catch {
    return dateStr
  }
}

interface UnassignedWizardProps {
  initialItems: UnassignedItem[]
}

export function UnassignedWizard({ initialItems }: UnassignedWizardProps) {
  const router = useRouter()
  const [items, setItems] = useState<UnassignedItem[]>(initialItems)
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  
  // 現在選択中の値
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [currentNote, setCurrentNote] = useState<string>('')
  const [currentAmount, setCurrentAmount] = useState<number>(0)
  
  const [isSaving, setIsSaving] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [processedCount, setProcessedCount] = useState(0)

  // initialItems がサーバー側で変わった時の同期（モーダル非表示時のみ同期し、実行中のインデックスズレを防止）
  useEffect(() => {
    if (!isOpen) {
      setItems(initialItems)
    }
  }, [initialItems, isOpen])

  // 現在の未設定項目数
  const unassignedCount = items.filter(it => it.category === '未設定').length

  // 現在のカードのアイテム
  const currentItem = items[currentIndex]

  // currentIndex が変わったときにフォーム入力値を同期
  useEffect(() => {
    if (currentItem) {
      setSelectedCategory(currentItem.category === '未設定' ? '' : currentItem.category)
      setCurrentNote(currentItem.note || '')
      setCurrentAmount(currentItem.amount || 0)
    }
  }, [currentIndex, currentItem])

  const openWizard = () => {
    // 未設定項目のみを抽出して仕分け対象とする
    const unassignedOnly = initialItems.filter(it => it.category === '未設定')
    if (unassignedOnly.length === 0) return

    setItems(unassignedOnly)
    setCurrentIndex(0)
    setIsCompleted(false)
    setProcessedCount(0)
    setIsOpen(true)
  }

  const closeWizard = () => {
    setIsOpen(false)
    if (processedCount > 0) {
      router.refresh()
    } else {
      setItems(initialItems)
    }
  }

  // 「次へ」押下時の保存処理
  const handleNext = async () => {
    if (!currentItem || !selectedCategory || isSaving) return

    setIsSaving(true)
    try {
      const res = await fetch('/api/unassigned', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          yearMonth: currentItem.yearMonth,
          day: currentItem.day,
          id: currentItem.id,
          category: selectedCategory,
          note: currentNote,
          amount: currentAmount,
        }),
      })

      if (!res.ok) {
        alert('保存に失敗しました。もう一度お試しください。')
        setIsSaving(false)
        return
      }

      // ローカルデータを更新
      const updatedItems = items.map((it, idx) =>
        idx === currentIndex
          ? {
              ...it,
              category: selectedCategory,
              note: currentNote,
              amount: currentAmount,
            }
          : it
      )
      setItems(updatedItems)
      setProcessedCount(prev => prev + 1)

      // 次の項目へ進む（未設定の項目を探す、もしくは次のインデックス）
      const nextUnsetIndex = updatedItems.findIndex(
        (it, idx) => idx > currentIndex && it.category === '未設定'
      )

      if (nextUnsetIndex !== -1) {
        setCurrentIndex(nextUnsetIndex)
      } else {
        // 先頭側にも未設定が残っているかチェック
        const anyUnsetIndex = updatedItems.findIndex(it => it.category === '未設定')
        if (anyUnsetIndex !== -1) {
          setCurrentIndex(anyUnsetIndex)
        } else {
          // すべて完了！
          setIsCompleted(true)
        }
      }
    } catch (e) {
      console.error('Wizard save error:', e)
      alert('エラーが発生しました。通信環境を確認してください。')
    } finally {
      setIsSaving(false)
    }
  }

  // スキップ処理（保存せずに次へ）
  const handleSkip = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      // 最後のアイテムだった場合
      const firstUnsetIndex = items.findIndex(it => it.category === '未設定')
      if (firstUnsetIndex !== -1 && firstUnsetIndex !== currentIndex) {
        setCurrentIndex(firstUnsetIndex)
      } else {
        closeWizard()
      }
    }
  }

  // 前へ戻る
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }

  return (
    <>
      {/* 未設定が存在するときに表示するトップバナー */}
      {unassignedCount > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm transition-all animate-in fade-in slide-in-from-top-2 overflow-hidden">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 w-full sm:w-auto">
            <div className="bg-amber-500 text-amber-950 p-2 rounded-lg shrink-0">
              <Sparkles size={20} className="animate-pulse" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm sm:text-base text-amber-900 dark:text-amber-200">
                  未設定の支出が {unassignedCount} 件あります
                </span>
                <span className="text-[10px] sm:text-xs bg-amber-500/20 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded-full font-medium shrink-0">
                  要仕分け
                </span>
              </div>
              <p className="text-xs text-amber-700/80 dark:text-amber-300/80 mt-0.5 truncate sm:whitespace-normal">
                1問1答形式でサクサクっとカテゴリを設定できます
              </p>
            </div>
          </div>
          <button
            onClick={openWizard}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-medium px-4 py-2.5 rounded-lg shadow transition-all text-sm shrink-0"
          >
            <span>サクサク仕分ける</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* ウィザードモーダル */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4 animate-in fade-in duration-200">
          <div 
            className="bg-card text-card-foreground border rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden max-h-[92vh] animate-in zoom-in-95 duration-150 mx-auto"
            role="dialog"
            aria-modal="true"
          >
            {/* ヘッダー */}
            <div className="p-3.5 sm:p-4 border-b bg-muted/40 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-bold text-sm sm:text-base flex items-center gap-1.5 truncate">
                  <Sparkles size={18} className="text-amber-500 shrink-0" />
                  1問1答 仕分け
                </span>
                {!isCompleted && items.length > 0 && (
                  <span className="text-xs font-mono bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full shrink-0">
                    残り {unassignedCount} 件
                  </span>
                )}
              </div>
              <button
                onClick={closeWizard}
                className="text-muted-foreground hover:text-foreground hover:bg-muted p-1.5 rounded-full transition-colors shrink-0"
                title="閉じる"
              >
                <X size={18} />
              </button>
            </div>

            {/* 進捗プログレスバー */}
            {!isCompleted && items.length > 0 && (
              <div className="w-full bg-muted h-1 shrink-0 overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all duration-300 ease-out"
                  style={{
                    width: `${Math.min(100, ((currentIndex + 1) / items.length) * 100)}%`
                  }}
                />
              </div>
            )}

            {/* コンテンツエリア */}
            {isCompleted ? (
              // 完了画面
              <div className="p-6 sm:p-8 text-center flex flex-col items-center justify-center space-y-4 my-auto">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center animate-in zoom-in">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold">すべての仕分けが完了しました！</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  未設定の項目がすべて設定されました。<br />
                  カレンダーと集計データに反映されます。
                </p>
                <button
                  onClick={closeWizard}
                  className="w-full mt-4 bg-primary text-primary-foreground font-medium py-3 rounded-xl hover:bg-primary/90 transition-colors shadow"
                >
                  完了して戻る
                </button>
              </div>
            ) : currentItem ? (
              // 1問1答カード
              <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-4 sm:space-y-5">
                {/* 日付・進捗表示 */}
                <div className="flex items-center justify-between text-xs text-muted-foreground border-b pb-2">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Calendar size={14} className="text-primary shrink-0" />
                    <span>{formatDateWithDay(currentItem.date)}</span>
                  </div>
                  <span className="font-mono">
                    {currentIndex + 1} / {items.length} 件目
                  </span>
                </div>

                {/* 金額・備考表示カード */}
                <div className="bg-muted/30 border rounded-xl p-3 sm:p-4 text-center space-y-2.5 sm:space-y-3">
                  <div className="space-y-0.5 sm:space-y-1">
                    <span className="text-xs text-muted-foreground font-medium">支出金額</span>
                    <div className="text-2xl sm:text-4xl font-mono font-black text-primary tracking-tight">
                      ¥{currentAmount.toLocaleString()}
                    </div>
                  </div>

                  {/* 備考（タップで編集可能） */}
                  <div className="pt-2 border-t border-border/50 text-left">
                    <label className="text-[11px] font-bold text-muted-foreground block mb-1">
                      備考・店名 (修正可)
                    </label>
                    <input
                      type="text"
                      value={currentNote}
                      onChange={(e) => setCurrentNote(e.target.value)}
                      placeholder="内容や店名を入力..."
                      className="w-full bg-background border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>
                </div>

                {/* カテゴリ選択パレット */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">
                      ▼ カテゴリを選択してください
                    </span>
                    {selectedCategory ? (
                      <span className="text-xs text-primary font-bold flex items-center gap-1">
                        <Check size={12} />
                        選択中: {selectedCategory}
                      </span>
                    ) : (
                      <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                        ボタンを押して選択
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                    {SELECTABLE_CATEGORIES.map((cat) => {
                      const isSelected = selectedCategory === cat
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedCategory(cat)}
                          className={`py-2 px-1 sm:py-2.5 sm:px-2 rounded-xl text-xs sm:text-sm font-medium border transition-all flex items-center justify-center gap-1 active:scale-95 min-h-[40px] ${
                            isSelected
                              ? 'bg-primary text-primary-foreground border-primary shadow-md font-bold scale-[1.02]'
                              : 'bg-background hover:bg-muted/80 text-foreground border-border/80'
                          }`}
                        >
                          {isSelected && <Check size={12} className="shrink-0" />}
                          <span className="truncate">{cat}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                未設定の項目はありません。
              </div>
            )}

            {/* フッターアクションバー */}
            {!isCompleted && currentItem && (
              <div className="p-3 sm:p-4 border-t bg-muted/40 flex items-center justify-between gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentIndex === 0 || isSaving}
                  className="flex items-center gap-1 px-2.5 sm:px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <ChevronLeft size={16} />
                  <span>前へ</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSkip}
                    disabled={isSaving}
                    className="px-2.5 sm:px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
                  >
                    スキップ
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!selectedCategory || isSaving}
                    className={`flex items-center justify-center gap-1 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all ${
                      selectedCategory && !isSaving
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95'
                        : 'bg-muted text-muted-foreground opacity-50 cursor-not-allowed'
                    }`}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>保存中...</span>
                      </>
                    ) : unassignedCount === 1 ? (
                      <>
                        <Check size={16} />
                        <span>完了する</span>
                      </>
                    ) : (
                      <>
                        <span>次へ</span>
                        <ChevronRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
