"use client"

import { useState, useEffect } from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useExpenseStore } from "@/lib/expense-store"

export function MonthlyTrendChart() {
  const { expenses } = useExpenseStore()
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    // Obtener los últimos 6 meses
    const monthsData = []
    const today = new Date()

    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const monthName = month.toLocaleString("es-AR", { month: "short" })
      const monthYear = `${monthName} ${month.getFullYear()}`

      // Filtrar gastos de este mes
      const monthExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date)
        return expenseDate.getMonth() === month.getMonth() && expenseDate.getFullYear() === month.getFullYear()
      })

      // Calcular total
      const total = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0)

      monthsData.push({
        month: monthName,
        expenses: total,
      })
    }

    setChartData(monthsData)
  }, [expenses])

  return (
    <ChartContainer
      config={{
        expenses: {
          label: "Gastos",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[300px] w-full"
    >
      <LineChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
        <YAxis tickLine={false} axisLine={false} tickMargin={10} tickFormatter={(value) => `$${value}`} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          type="monotone"
          dataKey="expenses"
          stroke="var(--color-expenses)"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ChartContainer>
  )
}

