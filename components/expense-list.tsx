"use client"

import { useState, useEffect } from "react"
import { useExpenseStore } from "@/lib/expense-store"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Edit, Trash2 } from "lucide-react"

interface ExpenseListProps {
  period: "all" | "today" | "week" | "month"
  category: string | null
  onEditExpense: (expense: any) => void
}

export function ExpenseList({ period, category, onEditExpense }: ExpenseListProps) {
  const { expenses, deleteExpense, filterExpensesByPeriod } = useExpenseStore()
  const [filteredExpenses, setFilteredExpenses] = useState<any[]>([])

  useEffect(() => {
    // Filtrar por período
    let filtered = filterExpensesByPeriod(period)

    // Filtrar por categoría si está seleccionada
    if (category) {
      filtered = filtered.filter((expense) => expense.category === category)
    }

    // Ordenar por fecha (más reciente primero)
    filtered = filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    setFilteredExpenses(filtered)
  }, [expenses, period, category, filterExpensesByPeriod])

  const handleDelete = (id: string) => {
    deleteExpense(id)
  }

  if (filteredExpenses.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No hay gastos registrados en este período</div>
  }

  return (
    <div className="space-y-4">
      {filteredExpenses.map((expense) => (
        <Card key={expense.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">{expense.description}</p>
              <div className="flex items-center text-xs text-muted-foreground">
                <span>{formatDate(expense.date)}</span>
                <Badge variant="outline" className="ml-2">
                  {expense.category}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="font-bold text-right">$ {expense.amount.toLocaleString("es-AR")}</div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => onEditExpense(expense)}>
                  <Edit size={16} />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 size={16} className="text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar este gasto?</AlertDialogTitle>
                      <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(expense.id)}>Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

