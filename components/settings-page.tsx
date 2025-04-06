"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { useExpenseStore } from "@/lib/expense-store"
import { Download, Trash2, X } from "lucide-react"
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
import { useTheme } from "next-themes"

export function SettingsPage() {
  const { categories, addCategory, removeCategory, resetData, exportData } = useExpenseStore()
  const [newCategory, setNewCategory] = useState("")
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Este useEffect es crucial para evitar problemas de hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAddCategory = () => {
    if (newCategory.trim() === "") return

    if (categories.includes(newCategory.trim())) {
      toast({
        title: "Error",
        description: "Esta categoría ya existe",
        variant: "destructive",
      })
      return
    }

    addCategory(newCategory.trim())
    setNewCategory("")

    toast({
      title: "Categoría agregada",
      description: "La categoría ha sido agregada exitosamente",
    })
  }

  const handleRemoveCategory = (category: string) => {
    removeCategory(category)
    toast({
      title: "Categoría eliminada",
      description: "La categoría ha sido eliminada exitosamente",
    })
  }

  const handleExportData = () => {
    exportData()
    toast({
      title: "Datos exportados",
      description: "Los datos han sido exportados exitosamente",
    })
  }

  const handleResetData = () => {
    resetData()
    toast({
      title: "Datos eliminados",
      description: "Todos los datos han sido eliminados",
    })
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // No renderizar el switch hasta que el componente esté montado
  // Esto evita problemas de hidratación con next-themes
  if (!mounted) {
    return (
      <div className="space-y-4 py-4">
        <Card>
          <CardHeader>
            <CardTitle>Cargando...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-6 bg-muted rounded animate-pulse"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4 py-4">
      <Card>
        <CardHeader>
          <CardTitle>Apariencia</CardTitle>
          <CardDescription>Personaliza la apariencia de la aplicación</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="theme-toggle">Modo oscuro</Label>
            <Switch id="theme-toggle" checked={theme === "dark"} onCheckedChange={toggleTheme} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categorías</CardTitle>
          <CardDescription>Administra las categorías de gastos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input placeholder="Nueva categoría" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
            <Button onClick={handleAddCategory}>Agregar</Button>
          </div>
          <div className="grid gap-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center justify-between py-2 border-b">
                <span>{category}</span>
                {/* No permitir eliminar categorías predeterminadas */}
                {![
                  "Alimentación",
                  "Transporte",
                  "Vivienda",
                  "Servicios",
                  "Salud",
                  "Educación",
                  "Entretenimiento",
                  "Otros",
                ].includes(category) && (
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveCategory(category)}>
                    <X size={16} />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Exportar Datos</CardTitle>
          <CardDescription>Exporta tus datos de gastos en formato CSV</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button className="w-full gap-2" onClick={handleExportData}>
            <Download size={18} />
            Exportar Datos
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Eliminar Datos</CardTitle>
          <CardDescription>Elimina todos tus datos de gastos</CardDescription>
        </CardHeader>
        <CardFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full gap-2">
                <Trash2 size={18} />
                Eliminar Todos los Datos
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción eliminará permanentemente todos tus datos de gastos y no se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleResetData}>Eliminar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  )
}

