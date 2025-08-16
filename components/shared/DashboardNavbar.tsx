"use client"

// Core component imports from shadcn/ui
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Icon imports from Lucide React
import { Menu, Bell, Settings, User, CreditCard, LogOut, Bot, X } from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/utils/auth/AuthProvider"
import { useUserProfile } from "@/utils/hooks/useUserProfile"

// Props interface for type safety
interface DashboardNavbarProps {
  toggleSidebar: () => void  // Function to toggle mobile sidebar visibility
  isSidebarOpen: boolean     // Current state of sidebar (for mobile icon switching)
}

/**
 * DashboardNavbar Component
 * 
 * A responsive navigation bar for the dashboard layout that includes:
 * - Mobile sidebar toggle button
 * - Brand logo and text
 * - Notification bell with badge
 * - Settings access (desktop only)
 * - Theme toggle (desktop only)
 * - User profile dropdown with account actions
 * 
 * Features:
 * - Fixed positioning to stay visible during scroll
 * - Responsive design with mobile-specific menu items
 * - Backdrop blur effect for modern appearance
 * - Smooth transitions and hover effects
 */
export function DashboardNavbar({ toggleSidebar, isSidebarOpen }: DashboardNavbarProps) {
  const { user, signOut } = useAuth()
  const { profile, loading } = useUserProfile()

  // Handle user logout
  const handleLogout = async () => {
    try {
      const result = await signOut()
      if (!result.success && result.error) {
        console.error('Logout error:', result.error)
        // Even if logout fails, redirect to login page
        window.location.href = '/'
      }
      // Success redirect is handled by AuthProvider
    } catch (error) {
      console.error('Logout error:', error)
      // Force redirect on error
      window.location.href = '/'
    }
  }

  // Generate user initials for avatar fallback
  const getUserInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase()
    }
    return 'U'
  }

  // Get display name
  const getDisplayName = () => {
    return profile?.full_name || user?.email?.split('@')[0] || 'User'
  }

  // Get plan display
  const getPlanDisplay = () => {
    if (!profile) return 'Loading...'
    
    const planMap = {
      starter: 'Starter Plan',
      professional: 'Pro Plan',
      enterprise: 'Enterprise'
    }
    return planMap[profile.plan] || 'Starter Plan'
  }

  return (
    // Fixed navigation bar with Supabase-inspired design
    <nav className="fixed top-0 left-0 right-0 border-b border-border bg-background/95 backdrop-blur-md z-50">
      <div className="container-padding">
        <div className="flex justify-between items-center h-14 sm:h-16">
          
          {/* Left Section: Mobile Menu + Logo */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Mobile-only hamburger/close button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="lg:hidden"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>

            {/* Brand logo */}
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <span className="text-lg sm:text-xl font-bold text-foreground">
                AgenticPilot
              </span>
            </Link>
          </div>

          {/* Right Section: Actions & User Menu */}
          <div className="flex items-center space-x-2">
            
            {/* Notification bell */}
            <Link href="/notifications">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs h-4 w-4 rounded-full flex items-center justify-center p-0">
                  3
                </Badge>
              </Button>
            </Link>

            {/* Settings button - Hidden on mobile */}
            <Link href="/settings" className="hidden md:block">
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>

            {/* Theme toggle - Hidden on mobile */}
            <div className="hidden md:block">
              <ModeToggle />
            </div>

            {/* User profile dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full">
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                    <AvatarImage src={profile?.avatar_url || "/placeholder-user.jpg"} alt="User" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent className="w-64" align="end" forceMount>
                {/* User profile information */}
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium">
                      {loading ? 'Loading...' : getDisplayName()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email || 'No email'}
                    </p>
                    <div className="flex items-center mt-2">
                      <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                      <span className="text-xs text-primary font-medium">
                        {getPlanDisplay()}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/billing" className="cursor-pointer">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Billing</span>
                  </Link>
                </DropdownMenuItem>
                
                {/* Mobile-only settings */}
                <div className="md:hidden">
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                </div>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:bg-destructive/10">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
