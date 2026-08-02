'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { CATEGORIES } from '@/const/categories'

export interface MonthlyCategoryData {
  month: string
  isProjected?: boolean
  total?: number
  projectedTotal?: number
  [key: string]: string | number | boolean | undefined
}

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', 
  '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57',
  '#a29bfe', '#ffeaa7', '#fab1a0', '#0984e3'
]

export function YearlyTrendChart({ data }: { data: MonthlyCategoryData[] }) {
  const hasProjectedData = data.some((d) => d.isProjected);

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
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
            formatter={(value: any, name: string, item: any) => {
              if (value === null || value === undefined) return [null, null];
              const isProjected = item.payload.isProjected;
              const formattedValue = `¥${Number(value).toLocaleString()}`;
              
              let displayName = name;
              if (name === 'total') displayName = '合計(実績)';
              else if (name === 'projectedTotal') displayName = '合計(見込み)';
              
              if (isProjected && name !== 'projectedTotal') {
                displayName = `${displayName} (見込み)`;
              }

              return [formattedValue, displayName];
            }}
            labelFormatter={(label, items) => {
              const isProjected = items?.[0]?.payload?.isProjected;
              return `${label}${isProjected ? ' (平均見込み)' : ''}`;
            }}
          />
          <Legend iconType="plainline" />
          
          {/* 合計ライン（実績） */}
          <Line 
            type="monotone" 
            dataKey="total" 
            name="合計" 
            stroke="#000" 
            strokeWidth={3} 
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            connectNulls={false}
          />

          {/* 合計ライン（見込み点線） */}
          {hasProjectedData && (
            <Line 
              type="monotone" 
              dataKey="projectedTotal" 
              name="合計(見込み)" 
              stroke="#666666" 
              strokeWidth={2} 
              strokeDasharray="5 5"
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              connectNulls={true}
            />
          )}

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
