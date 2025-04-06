"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useExpenseStore } from "@/lib/expense-store"

export function ExpenseChart() {
  const { getLastSevenDaysData } = useExpenseStore()
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    setChartData(getLastSevenDaysData())
  }, [getLastSevenDaysData])

  return (
    <ChartContainer
      config={{
        expenses: {
          label: "Gastos",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[200px] w-full"
    >
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={10} tickFormatter={(value) => `$${value}`} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}

