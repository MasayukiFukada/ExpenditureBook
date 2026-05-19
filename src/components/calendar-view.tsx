import Link from 'next/link'
import { MonthlyData } from '@/types'

export function CalendarView({ monthData }: { monthData: MonthlyData }) {
  const [year, month] = monthData.year_month.split('-').map(Number)
  
  // 月の最初の日と最後の日を取得
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay() // 0 (Sun) to 6 (Sat)
  
  const days = []
  // 空白埋め
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null)
  }
  // 日付埋め
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const getDayTotal = (dayNum: number) => {
    const dayKey = dayNum.toString().padStart(2, '0')
    const expenditures = monthData.days[dayKey] || []
    return expenditures.reduce((sum, item) => sum + item.amount, 0)
  }

  const hasUnsetCategory = (dayNum: number) => {
    const dayKey = dayNum.toString().padStart(2, '0')
    const expenditures = monthData.days[dayKey] || []
    return expenditures.some(item => item.category === "未設定")
  }

  const isToday = (dayNum: number) => {
    const today = new Date()
    return today.getFullYear() === year && 
           (today.getMonth() + 1) === month && 
           today.getDate() === dayNum
  }

  return (
    <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
      <div className="grid grid-cols-7 bg-muted text-center text-xs font-medium border-b">
        {['日', '月', '火', '水', '木', '金', '土'].map(d => (
          <div key={d} className="p-2">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 text-center">
        {days.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} className="p-4 border-b border-r last:border-r-0 h-20 bg-muted/20" />
          
          const total = getDayTotal(day)
          const unset = hasUnsetCategory(day)
          const dateStr = `${monthData.year_month}-${day.toString().padStart(2, '0')}`
          
          return (
            <Link 
              key={day} 
              href={`/edit?date=${dateStr}`}
              className={`p-1.5 border-b border-r last:border-r-0 h-20 flex flex-col justify-between hover:bg-accent transition-colors ${
                isToday(day) ? 'bg-primary/5' : ''
              } ${unset ? 'bg-destructive/5' : ''}`}
            >
              <span className={`text-xs font-medium text-left ${isToday(day) ? 'text-primary' : 'text-muted-foreground'} ${unset ? 'text-destructive underline decoration-2 underline-offset-4' : ''}`}>
                {day}
              </span>
              {total > 0 && (
                <span className={`text-xl font-mono font-bold text-right leading-none ${
                  unset ? 'text-destructive' : 'text-primary'
                }`}>
                  {total.toLocaleString()}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
