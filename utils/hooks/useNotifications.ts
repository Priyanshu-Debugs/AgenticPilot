import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/utils/auth/AuthProvider'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  category: string
  action_url?: string
  action_label?: string
  read: boolean
  read_at?: string
  created_at: string
}

// Transform API notification to component format
const transformNotification = (apiNotif: Notification) => ({
  id: apiNotif.id,
  type: apiNotif.type,
  title: apiNotif.title,
  message: apiNotif.message,
  timestamp: formatTimestamp(apiNotif.created_at),
  read: apiNotif.read,
  actionUrl: apiNotif.action_url,
  category: apiNotif.category as "system" | "automation" | "alert" | "update"
})

const formatTimestamp = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  return date.toLocaleDateString()
}

export function useNotifications() {
  const [rawNotifications, setRawNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  // Transform raw notifications for component consumption
  const notifications = rawNotifications.map(transformNotification)

  // Load notifications from API
  const loadNotifications = useCallback(async (filter: 'all' | 'unread' | 'read' = 'all') => {
    if (!user) {
      setRawNotifications([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`/api/notifications?filter=${filter}&limit=50`)
      
      if (!response.ok) {
        throw new Error('Failed to load notifications')
      }
      
      const data = await response.json()
      setRawNotifications(data.notifications || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications')
      console.error('Error loading notifications:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  // Mark a notification as read/unread
  const markAsRead = async (id: string, read: boolean = true) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update notification')
      }

      const data = await response.json()
      
      // Update local state
      setRawNotifications(prev => 
        prev.map(notif => 
          notif.id === id 
            ? { ...notif, read: data.notification.read, read_at: data.notification.read_at }
            : notif
        )
      )

      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update notification'
      setError(errorMessage)
      console.error('Error updating notification:', err)
      throw new Error(errorMessage)
    }
  }

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to mark all notifications as read')
      }

      const data = await response.json()
      
      // Update local state - mark all as read
      setRawNotifications(prev => 
        prev.map(notif => ({
          ...notif,
          read: true,
          read_at: new Date().toISOString()
        }))
      )

      return { success: true, updated_count: data.updated_count }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark all notifications as read'
      setError(errorMessage)
      console.error('Error marking all as read:', err)
      throw new Error(errorMessage)
    }
  }

  // Delete/dismiss a notification
  const dismissNotification = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to dismiss notification')
      }

      // Remove from local state
      setRawNotifications(prev => prev.filter(notif => notif.id !== id))

      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to dismiss notification'
      setError(errorMessage)
      console.error('Error dismissing notification:', err)
      throw new Error(errorMessage)
    }
  }

  // Create a new notification (mainly for testing/admin purposes)
  const createNotification = async (notificationData: {
    title: string
    message: string
    type?: 'info' | 'success' | 'warning' | 'error'
    category?: string
    action_url?: string
    action_label?: string
  }) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create notification')
      }

      const data = await response.json()
      
      // Add to local state
      setRawNotifications(prev => [data.notification, ...prev])

      return { success: true, notification: data.notification }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create notification'
      setError(errorMessage)
      console.error('Error creating notification:', err)
      throw new Error(errorMessage)
    }
  }

  // Get unread count
  const unreadCount = rawNotifications.filter(n => !n.read).length

  // Load notifications when user changes
  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  return {
    notifications,
    loading,
    error,
    unreadCount,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    createNotification,
    reload: () => loadNotifications()
  }
}
