"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"

export function ThemeConfig() {
  const { theme, setTheme } = useTheme()

  // Aplicar el tema del sistema por defecto al cargar
  useEffect(() => {
    // Verificar si hay una preferencia guardada
    const savedTheme = localStorage.getItem("theme")

    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      // Si no hay preferencia, usar el tema del sistema
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setTheme("dark")
      } else {
        setTheme("light")
      }
    }

    // Escuchar cambios en la preferencia del sistema
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches ? "dark" : "light")
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [setTheme])

  return null
}

