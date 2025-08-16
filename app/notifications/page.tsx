"use client"

// Core UI components
import { Button } from "@/components/ui/button"
import { Bot } from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { NotificationSystem } from "@/components/shared/NotificationSystem"
import { useNotifications } from "@/utils/hooks/useNotifications"

/**
 * NotificationsPage Component
 * 
 * Standalone page for viewing and managing notifications.
 * Uses "use client" directive because it passes event handlers to child components.
 * 
 * Features:
 * - Full-page notification interface with API integration
 * - Mark as read functionality
 * - Notification filtering and categorization
 * - Action buttons for notification responses
 * - Back to dashboard navigation
 */
export default function NotificationsPage() {
  const { 
    notifications, 
    loading, 
    error, 
    markAsRead, 
    markAllAsRead, 
    dismissNotification 
  } = useNotifications()

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id, true)
    } catch (err) {
      console.error('Failed to mark notification as read:', err)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead()
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err)
    }
  }

  const handleDismiss = async (id: string) => {
    try {
      await dismissNotification(id)
    } catch (err) {
      console.error('Failed to dismiss notification:', err)
    }
  }

  const handleAction = (notification: any) => {
    // Handle notification action
    if (notification.action_url) {
      window.location.href = notification.action_url
    }
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
                <Link href="/dashboard">Back to Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Notifications Content */}
      <div className="container-padding section-spacing">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading notifications...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-destructive mb-4">Error loading notifications: {error}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </div>
        ) : (
          <NotificationSystem
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onDismiss={handleDismiss}
            onAction={handleAction}
            showFullInterface={true}
          />
        )}
      </div>
    </div>
  )
}
