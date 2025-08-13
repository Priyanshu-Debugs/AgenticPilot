import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bot, Bell, Mail, Package, Instagram, CheckCircle } from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      type: "success",
      icon: Mail,
      title: "Gmail Automation Active",
      message: "Successfully processed 23 emails in the last hour",
      time: "2 minutes ago",
      read: false,
    },
    {
      id: 2,
      type: "warning",
      icon: Package,
      title: "Low Stock Alert",
      message: "3 items are running low and need reordering",
      time: "15 minutes ago",
      read: false,
    },
    {
      id: 3,
      type: "info",
      icon: Instagram,
      title: "Post Scheduled",
      message: "Your Instagram post has been scheduled for 3:00 PM",
      time: "1 hour ago",
      read: true,
    },
    {
      id: 4,
      type: "success",
      icon: CheckCircle,
      title: "Automation Complete",
      message: "Inventory sync completed successfully",
      time: "2 hours ago",
      read: true,
    },
  ]

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
      <div className="max-w-4xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Notifications</h1>
            <p className="text-gray-600 dark:text-gray-400">Stay updated with your automation activities</p>
          </div>
          <Button variant="outline" className="border-black dark:border-white bg-transparent">
            Mark All as Read
          </Button>
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => {
            const IconComponent = notification.icon

            return (
              <Card
                key={notification.id}
                className={`border-gray-200 dark:border-gray-800 transition-all hover:shadow-sm ${
                  !notification.read ? "bg-black/5 dark:bg-white/5" : ""
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        notification.type === "success"
                          ? "bg-green-100 dark:bg-green-900/20"
                          : notification.type === "warning"
                            ? "bg-yellow-100 dark:bg-yellow-900/20"
                            : "bg-blue-100 dark:bg-blue-900/20"
                      }`}
                    >
                      <IconComponent
                        className={`h-5 w-5 ${
                          notification.type === "success"
                            ? "text-green-600 dark:text-green-400"
                            : notification.type === "warning"
                              ? "text-yellow-600 dark:text-yellow-400"
                              : "text-blue-600 dark:text-blue-400"
                        }`}
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium">{notification.title}</h3>
                        <div className="flex items-center space-x-2">
                          {!notification.read && (
                            <Badge
                              variant="outline"
                              className="bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                            >
                              New
                            </Badge>
                          )}
                          <span className="text-sm text-gray-500 dark:text-gray-400">{notification.time}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">{notification.message}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {notifications.length === 0 && (
          <Card className="border-gray-200 dark:border-gray-800">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No notifications</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                You&apos;re all caught up! New notifications will appear here.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
