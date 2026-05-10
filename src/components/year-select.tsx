'use client'

import { useRouter } from 'next/navigation'

export function YearSelect({ years, current }: { years: string[], current: string }) {
  const router = useRouter()

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">対象年:</span>
      <select 
        className="bg-card border rounded p-2 text-sm font-bold"
        value={current}
        onChange={(e) => router.push(`/?year=${e.target.value}`)}
      >
        {years.map(y => (
          <option key={y} value={y}>{y}年</option>
        ))}
      </select>
    </div>
  )
}
