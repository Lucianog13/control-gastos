"use client"

import { useState, useEffect } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { useExpenseStore } from "@/lib/expense-store"
import { Card, CardContent } from "@/components/ui/card"

interface CategoryChartProps {
  period: string
}

export function CategoryChart({ period }: CategoryChartProps) {
  const { expenses, categories, filterExpensesByPeriod } = useExpenseStore()
  const [chartData, setChartData] = useState<any[]>([])

  const COLORS = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#8AC926",
    "#1982C4",
    "#6A4C93",
    "#F15BB5",
  ]

  useEffect(() => {
    // Filtrar gastos por período
    const filteredExpenses = filterExpensesByPeriod(period)

    // Agrupar por categoría
    const categoryTotals = categories
      .map((category) => {
        const total = filteredExpenses
          .filter((expense) => expense.category === category)
          .reduce((sum, expense) => sum + expense.amount, 0)

        return {
          name: category,
          value: total,
        }
      })
      .filter((item) => item.value > 0)

    setChartData(categoryTotals)
  }, [expenses, period, categories, filterExpensesByPeriod])

  if (chartData.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">No hay datos suficientes para mostrar el gráfico</div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$ ${value.toLocaleString("es-AR")}`} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-2">
        {chartData.map((entry, index) => (
          <Card key={entry.name} className="overflow-hidden">
            <CardContent className="p-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span>{entry.name}</span>
                </div>
                <span className="font-medium">$ {entry.value.toLocaleString("es-AR")}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

