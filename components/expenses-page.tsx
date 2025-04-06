"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExpenseForm } from "@/components/expense-form"
import { ExpenseList } from "@/components/expense-list"
import { PlusCircle, Filter } from "lucide-react"
import { useExpenseStore } from "@/lib/expense-store"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export function ExpensesPage() {
  const [showForm, setShowForm] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [filterPeriod, setFilterPeriod] = useState<string>("all")
  const [tabPeriod, setTabPeriod] = useState("all")
  const { categories } = useExpenseStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<any>(null)

  const handleAddExpense = () => {
    setEditingExpense(null)
    setIsDialogOpen(true)
  }

  const handleEditExpense = (expense: any) => {
    setEditingExpense(expense)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingExpense(null)
  }

  return (
    <div className="space-y-4 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Mis Gastos</h2>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter size={18} />
              <span className="sr-only">Filtrar</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Filtrar Gastos</SheetTitle>
              <SheetDescription>Filtra tus gastos por categoría y período</SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="period">Período</Label>
                <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                  <SelectTrigger id="period">
                    <SelectValue placeholder="Seleccionar período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="today">Hoy</SelectItem>
                    <SelectItem value="week">Esta semana</SelectItem>
                    <SelectItem value="month">Este mes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Select value={filterCategory || ""} onValueChange={setFilterCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Todas las categorías" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setTabPeriod}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="week">Semana</TabsTrigger>
          <TabsTrigger value="month">Mes</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <ExpenseList period="all" category={filterCategory} onEditExpense={handleEditExpense} />
        </TabsContent>
        <TabsContent value="week">
          <ExpenseList period="week" category={filterCategory} onEditExpense={handleEditExpense} />
        </TabsContent>
        <TabsContent value="month">
          <ExpenseList period="month" category={filterCategory} onEditExpense={handleEditExpense} />
        </TabsContent>
      </Tabs>

      <Button className="w-full gap-2" size="lg" onClick={handleAddExpense}>
        <PlusCircle size={18} />
        Nuevo Gasto
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <ExpenseForm expense={editingExpense} onClose={handleCloseDialog} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

