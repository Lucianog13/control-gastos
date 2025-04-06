"use client"

import type React from "react"

import { Home, ListPlus, BarChart3, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileNavbarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function MobileNavbar({ activeTab, setActiveTab }: MobileNavbarProps) {
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background shadow-lg">
      <div className="container max-w-md mx-auto">
        <div className="flex justify-around">
          <NavbarButton
            icon={<Home size={20} />}
            label="Inicio"
            isActive={activeTab === "dashboard"}
            onClick={() => handleTabChange("dashboard")}
          />
          <NavbarButton
            icon={<ListPlus size={20} />}
            label="Gastos"
            isActive={activeTab === "expenses"}
            onClick={() => handleTabChange("expenses")}
          />
          <NavbarButton
            icon={<BarChart3 size={20} />}
            label="Estadísticas"
            isActive={activeTab === "stats"}
            onClick={() => handleTabChange("stats")}
          />
          <NavbarButton
            icon={<Settings size={20} />}
            label="Ajustes"
            isActive={activeTab === "settings"}
            onClick={() => handleTabChange("settings")}
          />
        </div>
      </div>
    </div>
  )
}

function NavbarButton({
  icon,
  label,
  isActive,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      className={cn(
        "flex flex-col items-center justify-center py-2 px-4 transition-colors",
        isActive ? "text-primary" : "text-muted-foreground",
      )}
      onClick={onClick}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  )
}

