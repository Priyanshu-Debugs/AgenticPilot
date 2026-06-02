"use client";

// Core UI components
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import Link from "next/link";
import { Navigation } from "@/components/shared/Navigation";
import { NotificationSystem } from "@/components/shared/NotificationSystem";
import { useNotifications } from "@/utils/hooks/useNotifications";
import { useAuth } from "@/utils/auth/AuthProvider";

/**
 * NotificationsPage Component
 *
 * Standalone page for viewing and managing notifications.
 * Uses shared Navigation component for consistent UI.
 */
export default function NotificationsPage() {
  const { user, signOut } = useAuth();
  const {
    notifications,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    dismissNotification,
  } = useNotifications();

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id, true);
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  const handleDismiss = async (id: string) => {
    try {
      await dismissNotification(id);
    } catch (err) {
      console.error("Failed to dismiss notification:", err);
    }
  };

  const handleAction = (notification: any) => {
    // Handle notification action
    if (notification.action_url) {
      window.location.href = notification.action_url;
    }
  };

  const navUser = user
    ? {
        name: user.full_name || user.email?.split("@")[0] || "User",
        email: user.email || "",
        avatar: user.avatar_url || user.user_metadata?.avatar_url || "",
      }
    : undefined;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation
        isAuthenticated={!!user}
        user={navUser}
        onSignIn={() => window.location.assign("/auth/signin")}
        onSignUp={() => window.location.assign("/auth/signup")}
        onSignOut={() => {
          void signOut();
        }}
      />

      {/* Notifications Content */}
      <div className="container-padding section-spacing">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full size-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading notifications…</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-destructive mb-4">
                Error loading notifications: {error}
              </p>
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
  );
}
