"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Download } from "lucide-react"

export function InstallBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    // Verificar si la app ya está instalada
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return
    }

    // Verificar si el usuario ya cerró el banner
    const bannerClosed = localStorage.getItem("installBannerClosed")
    if (bannerClosed) {
      return
    }

    // Capturar el evento beforeinstallprompt
    const handler = (e: Event) => {
      // Prevenir que Chrome muestre automáticamente el diálogo
      e.preventDefault()
      // Guardar el evento para usarlo más tarde
      setDeferredPrompt(e)
      // Mostrar nuestro banner personalizado
      setShowBanner(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    // Mostrar el diálogo de instalación
    deferredPrompt.prompt()

    // Esperar a que el usuario responda
    const choiceResult = await deferredPrompt.userChoice

    // Ocultar el banner independientemente de la respuesta
    setShowBanner(false)
    setDeferredPrompt(null)
  }

  const handleClose = () => {
    setShowBanner(false)
    // Recordar que el usuario cerró el banner
    localStorage.setItem("installBannerClosed", "true")
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-16 left-0 right-0 px-4 z-50 animate-fade-in">
      <Card className="shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Download className="text-primary" />
              <div>
                <p className="font-medium">Instalar aplicación</p>
                <p className="text-sm text-muted-foreground">Accede más rápido desde tu pantalla de inicio</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X size={18} />
              </Button>
              <Button onClick={handleInstall}>Instalar</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

