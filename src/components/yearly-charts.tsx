'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { CATEGORIES } from '@/const/categories'

interface MonthlyCategoryData {
  month: string
  [key: string]: string | number // カテゴリ名: 金額
}

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', 
  '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57',
  '#a29bfe', '#ffeaa7', '#fab1a0', '#0984e3'
]

export function YearlyTrendChart({ data }: { data: MonthlyCategoryData[] }) {
  // 合計を計算する（ツールチップ表示用）
  const dataWithTotal = data.map(d => {
    const total = Object.entries(d)
      .filter(([key]) => key !== 'month')
      .reduce((sum, [_, val]) => sum + (Number(val) || 0), 0)
    return { ...d, total }
  })

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={dataWithTotal}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => value.split('-')[1] + '月'}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `¥${(value / 1000)}k`}
          />
          <Tooltip 
            formatter={(value: number, name: string) => [
              `¥${value.toLocaleString()}`, 
              name === 'total' ? '合計' : name
            ]}
            labelFormatter={(label) => `${label}`}
          />
          <Legend iconType="plainline" />
          
          {/* 合計ライン（強調表示） */}
          <Line 
            type="monotone" 
            dataKey="total" 
            name="合計" 
            stroke="#000" 
            strokeWidth={3} 
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />

          {/* 各カテゴリのライン */}
          {CATEGORIES.map((category, index) => (
            <Line 
              key={category}
              type="monotone"
              dataKey={category}
              stroke={COLORS[index % COLORS.length]}
              name={category}
              dot={false}
              strokeWidth={1.5}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
