"use client"

// Core UI components
import { Button } from "@/components/ui/button"
import { Bot } from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { NotificationSystem } from "@/components/shared/NotificationSystem"

/**
 * NotificationsPage Component
 * 
 * Standalone page for viewing and managing notifications.
 * Uses "use client" directive because it passes event handlers to child components.
 * 
 * Features:
 * - Full-page notification interface
 * - Mark as read functionality
 * - Notification filtering and categorization
 * - Action buttons for notification responses
 * - Back to dashboard navigation
 */
export default function NotificationsPage() {
  const handleMarkAsRead = (id: string) => {
    // Mark notification as read - would integrate with backend API
    // TODO: Implement API call to mark notification as read
  }

  const handleMarkAllAsRead = () => {
    // Mark all notifications as read - would integrate with backend API
    // TODO: Implement API call to mark all notifications as read
  }

  const handleDismiss = (id: string) => {
    // Dismiss notification - would integrate with backend API
    // TODO: Implement API call to dismiss notification
  }

  const handleAction = (notification: any) => {
    // Handle notification action
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-black dark:text-white" />
              <Link href="/" className="text-xl font-bold">
                AgenticPilot
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <ModeToggle />
              <Button variant="outline" asChild className="border-black dark:border-white bg-transparent">
                <Link href="/dashboard">Back to Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Notifications Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <NotificationSystem
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onDismiss={handleDismiss}
          onAction={handleAction}
        />
      </div>
    </div>
  )
}
