import { Button } from "@/components/ui/button"
import { Bot, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { SettingsPage } from "@/components/shared/SettingsPage"

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
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Bot className="h-8 w-8 text-black dark:text-white" />
              <Link href="/" className="text-xl font-bold">
                AgenticPilot
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <ModeToggle />
              <Button variant="outline" asChild className="border-black dark:border-white bg-transparent">
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
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
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
