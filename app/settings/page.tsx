"use client"

// Core UI components
import { Button } from "@/components/ui/button"
import { Bot, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { SettingsPage } from "@/components/shared/SettingsPage"
import { useSettings } from "@/utils/hooks/useSettings"

/**
 * Settings Component
 * 
 * Standalone page for application settings and preferences.
 * Uses "use client" directive because it passes event handlers to child components.
 * 
 * Features:
 * - Comprehensive settings interface with tabs
 * - Profile, notifications, automation, security, and integration settings
 * - Save/reset functionality with API integration
 * - Import/export capabilities
 * - Back to dashboard navigation
 */
export default function Settings() {
  const { settings, loading, error, saveSettings, resetSettings } = useSettings()

  const handleSave = async (newSettings: any) => {
    try {
      await saveSettings(newSettings)
      // Could show a success toast here
    } catch (err) {
      console.error('Failed to save settings:', err)
      // Could show an error toast here
    }
  }

  const handleReset = async () => {
    try {
      await resetSettings()
      // Could show a success toast here
    } catch (err) {
      console.error('Failed to reset settings:', err)
      // Could show an error toast here
    }
  }

  const handleExport = () => {
    if (!settings) return
    
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'agenticpilot-settings.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string)
        await saveSettings(importedSettings)
        // Could show a success toast here
      } catch (err) {
        console.error('Failed to import settings:', err)
        // Could show an error toast here
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container-padding">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <Link href="/" className="text-lg sm:text-xl font-bold">
                AgenticPilot
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <ModeToggle />
              <Button variant="outline" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Settings Content */}
      <div className="container-padding section-spacing">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading settings...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-destructive mb-4">Error loading settings: {error}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </div>
        ) : settings ? (
          <SettingsPage
            settings={settings}
            onSave={handleSave}
            onReset={handleReset}
            onExport={handleExport}
            onImport={handleImport}
          />
        ) : (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">No settings found</p>
          </div>
        )}
      </div>
    </div>
  )
}
