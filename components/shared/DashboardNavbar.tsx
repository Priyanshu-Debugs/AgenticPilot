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
  // Handle user logout - redirects to sign-in page
  const handleLogout = () => {
    // TODO: Implement proper logout logic (clear tokens, etc.)
    window.location.href = "/auth/signin"
  }

  return (
    // Fixed navigation bar with backdrop blur and shadow
    <nav className="fixed top-0 left-0 right-0 border-b border-gray-200/60 dark:border-gray-800/60 bg-white/95 dark:bg-black/95 backdrop-blur-md z-50 shadow-sm">
      <div className="px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          
          {/* Left Section: Mobile Menu + Logo */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Mobile-only hamburger/close button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="lg:hidden transition-all duration-200 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-lg p-1.5 sm:p-2"
              aria-label="Toggle sidebar"
            >
              {/* Dynamic icon based on sidebar state */}
              {isSidebarOpen ? (
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>

            {/* Brand logo with hover effects */}
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-all duration-200 group">
              <div className="relative">
                {/* Bot icon with color transitions */}
                <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400 transition-colors group-hover:text-blue-700 dark:group-hover:text-blue-300" />
                {/* Subtle background effect on hover */}
                <div className="absolute inset-0 bg-blue-600/20 dark:bg-blue-400/20 rounded-lg scale-0 group-hover:scale-110 transition-transform duration-200"></div>
              </div>
              {/* Responsive brand text with gradient */}
              <span className="text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                AgenticPilot
              </span>
            </Link>
          </div>

          {/* Right Section: Actions & User Menu */}
          <div className="flex items-center space-x-1">
            
            {/* Notification bell with unread count badge */}
            <Link href="/notifications">
              <Button variant="ghost" size="sm" className="relative hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-xl transition-all duration-200 p-1.5 sm:p-2">
                <Bell className="h-4 w-4" />
                {/* Animated notification badge */}
                <Badge className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs h-3 w-3 sm:h-4 sm:w-4 rounded-full flex items-center justify-center p-0 border border-white dark:border-black shadow-sm animate-pulse">
                  <span className="hidden sm:inline">3</span>
                  <span className="sm:hidden"></span>
                </Badge>
              </Button>
            </Link>

            {/* Settings button - Hidden on mobile to save space */}
            <Link href="/settings" className="hidden md:block">
              <Button variant="ghost" size="sm" className="hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-xl transition-all duration-200">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>

            {/* Theme toggle - Hidden on mobile, available in user dropdown */}
            <div className="hidden md:block">
              <ModeToggle />
            </div>

            {/* User profile dropdown menu */}
            <DropdownMenu>
              {/* Avatar trigger button with hover effects */}
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                  <Avatar className="h-6 w-6 sm:h-8 sm:w-8 border border-gray-200 dark:border-gray-700">
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-blue-500 to-purple-600 text-white">JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              
              {/* Dropdown content with user info and actions */}
              <DropdownMenuContent className="w-64 shadow-lg border-gray-200/60 dark:border-gray-700/60" align="end" forceMount>
                
                {/* User profile information */}
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">John Doe</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      john.doe@example.com
                    </p>
                    {/* Subscription status indicator */}
                    <div className="flex items-center mt-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-xs text-green-600 dark:text-green-400">Pro Plan</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator />
                
                {/* Desktop menu items */}
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
                
                {/* Mobile-only menu items (settings & theme) */}
                <div className="sm:hidden">
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <div className="flex items-center px-2 py-1.5 cursor-pointer">
                      <span className="mr-2 text-sm">Theme</span>
                      <ModeToggle />
                    </div>
                  </DropdownMenuItem>
                </div>
                
                <DropdownMenuSeparator />
                
                {/* Logout action with destructive styling */}
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/20">
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
