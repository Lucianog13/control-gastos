"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Expense {
  id: string
  amount: number
  category: string
  date: string
  description: string
}

interface ExpenseStore {
  expenses: Expense[]
  categories: string[]
  addExpense: (expense: Expense) => void
  updateExpense: (expense: Expense) => void
  deleteExpense: (id: string) => void
  addCategory: (category: string) => void
  removeCategory: (category: string) => void
  resetData: () => void
  exportData: () => void
  getMonthlyTotal: () => number
  getWeeklyTotal: () => number
  getDailyTotal: () => number
  filterExpensesByPeriod: (period: string) => Expense[]
  getLastSevenDaysData: () => any[]
}

export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set, get) => ({
      expenses: [],
      categories: [
        "Alimentación",
        "Transporte",
        "Vivienda",
        "Servicios",
        "Salud",
        "Educación",
        "Entretenimiento",
        "Otros",
      ],

      addExpense: (expense) => {
        set((state) => ({
          expenses: [...state.expenses, expense],
        }))
      },

      updateExpense: (expense) => {
        set((state) => ({
          expenses: state.expenses.map((e) => (e.id === expense.id ? expense : e)),
        }))
      },

      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        }))
      },

      addCategory: (category) => {
        set((state) => ({
          categories: [...state.categories, category],
        }))
      },

      removeCategory: (category) => {
        // No permitir eliminar categorías que están en uso
        const { expenses } = get()
        const isInUse = expenses.some((expense) => expense.category === category)

        if (isInUse) {
          return
        }

        set((state) => ({
          categories: state.categories.filter((c) => c !== category),
        }))
      },

      resetData: () => {
        set({
          expenses: [],
        })
      },

      exportData: () => {
        const { expenses } = get()

        // Crear contenido CSV
        let csvContent = "ID,Monto,Categoría,Fecha,Descripción\n"

        expenses.forEach((expense) => {
          csvContent += `${expense.id},${expense.amount},"${expense.category}",${expense.date},"${expense.description}"\n`
        })

        // Crear blob y descargar
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `gastos_${new Date().toISOString().split("T")[0]}.csv`)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      },

      getMonthlyTotal: () => {
        const { expenses } = get()
        const today = new Date()
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

        return expenses
          .filter((expense) => new Date(expense.date) >= firstDayOfMonth)
          .reduce((total, expense) => total + expense.amount, 0)
      },

      getWeeklyTotal: () => {
        const { expenses } = get()
        const today = new Date()
        const firstDayOfWeek = new Date(today)
        const day = today.getDay() || 7
        firstDayOfWeek.setDate(today.getDate() - day + 1)
        firstDayOfWeek.setHours(0, 0, 0, 0)

        return expenses
          .filter((expense) => new Date(expense.date) >= firstDayOfWeek)
          .reduce((total, expense) => total + expense.amount, 0)
      },

      getDailyTotal: () => {
        const { expenses } = get()
        const today = new Date()
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())

        return expenses
          .filter((expense) => {
            const expenseDate = new Date(expense.date)
            return (
              expenseDate.getFullYear() === today.getFullYear() &&
              expenseDate.getMonth() === today.getMonth() &&
              expenseDate.getDate() === today.getDate()
            )
          })
          .reduce((total, expense) => total + expense.amount, 0)
      },

      filterExpensesByPeriod: (period) => {
        const { expenses } = get()
        const today = new Date()

        switch (period) {
          case "today":
            const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
            return expenses.filter((expense) => new Date(expense.date) >= startOfDay)

          case "week":
            const firstDayOfWeek = new Date(today)
            const day = today.getDay() || 7
            firstDayOfWeek.setDate(today.getDate() - day + 1)
            firstDayOfWeek.setHours(0, 0, 0, 0)
            return expenses.filter((expense) => new Date(expense.date) >= firstDayOfWeek)

          case "month":
            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
            return expenses.filter((expense) => new Date(expense.date) >= firstDayOfMonth)

          default:
            return expenses
        }
      },

      getLastSevenDaysData: () => {
        const { expenses } = get()
        const result = []

        // Obtener los últimos 7 días
        for (let i = 6; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          date.setHours(0, 0, 0, 0)

          const nextDate = new Date(date)
          nextDate.setDate(nextDate.getDate() + 1)

          // Filtrar gastos de este día
          const dayExpenses = expenses.filter((expense) => {
            const expenseDate = new Date(expense.date)
            return expenseDate >= date && expenseDate < nextDate
          })

          // Calcular total
          const total = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0)

          // Formato corto del día
          const dayName = date.toLocaleDateString("es-AR", { weekday: "short" })

          result.push({
            date: dayName,
            expenses: total,
          })
        }

        return result
      },
    }),
    {
      name: "expense-store",
    },
  ),
)

