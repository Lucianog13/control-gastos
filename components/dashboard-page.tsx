"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { ExpenseChart } from "@/components/expense-chart"
import { RecentExpenses } from "@/components/recent-expenses"
import { useState, useEffect } from "react"
import { useExpenseStore } from "@/lib/expense-store"

interface DashboardPageProps {
  onAddExpense: () => void
}

export function DashboardPage({ onAddExpense }: DashboardPageProps) {
  const { expenses, getMonthlyTotal, getWeeklyTotal, getDailyTotal } = useExpenseStore()
  const [monthlyTotal, setMonthlyTotal] = useState(0)
  const [weeklyTotal, setWeeklyTotal] = useState(0)
  const [dailyTotal, setDailyTotal] = useState(0)

  useEffect(() => {
    setMonthlyTotal(getMonthlyTotal())
    setWeeklyTotal(getWeeklyTotal())
    setDailyTotal(getDailyTotal())
  }, [expenses, getMonthlyTotal, getWeeklyTotal, getDailyTotal])

  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Gasto Mensual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$ {monthlyTotal.toLocaleString("es-AR")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Gasto Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$ {weeklyTotal.toLocaleString("es-AR")}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Resumen de Gastos</CardTitle>
          <CardDescription>Últimos 7 días</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <ExpenseChart />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">Gastos Recientes</CardTitle>
          <Button variant="ghost" size="sm" className="text-xs" onClick={onAddExpense}>
            Ver todos
          </Button>
        </CardHeader>
        <CardContent className="pt-0">
          <RecentExpenses />
        </CardContent>
      </Card>

      <Button className="w-full gap-2" size="lg" onClick={onAddExpense}>
        <PlusCircle size={18} />
        Nuevo Gasto
      </Button>
    </div>
  )
}

