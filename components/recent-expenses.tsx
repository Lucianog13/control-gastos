"use client"

import { useExpenseStore } from "@/lib/expense-store"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"

export function RecentExpenses() {
  const { expenses } = useExpenseStore()
  const [recentExpenses, setRecentExpenses] = useState<any[]>([])

  useEffect(() => {
    // Ordenar por fecha y tomar los 5 más recientes
    const sorted = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)

    setRecentExpenses(sorted)
  }, [expenses])

  if (recentExpenses.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No hay gastos registrados</div>
  }

  return (
    <div className="space-y-4">
      {recentExpenses.map((expense) => (
        <div key={expense.id} className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{expense.description}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>{formatDate(expense.date)}</span>
              <Badge variant="outline" className="ml-2">
                {expense.category}
              </Badge>
            </div>
          </div>
          <div className="font-medium">$ {expense.amount.toLocaleString("es-AR")}</div>
        </div>
      ))}
    </div>
  )
}

