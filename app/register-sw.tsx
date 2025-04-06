"use client"

import { useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

export function RegisterSW() {
  const { toast } = useToast()

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").then(
          (registration) => {
            console.log("Service Worker registration successful with scope: ", registration.scope)

            // Verificar actualizaciones
            registration.addEventListener("updatefound", () => {
              const newWorker = registration.installing

              if (newWorker) {
                newWorker.addEventListener("statechange", () => {
                  if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                    toast({
                      title: "Actualización disponible",
                      description:
                        "Hay una nueva versión disponible. Cierra y vuelve a abrir la aplicación para actualizar.",
                      duration: 5000,
                    })
                  }
                })
              }
            })
          },
          (err) => {
            console.log("Service Worker registration failed: ", err)
          },
        )

        // Verificar si hay una nueva versión al volver a enfocar la página
        let refreshing = false
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          if (!refreshing) {
            refreshing = true
            window.location.reload()
          }
        })
      })
    }
  }, [toast])

  return null
}

