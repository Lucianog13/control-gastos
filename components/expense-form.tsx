"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useExpenseStore } from "@/lib/expense-store"
import { X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ExpenseFormProps {
  expense?: any
  onClose: () => void
}

export function ExpenseForm({ expense, onClose }: ExpenseFormProps) {
  const { addExpense, updateExpense, categories } = useExpenseStore()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    id: expense?.id || Date.now().toString(),
    amount: expense?.amount || "",
    category: expense?.category || "",
    date: expense?.date ? new Date(expense.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    description: expense?.description || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.amount || !formData.category || !formData.date || !formData.description) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      })
      return
    }

    const expenseData = {
      ...formData,
      amount: Number(formData.amount),
    }

    if (expense) {
      updateExpense(expenseData)
      toast({
        title: "Gasto actualizado",
        description: "El gasto ha sido actualizado exitosamente",
      })
    } else {
      addExpense(expenseData)
      toast({
        title: "Gasto agregado",
        description: "El gasto ha sido agregado exitosamente",
      })
    }

    onClose()
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="flex flex-row items-center p-0 pb-4">
        <CardTitle>{expense ? "Editar Gasto" : "Nuevo Gasto"}</CardTitle>
        <Button variant="ghost" size="icon" className="ml-auto" onClick={onClose}>
          <X size={18} />
        </Button>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 p-0">
          <div className="space-y-2">
            <Label htmlFor="amount">Monto (ARS)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Select value={formData.category} onValueChange={handleCategoryChange} required>
              <SelectTrigger id="category">
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Fecha</Label>
            <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Descripción del gasto"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="px-0 pt-4">
          <Button type="submit" className="w-full">
            {expense ? "Actualizar" : "Guardar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

