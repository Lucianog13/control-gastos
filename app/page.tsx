"use client"

import { useState } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { DashboardPage } from "@/components/dashboard-page"
import { ExpensesPage } from "@/components/expenses-page"
import { StatsPage } from "@/components/stats-page"
import { SettingsPage } from "@/components/settings-page"
import { MobileNavbar } from "@/components/mobile-navbar"
import { RegisterSW } from "./register-sw"
import { ThemeConfig } from "./theme-config"
import { InstallBanner } from "@/components/install-banner"

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <main className="min-h-screen bg-background">
      <RegisterSW />
      <ThemeConfig />
      <div className="container max-w-md mx-auto px-4 pb-16">
        <h1 className="text-2xl font-bold text-center py-4">Control de Gastos</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="dashboard">
            <DashboardPage onAddExpense={() => setActiveTab("expenses")} />
          </TabsContent>
          <TabsContent value="expenses">
            <ExpensesPage />
          </TabsContent>
          <TabsContent value="stats">
            <StatsPage />
          </TabsContent>
          <TabsContent value="settings">
            <SettingsPage />
          </TabsContent>
        </Tabs>
      </div>
      <MobileNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <InstallBanner />
    </main>
  )
}

