import { getDb } from '@/lib/db'
import { Expenditure } from '@/types'
import { EditForm } from '@/components/edit-form'
import { redirect } from 'next/navigation'

export default async function EditPage({
  searchParams,
}: {
  searchParams: { date?: string }
}) {
  const dateStr = searchParams.date
  if (!dateStr) {
    // 日付がない場合は今日の日付にリダイレクト
    const today = new Date().toISOString().split('T')[0]
    redirect(`/edit?date=${today}`)
  }

  const [year, month, day] = dateStr.split('-')
  const yearMonth = `${year}-${month}`

  const db = await getDb()
  const monthlyData = db.data.monthly.find(m => m.year_month === yearMonth)
  const initialExpenditures = monthlyData?.days[day] || []

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">{dateStr} の支出編集</h1>
      </header>

      <EditForm 
        dateStr={dateStr}
        initialExpenditures={initialExpenditures}
      />
    </div>
  )
}
