'use client'

import { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

export interface YearlySummaryData {
  year: string
  totalAmount: number
  monthsCount: number
  monthlyAverage: number
  projectedTotal?: number
  isCurrentYear?: boolean
}

export interface MultiYearMonthlyTrend {
  month: string // "01月", "02月", ...
  [year: string]: string | number | undefined
}

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

export function MultiYearBarChart({ data }: { data: YearlySummaryData[] }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="h-[380px] w-full min-w-0 flex items-center justify-center bg-muted/10 rounded-lg">
        <span className="text-xs text-muted-foreground">グラフを読み込み中...</span>
      </div>
    )
  }

  return (
    <div className="h-[380px] w-full min-w-0 min-h-[380px]">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={350}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 13 }} />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `¥${(value / 10000).toLocaleString()}万`}
          />
          <Tooltip
            formatter={(value: any, name: string) => {
              if (value === null || value === undefined) return [null, null]
              const formattedValue = `¥${Number(value).toLocaleString()}`
              let label = name
              if (name === 'totalAmount') label = '年間総支出'
              if (name === 'projectedTotal') label = '年間見込み額'
              if (name === 'monthlyAverage') label = '月平均支出'
              return [formattedValue, label]
            }}
          />
          <Legend
            formatter={(value) => {
              if (value === 'totalAmount') return '年間総支出'
              if (value === 'projectedTotal') return '年間見込み額'
              return value
            }}
          />
          <Bar
            dataKey="totalAmount"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
            name="totalAmount"
          />
          {data.some((d) => d.projectedTotal && d.isCurrentYear) && (
            <Bar
              dataKey="projectedTotal"
              fill="#93c5fd"
              radius={[4, 4, 0, 0]}
              name="projectedTotal"
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function MultiYearLineChart({
  data,
  years,
}: {
  data: MultiYearMonthlyTrend[]
  years: string[]
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  // 初期状態では直近3年分を選択
  const defaultSelected = years.slice(-3)
  const [selectedYears, setSelectedYears] = useState<string[]>(
    defaultSelected.length > 0 ? defaultSelected : years
  )

  const toggleYear = (year: string) => {
    setSelectedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    )
  }

  if (!mounted) {
    return (
      <div className="h-[380px] w-full min-w-0 flex items-center justify-center bg-muted/10 rounded-lg">
        <span className="text-xs text-muted-foreground">グラフを読み込み中...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4 min-w-0">
      {/* 年切り替えチェックボックス */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs text-muted-foreground mr-1">表示年:</span>
        {years.map((year, index) => {
          const isSelected = selectedYears.includes(year)
          const color = YEAR_COLORS[index % YEAR_COLORS.length]
          return (
            <button
              key={year}
              type="button"
              onClick={() => toggleYear(year)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-muted/80 border-transparent shadow-sm'
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

      <div className="h-[380px] w-full min-w-0 min-h-[380px]">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={350}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `¥${(value / 1000).toLocaleString()}k`}
            />
            <Tooltip
              formatter={(value: any, name: string) => {
                if (value === null || value === undefined) return [null, null]
                return [`¥${Number(value).toLocaleString()}`, `${name}年`]
              }}
            />
            <Legend />
            {years
              .filter((year) => selectedYears.includes(year))
              .map((year) => {
                const originalIndex = years.indexOf(year)
                const color = YEAR_COLORS[originalIndex % YEAR_COLORS.length]
                return (
                  <Line
                    key={year}
                    type="monotone"
                    dataKey={year}
                    name={year}
                    stroke={color}
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                    activeDot={{ r: 6 }}
                    connectNulls
                  />
                )
              })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

