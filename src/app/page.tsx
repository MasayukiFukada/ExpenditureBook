import { getDb } from '@/lib/db'
import { MonthlyData } from '@/types'
import { CategoryPieChart } from '@/components/charts'
import { YearlyTrendChart } from '@/components/yearly-charts'
import { YearSelect } from '@/components/year-select'
import { CalendarView } from '@/components/calendar-view'
import { CommentForm } from '@/components/comment-form'
import { ImportDialog } from '@/components/import-dialog'
import Link from 'next/link'
import { PlusCircle, Calendar as CalendarIcon, BarChart3, ChevronRight } from 'lucide-react'

export default async function Home({
  searchParams,
}: {
  searchParams: { year?: string; month?: string }
}) {
  const db = await getDb()
  const allMonthlyData = db.data.monthly

  // 利用可能な年のリストを取得
  const years = Array.from(new Set(allMonthlyData.map(d => d.year_month.split('-')[0]))).sort((a, b) => b.localeCompare(a))
  
  // 選択された年（指定がなければ最新）
  const selectedYear = searchParams.year || years[0]
  
  // 選択された年のデータを取得（月順）
  const yearlyData = allMonthlyData
    .filter(d => d.year_month.startsWith(selectedYear))
    .sort((a, b) => a.year_month.localeCompare(b.year_month))

  // 表示する月を決定（指定があればそれ、なければ最新の月、なければその年の最初の月）
  const selectedMonthStr = searchParams.month || (yearlyData.length > 0 ? yearlyData[yearlyData.length - 1].year_month : null)
  const currentMonthData = allMonthlyData.find(d => d.year_month === selectedMonthStr)

  const todayStr = new Date().toISOString().split('T')[0]

  // 年間推移グラフ用のデータ（カテゴリ別の積み上げ用）
  const trendData = yearlyData.map(d => {
    const monthTotal: { month: string; [key: string]: string | number } = { month: d.year_month }
    
    // 各月のカテゴリ別集計
    for (const day in d.days) {
      d.days[day].forEach(item => {
        monthTotal[item.category] = (Number(monthTotal[item.category]) || 0) + item.amount
      })
    }
    
    return monthTotal
  })

  const totalYearlyAmount = yearlyData.reduce((sum, d) => sum + calculateTotal(d), 0)

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">出費管理システム</h1>
          <p className="text-muted-foreground text-sm">Next.js + lowDB Edition</p>
        </div>
        <div className="flex items-center gap-4">
          <YearSelect years={years} current={selectedYear} />
          <ImportDialog />
          <Link 
            href={`/edit?date=${todayStr}`}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <PlusCircle size={20} />
            <span>支出入力</span>
          </Link>
        </div>
      </header>

      <div className="space-y-10">
        {/* 年間セクション */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b pb-2">
            <BarChart3 className="text-primary" />
            <h2 className="text-2xl font-bold">{selectedYear}年の概況</h2>
            <div className="ml-auto text-xl font-bold">
              年計: <span className="text-primary">¥{totalYearlyAmount.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-card p-6 rounded-xl border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">月別支出推移</h3>
              <YearlyTrendChart data={trendData} />
            </div>
            
            <div className="bg-card p-6 rounded-xl border shadow-sm overflow-y-auto max-h-[380px]">
              <h3 className="text-lg font-semibold mb-4">月を選択</h3>
              <div className="grid grid-cols-2 gap-3">
                {yearlyData.map(d => (
                  <Link 
                    key={d.year_month}
                    href={`/?year=${selectedYear}&month=${d.year_month}`}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      d.year_month === selectedMonthStr 
                        ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105' 
                        : 'hover:bg-muted bg-card'
                    }`}
                  >
                    <div className="text-xs opacity-70">{d.year_month.split('-')[1]}月</div>
                    <div className="font-bold">¥{calculateTotal(d).toLocaleString()}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 月間詳細セクション */}
        {currentMonthData && (
          <section className="space-y-6 pt-6 border-t">
            <div className="flex items-center gap-2">
              <CalendarIcon className="text-primary" />
              <h2 className="text-2xl font-bold">{currentMonthData.year_month}月の詳細</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SummaryCard 
                title="月合計支出" 
                value={calculateTotal(currentMonthData)} 
                unit="円" 
              />
              <SummaryCard 
                title="記録日数" 
                value={Object.keys(currentMonthData.days).length} 
                unit="日" 
              />
              <div className="bg-card p-4 rounded-lg border shadow-sm flex flex-col justify-between">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">月間コメント</h3>
                <CommentForm 
                  key={currentMonthData.year_month}
                  yearMonth={currentMonthData.year_month} 
                  initialComment={currentMonthData.comment} 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <section>
                  <h3 className="text-xl font-semibold mb-4">カレンダー</h3>
                  <CalendarView monthData={currentMonthData} />
                </section>
              </div>
              
              <div className="space-y-8">
                <section className="bg-card p-6 rounded-lg border shadow-sm">
                  <h3 className="text-xl font-semibold mb-4">カテゴリ別内訳</h3>
                  <CategoryPieChart data={getChartData(currentMonthData)} />
                </section>
                
                <section>
                  <h3 className="text-xl font-semibold mb-4">ランキング</h3>
                  <CategoryBreakdown month={currentMonthData} />
                </section>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function calculateTotal(month: MonthlyData): number {
  let total = 0
  for (const day in month.days) {
    total += month.days[day].reduce((sum, item) => sum + item.amount, 0)
  }
  return total
}

function getChartData(month: MonthlyData) {
  const breakdown: { [key: string]: number } = {}
  for (const day in month.days) {
    month.days[day].forEach(item => {
      breakdown[item.category] = (breakdown[item.category] || 0) + item.amount
    })
  }
  return Object.entries(breakdown)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }))
}

function SummaryCard({ title, value, unit = "" }: { title: string, value: string | number, unit?: string }) {
  return (
    <div className="bg-card p-6 rounded-lg border shadow-sm">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <p className="text-2xl font-bold mt-2">
        {typeof value === 'number' ? value.toLocaleString() : value}
        <span className="text-sm font-normal ml-1">{unit}</span>
      </p>
    </div>
  )
}

function CategoryBreakdown({ month }: { month: MonthlyData }) {
  const breakdown: { [key: string]: number } = {}
  for (const day in month.days) {
    month.days[day].forEach(item => {
      breakdown[item.category] = (breakdown[item.category] || 0) + item.amount
    })
  }
  const sortedBreakdown = Object.entries(breakdown).sort((a, b) => b[1] - a[1])

  return (
    <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="p-3 font-medium">カテゴリ</th>
            <th className="p-3 font-medium text-right">金額</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {sortedBreakdown.map(([category, amount]) => (
            <tr key={category}>
              <td className="p-3">{category}</td>
              <td className="p-3 text-right font-mono">{amount.toLocaleString()} 円</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
