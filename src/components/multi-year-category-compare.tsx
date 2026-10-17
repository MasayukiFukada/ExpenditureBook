'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import {
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Table as TableIcon,
  BarChart2,
  Layers,
  Sparkles,
} from 'lucide-react'

const YEAR_COLORS = [
  '#2563eb', // blue
  '#16a34a', // green
  '#d97706', // amber
  '#dc2626', // red
  '#9333ea', // purple
  '#0891b2', // cyan
  '#ea580c', // orange
  '#4f46e5', // indigo
  '#059669', // emerald
  '#db2777', // pink
]

export interface YearlyDataWithCategories {
  year: string
  totalAmount: number
  monthsCount: number
  monthlyAverage: number
  projectedTotal?: number
  isCurrentYear?: boolean
  categoryTotals: { [category: string]: number }
}

interface MultiYearCategoryCompareProps {
  yearlyData: YearlyDataWithCategories[]
  allCategories: string[]
  allYears: string[]
}

export function MultiYearCategoryCompare({
  yearlyData,
  allCategories,
  allYears,
}: MultiYearCategoryCompareProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  // ソートされた年のリスト（新しい順）
  const descYears = useMemo(() => {
    return [...yearlyData].sort((a, b) => b.year.localeCompare(a.year))
  }, [yearlyData])

  // 選択された比較年（デフォルトは最も新しい年）
  const [selectedYear, setSelectedYear] = useState<string>(
    descYears.length > 0 ? descYears[0].year : ''
  )

  // 年次一覧テーブルのアコーディオン開閉状態（キー: 年）
  const [expandedYears, setExpandedYears] = useState<{ [year: string]: boolean }>({
    // 初期状態では最新年を展開
    ...(descYears.length > 0 ? { [descYears[0].year]: true } : {}),
  })

  // マトリクスの表示モード（金額 / 前年比 / 前年差額）
  const [matrixMode, setMatrixMode] = useState<'amount' | 'rate' | 'diff'>('amount')

  // カテゴリ比較テーブルのソート（amount / diff / rate）
  const [categorySortKey, setCategorySortKey] = useState<'amount' | 'diff' | 'rate'>('amount')
  const [categorySortAsc, setCategorySortAsc] = useState<boolean>(false)

  const toggleExpand = (year: string) => {
    setExpandedYears((prev) => ({
      ...prev,
      [year]: !prev[year],
    }))
  }

  // チャートで比較表示する年（初期値: 直近3年）
  const [selectedChartYears, setSelectedChartYears] = useState<string[]>(() => {
    return allYears.slice(-3)
  })

  // 表示するカテゴリ件数（8件 / 12件 / 全件）
  const [chartCategoryLimit, setChartCategoryLimit] = useState<number>(8)

  const toggleChartYear = (year: string) => {
    setSelectedChartYears((prev) => {
      if (prev.includes(year)) {
        if (prev.length <= 1) return prev // 最低1年は選択維持
        return prev.filter((y) => y !== year)
      } else {
        return [...prev, year].sort((a, b) => a.localeCompare(b))
      }
    })
  }

  const setChartYearPreset = (preset: 'recent2' | 'recent3' | 'recent5' | 'all') => {
    if (preset === 'recent2') setSelectedChartYears(allYears.slice(-2))
    else if (preset === 'recent3') setSelectedChartYears(allYears.slice(-3))
    else if (preset === 'recent5') setSelectedChartYears(allYears.slice(-5))
    else if (preset === 'all') setSelectedChartYears([...allYears])
  }

  // 選択された年とその前年のデータ（サマリーカード・テーブル用）
  const currentYearObj = useMemo(() => {
    return yearlyData.find((y) => y.year === selectedYear)
  }, [yearlyData, selectedYear])

  const prevYearObj = useMemo(() => {
    if (!currentYearObj) return undefined
    const prevYearNum = parseInt(currentYearObj.year, 10) - 1
    return yearlyData.find((y) => y.year === String(prevYearNum))
  }, [yearlyData, currentYearObj])

  // カテゴリ別比較データ
  const categoryComparisonList = useMemo(() => {
    if (!currentYearObj) return []

    return allCategories
      .map((cat) => {
        const curAmount = currentYearObj.categoryTotals[cat] || 0
        const prevAmount = prevYearObj ? prevYearObj.categoryTotals[cat] || 0 : null
        const diffAmount = prevAmount !== null ? curAmount - prevAmount : null
        const diffRate =
          prevAmount !== null && prevAmount > 0
            ? (diffAmount! / prevAmount) * 100
            : prevAmount === 0 && curAmount > 0
            ? 100
            : null
        const share =
          currentYearObj.totalAmount > 0
            ? (curAmount / currentYearObj.totalAmount) * 100
            : 0

        return {
          category: cat,
          curAmount,
          prevAmount,
          diffAmount,
          diffRate,
          share,
        }
      })
      .filter((item) => item.curAmount > 0 || (item.prevAmount !== null && item.prevAmount > 0))
      .sort((a, b) => {
        let cmp = 0
        if (categorySortKey === 'amount') {
          cmp = b.curAmount - a.curAmount
        } else if (categorySortKey === 'diff') {
          cmp = (b.diffAmount ?? -Infinity) - (a.diffAmount ?? -Infinity)
        } else if (categorySortKey === 'rate') {
          cmp = (b.diffRate ?? -Infinity) - (a.diffRate ?? -Infinity)
        }
        return categorySortAsc ? -cmp : cmp
      })
  }, [currentYearObj, prevYearObj, allCategories, categorySortKey, categorySortAsc])

  // 最大増加カテゴリ & 最大節約カテゴリの計算
  const { topIncrease, topDecrease } = useMemo(() => {
    if (!prevYearObj || categoryComparisonList.length === 0) {
      return { topIncrease: null, topDecrease: null }
    }
    const withDiff = categoryComparisonList.filter(
      (c) => c.diffAmount !== null && c.diffAmount !== 0
    )
    const sortedByDiff = [...withDiff].sort((a, b) => (b.diffAmount ?? 0) - (a.diffAmount ?? 0))
    const topInc = sortedByDiff.length > 0 && (sortedByDiff[0].diffAmount ?? 0) > 0 ? sortedByDiff[0] : null
    const topDec =
      sortedByDiff.length > 0 && (sortedByDiff[sortedByDiff.length - 1].diffAmount ?? 0) < 0
        ? sortedByDiff[sortedByDiff.length - 1]
        : null
    return { topIncrease: topInc, topDecrease: topDec }
  }, [categoryComparisonList, prevYearObj])

  // 複数年カテゴリ比較チャート用データ
  const multiYearChartData = useMemo(() => {
    if (selectedChartYears.length === 0) return []

    // 選択された年の中で合計支出が多いカテゴリ順にソート
    const categoryTotalsInSelectedYears = allCategories.map((cat) => {
      const sum = selectedChartYears.reduce((acc, yr) => {
        const yData = yearlyData.find((d) => d.year === yr)
        return acc + (yData?.categoryTotals[cat] || 0)
      }, 0)
      return { category: cat, sum }
    }).filter((c) => c.sum > 0).sort((a, b) => b.sum - a.sum)

    const targetCategories =
      chartCategoryLimit > 0
        ? categoryTotalsInSelectedYears.slice(0, chartCategoryLimit)
        : categoryTotalsInSelectedYears

    return targetCategories.map(({ category }) => {
      const row: { [key: string]: string | number } = { category }
      selectedChartYears.forEach((year) => {
        const yData = yearlyData.find((d) => d.year === year)
        row[year] = yData?.categoryTotals[category] || 0
      })
      return row
    })
  }, [selectedChartYears, allCategories, yearlyData, chartCategoryLimit])

  return (
    <div className="space-y-10 min-w-0">
      {/* セクション1: 年次データ一覧 & カテゴリ別アコーディオン */}
      <section className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Layers className="text-primary" size={22} />
              <span>年次データ一覧 & カテゴリ別内訳</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              各年の総支出、月平均および前年比。行をクリックするとカテゴリ別の詳細前年比を展開できます
            </p>
          </div>
          <div className="text-xs text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-lg self-start sm:self-auto">
            💡 行をクリックでカテゴリ内訳を開閉
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="p-3 font-semibold rounded-tl-lg">年</th>
                <th className="p-3 font-semibold text-right">年間総支出</th>
                <th className="p-3 font-semibold text-center">記録月数</th>
                <th className="p-3 font-semibold text-right">月平均支出</th>
                <th className="p-3 font-semibold text-right">前年差額</th>
                <th className="p-3 font-semibold text-right">前年比</th>
                <th className="p-3 font-semibold text-center">内訳</th>
                <th className="p-3 font-semibold text-center rounded-tr-lg">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {descYears.map((summary, index) => {
                const prevSummary = descYears[index + 1]
                const diffAmount = prevSummary
                  ? summary.totalAmount - prevSummary.totalAmount
                  : null
                const diffRate =
                  prevSummary && prevSummary.totalAmount > 0
                    ? (diffAmount! / prevSummary.totalAmount) * 100
                    : null
                const isExpanded = !!expandedYears[summary.year]

                // 当該年のカテゴリ別一覧（金額降順）
                const yearCategories = allCategories
                  .map((cat) => {
                    const amount = summary.categoryTotals[cat] || 0
                    const prevAmount = prevSummary ? prevSummary.categoryTotals[cat] || 0 : null
                    const catDiff = prevAmount !== null ? amount - prevAmount : null
                    const catRate =
                      prevAmount !== null && prevAmount > 0
                        ? (catDiff! / prevAmount) * 100
                        : prevAmount === 0 && amount > 0
                        ? 100
                        : null
                    const share =
                      summary.totalAmount > 0 ? (amount / summary.totalAmount) * 100 : 0
                    return {
                      category: cat,
                      amount,
                      prevAmount,
                      diff: catDiff,
                      rate: catRate,
                      share,
                    }
                  })
                  .filter((c) => c.amount > 0 || (c.prevAmount !== null && c.prevAmount > 0))
                  .sort((a, b) => b.amount - a.amount)

                return (
                  <tr key={summary.year} className="group">
                    <td colSpan={8} className="p-0">
                      {/* メイン行 */}
                      <div
                        onClick={() => toggleExpand(summary.year)}
                        className={`flex items-center w-full cursor-pointer transition-colors p-3 hover:bg-muted/40 ${
                          isExpanded ? 'bg-muted/20 font-medium' : ''
                        }`}
                      >
                        <div className="w-[15%] min-w-[120px] font-bold text-base flex items-center gap-2">
                          <button
                            type="button"
                            className="p-1 rounded hover:bg-muted text-muted-foreground"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleExpand(summary.year)
                            }}
                          >
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                          <span>{summary.year}年</span>
                          {summary.isCurrentYear && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-normal">
                              今年
                            </span>
                          )}
                        </div>

                        <div className="w-[18%] text-right font-mono font-bold text-base">
                          ¥{summary.totalAmount.toLocaleString()}
                          {summary.projectedTotal && (
                            <div className="text-xs text-muted-foreground font-normal">
                              (見込 ¥{summary.projectedTotal.toLocaleString()})
                            </div>
                          )}
                        </div>

                        <div className="w-[12%] text-center text-muted-foreground text-xs sm:text-sm">
                          {summary.monthsCount} / 12ヶ月
                        </div>

                        <div className="w-[15%] text-right font-mono">
                          ¥{summary.monthlyAverage.toLocaleString()}
                        </div>

                        <div className="w-[15%] text-right font-mono">
                          {diffAmount !== null ? (
                            <span
                              className={
                                diffAmount > 0
                                  ? 'text-red-500 font-medium'
                                  : diffAmount < 0
                                  ? 'text-emerald-600 font-medium'
                                  : 'text-muted-foreground'
                              }
                            >
                              {diffAmount > 0 ? '+' : ''}
                              ¥{diffAmount.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </div>

                        <div className="w-[12%] text-right font-mono">
                          {diffRate !== null ? (
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                diffRate > 0
                                  ? 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400'
                                  : diffRate < 0
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                                  : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              {diffRate > 0 ? '+' : ''}
                              {diffRate.toFixed(1)}%
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </div>

                        <div className="w-[8%] text-center">
                          <button
                            type="button"
                            className="text-xs text-muted-foreground hover:text-foreground flex items-center justify-center gap-1 mx-auto"
                          >
                            <span>{isExpanded ? '閉じる' : '内訳'}</span>
                          </button>
                        </div>

                        <div className="w-[8%] text-center" onClick={(e) => e.stopPropagation()}>
                          <Link
                            href={`/?year=${summary.year}`}
                            className="inline-flex items-center text-xs text-primary hover:underline font-medium"
                          >
                            詳細へ
                          </Link>
                        </div>
                      </div>

                      {/* アコーディオン展開部分: カテゴリ別内訳 */}
                      {isExpanded && (
                        <div className="p-4 bg-muted/10 border-t border-b border-border/60">
                          <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                            <span className="font-semibold text-foreground text-sm">
                              📊 {summary.year}年 カテゴリ別支出 & 前年比較
                            </span>
                            {prevSummary && (
                              <span>前年({prevSummary.year}年)との比較</span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                            {yearCategories.map((catItem) => (
                              <div
                                key={catItem.category}
                                className="bg-card p-3.5 rounded-lg border border-border shadow-xs flex flex-col justify-between space-y-2"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-sm">
                                    {catItem.category}
                                  </span>
                                  <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-mono font-medium">
                                    {catItem.share.toFixed(1)}%
                                  </span>
                                </div>

                                <div className="flex items-baseline justify-between">
                                  <span className="text-base font-bold font-mono">
                                    ¥{catItem.amount.toLocaleString()}
                                  </span>
                                  {catItem.prevAmount !== null && (
                                    <span className="text-xs text-muted-foreground font-mono">
                                      前年: ¥{catItem.prevAmount.toLocaleString()}
                                    </span>
                                  )}
                                </div>

                                {/* プログレスバー */}
                                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                                  <div
                                    className="bg-primary/80 h-1.5 rounded-full"
                                    style={{ width: `${Math.min(100, Math.max(0, catItem.share))}%` }}
                                  />
                                </div>

                                {/* 前年比バッジ */}
                                {catItem.diff !== null ? (
                                  <div className="flex items-center justify-between pt-1.5 border-t border-border/40 text-xs font-mono">
                                    <span className="text-muted-foreground">前年比:</span>
                                    <div className="flex items-center gap-1.5">
                                      <span
                                        className={
                                          catItem.diff > 0
                                            ? 'text-red-500 font-medium'
                                            : catItem.diff < 0
                                            ? 'text-emerald-600 font-medium'
                                            : 'text-muted-foreground'
                                        }
                                      >
                                        {catItem.diff > 0 ? '+' : ''}
                                        ¥{catItem.diff.toLocaleString()}
                                      </span>
                                      {catItem.rate !== null && (
                                        <span
                                          className={`px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                                            catItem.rate > 0
                                              ? 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400'
                                              : catItem.rate < 0
                                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                                              : 'bg-muted text-muted-foreground'
                                          }`}
                                        >
                                          {catItem.rate > 0 ? '+' : ''}
                                          {catItem.rate.toFixed(1)}%
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="pt-1 text-xs text-muted-foreground text-right font-mono">
                                    前年記録なし
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* セクション2: カテゴリ別前年比較 & 増減分析 */}
      <section className="bg-card p-6 rounded-xl border shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="text-primary" size={22} />
              <span>カテゴリ別 前年比較・増減分析</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              指定年の各カテゴリ支出を前年と比較し、増減要因を詳しく分析します
            </p>
          </div>

          {/* 年選択タブ */}
          <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-lg self-start sm:self-auto overflow-x-auto">
            {descYears.map((y) => (
              <button
                key={y.year}
                type="button"
                onClick={() => setSelectedYear(y.year)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  selectedYear === y.year
                    ? 'bg-background text-foreground shadow-xs font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {y.year}年
              </button>
            ))}
          </div>
        </div>

        {/* ハイライトサマリーカード */}
        {prevYearObj ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-muted/30 p-4 rounded-xl border flex flex-col justify-between">
              <span className="text-xs font-medium text-muted-foreground">比較対象</span>
              <div className="mt-1">
                <span className="text-lg font-bold">
                  {selectedYear}年 vs {prevYearObj.year}年
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">
                  前年総支出: ¥{prevYearObj.totalAmount.toLocaleString()}
                </p>
              </div>
            </div>

            {topIncrease ? (
              <div className="bg-red-500/5 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 p-4 rounded-xl border flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-red-600 dark:text-red-400">
                    📈 最大増加カテゴリ
                  </span>
                  <span className="text-xs bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300 px-1.5 py-0.5 rounded font-mono font-medium">
                    +{topIncrease.diffRate?.toFixed(1)}%
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-lg font-bold text-red-600 dark:text-red-400">
                    {topIncrease.category}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono mt-0.5">
                    +¥{topIncrease.diffAmount?.toLocaleString()} (¥
                    {topIncrease.curAmount.toLocaleString()})
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-muted/30 p-4 rounded-xl border flex flex-col justify-between">
                <span className="text-xs text-muted-foreground">最大増加カテゴリ</span>
                <span className="text-sm text-muted-foreground">なし</span>
              </div>
            )}

            {topDecrease ? (
              <div className="bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 p-4 rounded-xl border flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    📉 最大節約カテゴリ
                  </span>
                  <span className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 px-1.5 py-0.5 rounded font-mono font-medium">
                    {topDecrease.diffRate?.toFixed(1)}%
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {topDecrease.category}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono mt-0.5">
                    ¥{topDecrease.diffAmount?.toLocaleString()} (¥
                    {topDecrease.curAmount.toLocaleString()})
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-muted/30 p-4 rounded-xl border flex flex-col justify-between">
                <span className="text-xs text-muted-foreground">最大節約カテゴリ</span>
                <span className="text-sm text-muted-foreground">なし</span>
              </div>
            )}

            <div className="bg-muted/30 p-4 rounded-xl border flex flex-col justify-between">
              <span className="text-xs font-medium text-muted-foreground">支出カテゴリ数</span>
              <div className="mt-1">
                <span className="text-2xl font-bold font-mono">
                  {categoryComparisonList.filter((c) => c.curAmount > 0).length}
                </span>
                <span className="text-xs text-muted-foreground ml-1">/ {allCategories.length} 種</span>
                <p className="text-xs text-muted-foreground mt-0.5">
                  前年記録: {allCategories.filter((c) => (prevYearObj.categoryTotals[c] || 0) > 0).length} 種
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-muted/40 rounded-lg text-sm text-muted-foreground">
            ※ {selectedYear}年の前年データが存在しないため、前年比の計算は行われません。
          </div>
        )}

        {/* グラフ: カテゴリ別支出 複数年比較チャート */}
        {multiYearChartData.length > 0 && (
          <div className="space-y-4 pt-2 border-t">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <BarChart2 size={16} className="text-primary" />
                  <span>主要カテゴリ支出の複数年比較</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  選択した年度のカテゴリ別支出を並べて推移を比較できます
                </p>
              </div>

              {/* プリセット ＆ 表示件数セレクター */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-md">
                  <span className="text-muted-foreground px-1">プリセット:</span>
                  <button
                    type="button"
                    onClick={() => setChartYearPreset('recent2')}
                    className="px-2 py-0.5 rounded hover:bg-background transition-colors text-muted-foreground hover:text-foreground"
                  >
                    直近2年
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartYearPreset('recent3')}
                    className="px-2 py-0.5 rounded hover:bg-background transition-colors text-muted-foreground hover:text-foreground"
                  >
                    直近3年
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartYearPreset('recent5')}
                    className="px-2 py-0.5 rounded hover:bg-background transition-colors text-muted-foreground hover:text-foreground"
                  >
                    直近5年
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartYearPreset('all')}
                    className="px-2 py-0.5 rounded hover:bg-background transition-colors text-muted-foreground hover:text-foreground"
                  >
                    全期間
                  </button>
                </div>

                <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-md">
                  <span className="text-muted-foreground px-1">表示数:</span>
                  {[6, 8, 12, 0].map((limit) => (
                    <button
                      key={limit}
                      type="button"
                      onClick={() => setChartCategoryLimit(limit)}
                      className={`px-2 py-0.5 rounded transition-colors ${
                        chartCategoryLimit === limit
                          ? 'bg-background font-bold shadow-xs text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {limit === 0 ? '全件' : `${limit}件`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 年度選択バッジ */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs text-muted-foreground mr-1">表示年度:</span>
              {allYears.map((year, index) => {
                const isSelected = selectedChartYears.includes(year)
                const color = YEAR_COLORS[index % YEAR_COLORS.length]
                return (
                  <button
                    key={year}
                    type="button"
                    onClick={() => toggleChartYear(year)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-muted/90 border-transparent shadow-sm'
                        : 'bg-transparent text-muted-foreground opacity-50 hover:opacity-100'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: color }}
                    />
                    <span>{year}年</span>
                  </button>
                )
              })}
            </div>

            {mounted ? (
              <div className="h-[380px] w-full min-w-0 min-h-[380px]">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={320}>
                  <BarChart
                    data={multiYearChartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={(val) => `¥${(val / 1000).toLocaleString()}k`}
                    />
                    <Tooltip
                      formatter={(value: any, name: string) => [
                        `¥${Number(value).toLocaleString()}`,
                        `${name}年`,
                      ]}
                    />
                    <Legend />
                    {allYears
                      .filter((year) => selectedChartYears.includes(year))
                      .map((year) => {
                        const originalIndex = allYears.indexOf(year)
                        const color = YEAR_COLORS[originalIndex % YEAR_COLORS.length]
                        return (
                          <Bar
                            key={year}
                            dataKey={year}
                            fill={color}
                            radius={[4, 4, 0, 0]}
                            name={year}
                          />
                        )
                      })}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[380px] w-full min-w-0 flex items-center justify-center bg-muted/10 rounded-lg">
                <span className="text-xs text-muted-foreground">グラフを読み込み中...</span>
              </div>
            )}
          </div>
        )}

        {/* カテゴリ別前年比較テーブル */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <TableIcon size={16} className="text-primary" />
              <span>{selectedYear}年 カテゴリ別詳細比較</span>
            </h3>

            {/* ソートボタン */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">並び順:</span>
              <button
                type="button"
                onClick={() => {
                  if (categorySortKey === 'amount') setCategorySortAsc(!categorySortAsc)
                  else {
                    setCategorySortKey('amount')
                    setCategorySortAsc(false)
                  }
                }}
                className={`px-2.5 py-1 rounded border transition-colors ${
                  categorySortKey === 'amount'
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'bg-background hover:bg-muted text-muted-foreground'
                }`}
              >
                金額順 {categorySortKey === 'amount' && (categorySortAsc ? '↑' : '↓')}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (categorySortKey === 'diff') setCategorySortAsc(!categorySortAsc)
                  else {
                    setCategorySortKey('diff')
                    setCategorySortAsc(false)
                  }
                }}
                className={`px-2.5 py-1 rounded border transition-colors ${
                  categorySortKey === 'diff'
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'bg-background hover:bg-muted text-muted-foreground'
                }`}
              >
                増減額順 {categorySortKey === 'diff' && (categorySortAsc ? '↑' : '↓')}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (categorySortKey === 'rate') setCategorySortAsc(!categorySortAsc)
                  else {
                    setCategorySortKey('rate')
                    setCategorySortAsc(false)
                  }
                }}
                className={`px-2.5 py-1 rounded border transition-colors ${
                  categorySortKey === 'rate'
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'bg-background hover:bg-muted text-muted-foreground'
                }`}
              >
                増減率順 {categorySortKey === 'rate' && (categorySortAsc ? '↑' : '↓')}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="p-3 font-semibold rounded-tl-lg">カテゴリ</th>
                  <th className="p-3 font-semibold text-right">{selectedYear}年 支出</th>
                  <th className="p-3 font-semibold text-center">構成比</th>
                  <th className="p-3 font-semibold text-right">
                    {prevYearObj ? `${prevYearObj.year}年 支出` : '前年支出'}
                  </th>
                  <th className="p-3 font-semibold text-right">前年差額</th>
                  <th className="p-3 font-semibold text-right rounded-tr-lg">前年比率</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {categoryComparisonList.map((row) => (
                  <tr key={row.category} className="hover:bg-muted/40 transition-colors">
                    <td className="p-3 font-medium flex items-center gap-2">
                      <span>{row.category}</span>
                    </td>
                    <td className="p-3 text-right font-mono font-bold">
                      ¥{row.curAmount.toLocaleString()}
                    </td>
                    <td className="p-3 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <div className="w-16 bg-muted rounded-full h-2 overflow-hidden hidden sm:block">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${Math.min(100, Math.max(0, row.share))}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono text-muted-foreground">
                          {row.share.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-right font-mono text-muted-foreground">
                      {row.prevAmount !== null ? `¥${row.prevAmount.toLocaleString()}` : '-'}
                    </td>
                    <td className="p-3 text-right font-mono">
                      {row.diffAmount !== null ? (
                        <span
                          className={
                            row.diffAmount > 0
                              ? 'text-red-500 font-medium'
                              : row.diffAmount < 0
                              ? 'text-emerald-600 font-medium'
                              : 'text-muted-foreground'
                          }
                        >
                          {row.diffAmount > 0 ? '+' : ''}
                          ¥{row.diffAmount.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="p-3 text-right font-mono">
                      {row.diffRate !== null ? (
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            row.diffRate > 0
                              ? 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400'
                              : row.diffRate < 0
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {row.diffRate > 0 ? '+' : ''}
                          {row.diffRate.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* セクション3: 全期間 カテゴリ別 年次推移マトリクス */}
      <section className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="text-primary" size={22} />
              <span>全期間 カテゴリ別推移マトリクス</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              各カテゴリの支出推移を年度横断で一覧比較できます
            </p>
          </div>

          {/* 表示モード切り替え */}
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg self-start sm:self-auto text-xs">
            <button
              type="button"
              onClick={() => setMatrixMode('amount')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                matrixMode === 'amount'
                  ? 'bg-background text-foreground font-bold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              金額 (¥)
            </button>
            <button
              type="button"
              onClick={() => setMatrixMode('diff')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                matrixMode === 'diff'
                  ? 'bg-background text-foreground font-bold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              前年差額 (±¥)
            </button>
            <button
              type="button"
              onClick={() => setMatrixMode('rate')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                matrixMode === 'rate'
                  ? 'bg-background text-foreground font-bold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              前年比 (%)
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="p-3 font-semibold sticky left-0 bg-muted z-10 min-w-[100px]">
                  カテゴリ
                </th>
                {allYears.map((year) => (
                  <th key={year} className="p-3 font-semibold text-right min-w-[120px]">
                    {year}年
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {allCategories.map((cat) => {
                // そのカテゴリの全期間合計（0円のものは表示しない）
                const totalCatAmount = allYears.reduce((sum, yr) => {
                  const yData = yearlyData.find((d) => d.year === yr)
                  return sum + (yData?.categoryTotals[cat] || 0)
                }, 0)

                if (totalCatAmount === 0) return null

                return (
                  <tr key={cat} className="hover:bg-muted/40 transition-colors">
                    <td className="p-3 font-medium sticky left-0 bg-card z-10 shadow-[1px_0_0_hsl(var(--border))]">
                      {cat}
                    </td>
                    {allYears.map((year, yIdx) => {
                      const curYData = yearlyData.find((d) => d.year === year)
                      const prevYear = allYears[yIdx - 1]
                      const prevYData = prevYear
                        ? yearlyData.find((d) => d.year === prevYear)
                        : undefined

                      const curAmount = curYData?.categoryTotals[cat] || 0
                      const prevAmount = prevYData ? prevYData.categoryTotals[cat] || 0 : null
                      const diffAmount = prevAmount !== null ? curAmount - prevAmount : null
                      const diffRate =
                        prevAmount !== null && prevAmount > 0
                          ? (diffAmount! / prevAmount) * 100
                          : prevAmount === 0 && curAmount > 0
                          ? 100
                          : null

                      return (
                        <td key={year} className="p-3 text-right font-mono">
                          {matrixMode === 'amount' && (
                            <div>
                              <div className={curAmount > 0 ? 'font-bold' : 'text-muted-foreground'}>
                                {curAmount > 0 ? `¥${curAmount.toLocaleString()}` : '-'}
                              </div>
                              {diffRate !== null && curAmount > 0 && (
                                <div
                                  className={`text-[10px] ${
                                    diffRate > 0
                                      ? 'text-red-500'
                                      : diffRate < 0
                                      ? 'text-emerald-600'
                                      : 'text-muted-foreground'
                                  }`}
                                >
                                  {diffRate > 0 ? '▲+' : diffRate < 0 ? '▼' : ''}
                                  {diffRate.toFixed(1)}%
                                </div>
                              )}
                            </div>
                          )}

                          {matrixMode === 'diff' && (
                            <div>
                              {diffAmount !== null ? (
                                <span
                                  className={
                                    diffAmount > 0
                                      ? 'text-red-500 font-medium'
                                      : diffAmount < 0
                                      ? 'text-emerald-600 font-medium'
                                      : 'text-muted-foreground'
                                  }
                                >
                                  {diffAmount > 0 ? '+' : ''}
                                  ¥{diffAmount.toLocaleString()}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </div>
                          )}

                          {matrixMode === 'rate' && (
                            <div>
                              {diffRate !== null ? (
                                <span
                                  className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                                    diffRate > 0
                                      ? 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400'
                                      : diffRate < 0
                                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                                      : 'bg-muted text-muted-foreground'
                                  }`}
                                >
                                  {diffRate > 0 ? '+' : ''}
                                  {diffRate.toFixed(1)}%
                                </span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
