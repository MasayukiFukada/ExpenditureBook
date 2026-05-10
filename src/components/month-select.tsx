'use client'

import { useRouter } from 'next/navigation'

export function MonthSelect({ months, current }: { months: string[], current: string }) {
  const router = useRouter()

  return (
    <select 
      className="bg-card border rounded p-2 text-sm"
      value={current}
      onChange={(e) => router.push(`/?month=${e.target.value}`)}
    >
      {months.map(m => (
        <option key={m} value={m}>{m}</option>
      ))}
    </select>
  )
}
