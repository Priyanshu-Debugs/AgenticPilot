"use client"

// Core UI components
import { Button } from "@/components/ui/button"
import { Bot, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { SettingsPage } from "@/components/shared/SettingsPage"

/**
 * Settings Component
 * 
 * Standalone page for application settings and preferences.
 * Uses "use client" directive because it passes event handlers to child components.
 * 
 * Features:
 * - Comprehensive settings interface with tabs
 * - Profile, notifications, automation, security, and integration settings
 * - Save/reset functionality
 * - Import/export capabilities
 * - Back to dashboard navigation
 */
export default function Settings() {
  const handleSave = (settings: any) => {
    // Save settings - would integrate with backend API
    // TODO: Implement API call to save settings
  }

  const handleReset = () => {
    // Reset settings to defaults - would integrate with backend API
    // TODO: Implement API call to reset settings
  }

  const handleExport = () => {
    // Export settings as JSON file
    // TODO: Implement settings export functionality
  }

  const handleImport = (data: any) => {
    // Import settings from file
    // TODO: Implement settings import functionality
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
        <SettingsPage
          onSave={handleSave}
          onReset={handleReset}
          onExport={handleExport}
          onImport={handleImport}
        />
      </div>
    </div>
  )
}
