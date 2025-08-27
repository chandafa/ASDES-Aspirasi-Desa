'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { reports } from "@/lib/data"

export function Overview() {
    const data = [
        { name: "Pending", total: reports.filter(r => r.status === 'pending').length },
        { name: "In Progress", total: reports.filter(r => r.status === 'in_progress').length },
        { name: "Resolved", total: reports.filter(r => r.status === 'resolved').length },
        { name: "Rejected", total: reports.filter(r => r.status === 'rejected').length },
    ]

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
