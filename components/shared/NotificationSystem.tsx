"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle, AlertTriangle, Info, X, Settings, Archive } from "lucide-react"

interface Notification {
  id: string
  type: "success" | "warning" | "info" | "error"
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
  category: "system" | "automation" | "alert" | "update"
}

interface NotificationSystemProps {
  notifications?: Notification[]
  onMarkAsRead?: (id: string) => void
  onMarkAllAsRead?: () => void
  onDismiss?: (id: string) => void
  onAction?: (notification: Notification) => void
  showFullInterface?: boolean
}

export function NotificationSystem({ 
  notifications = [],
  onMarkAsRead = () => {},
  onMarkAllAsRead = () => {},
  onDismiss = () => {},
  onAction = () => {},
  showFullInterface = false
}: NotificationSystemProps) {
  const [localNotifications, setLocalNotifications] = useState(notifications)
  const [filter, setFilter] = useState<"all" | "unread" | "system" | "automation" | "alert">("all")

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "error":
        return <AlertTriangle className="h-5 w-5 text-destructive" />
      case "info":
      default:
        return <Info className="h-5 w-5 text-primary" />
    }
  }

  const getBorderColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "border-l-emerald-500"
      case "warning":
        return "border-l-amber-500"
      case "error":
        return "border-l-destructive"
      case "info":
      default:
        return "border-l-primary"
    }
  }

  const getCategoryBadgeColor = (category: Notification["category"]) => {
    switch (category) {
      case "system":
        return "bg-muted/50 text-muted-foreground border-border"
      case "automation":
        return "bg-primary/10 text-primary border-primary/20"
      case "alert":
        return "bg-destructive/10 text-destructive border-destructive/20"
      case "update":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
      default:
        return "bg-muted/50 text-muted-foreground border-border"
    }
  }

  const handleMarkAsRead = (id: string) => {
    setLocalNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
    onMarkAsRead(id)
  }

  const handleDismiss = (id: string) => {
    setLocalNotifications(prev => prev.filter(notif => notif.id !== id))
    onDismiss(id)
  }

  const handleMarkAllAsRead = () => {
    setLocalNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    )
    onMarkAllAsRead()
  }

  const filteredNotifications = localNotifications.filter(notif => {
    switch (filter) {
      case "unread":
        return !notif.read
      case "system":
      case "automation":
      case "alert":
        return notif.category === filter
      default:
        return true
    }
  })

  const unreadCount = localNotifications.filter(n => !n.read).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Bell className="h-6 w-6" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs h-5 w-5 rounded-full flex items-center justify-center p-0">
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground">
              Stay updated with your automation activities
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: "all", label: "All", count: localNotifications.length },
          { key: "unread", label: "Unread", count: unreadCount },
          { key: "system", label: "System", count: localNotifications.filter(n => n.category === "system").length },
          { key: "automation", label: "Automation", count: localNotifications.filter(n => n.category === "automation").length },
          { key: "alert", label: "Alerts", count: localNotifications.filter(n => n.category === "alert").length }
        ].map(({ key, label, count }) => (
          <Button
            key={key}
            variant={filter === key ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(key as any)}
            className="relative"
          >
            {label}
            {count > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {count}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No notifications</h3>
              <p className="text-muted-foreground">
                {filter === "unread" ? "All caught up! No unread notifications." : "You have no notifications to display."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`border-l-4 ${getBorderColor(notification.type)} ${
                !notification.read ? "bg-muted/30 card-elevated" : "card-elevated"
              } transition-all hover:shadow-md`}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`text-sm font-medium ${!notification.read ? "font-semibold" : ""}`}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center space-x-3">
                          <span className="text-xs text-muted-foreground">
                            {notification.timestamp}
                          </span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getCategoryBadgeColor(notification.category)}`}
                          >
                            {notification.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 ml-4">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-xs"
                          >
                            Mark as read
                          </Button>
                        )}
                        {notification.actionUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onAction(notification)}
                            className="text-xs"
                          >
                            View
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDismiss(notification.id)}
                          className="text-xs p-1"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Load More */}
      {filteredNotifications.length > 0 && (
        <div className="text-center">
          <Button variant="outline">
            <Archive className="h-4 w-4 mr-2" />
            Load Older Notifications
          </Button>
        </div>
      )}
    </div>
  )
}
