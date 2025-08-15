"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ModeToggle } from "@/components/mode-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowRight, Mail, Package, Instagram, Bot, Bell, Menu, X, User, Settings, LogOut } from "lucide-react"
import Link from "next/link"

interface NavigationItem {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
}

interface NavigationProps {
  items?: NavigationItem[]
  isAuthenticated?: boolean
  user?: {
    name: string
    email: string
    avatar?: string
  }
  onSignIn?: () => void
  onSignUp?: () => void
  onSignOut?: () => void
}

const defaultNavItems: NavigationItem[] = [
  { label: "Features", href: "#features" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
]

export function Navigation({ 
  items = defaultNavItems, 
  isAuthenticated = false, 
  user,
  onSignIn = () => window.location.href = "/auth/signin",
  onSignUp = () => window.location.href = "/auth/signup",
  onSignOut = () => window.location.href = "/auth/signin"
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSignInLoading, setIsSignInLoading] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleSignIn = async () => {
    setIsSignInLoading(true)
    try {
      await onSignIn()
    } finally {
      setIsSignInLoading(false)
    }
  }

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Hamburger + Logo */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="md:hidden transition-all duration-200 hover:scale-105 hover:bg-gray-100 dark:hover:bg-gray-800 relative z-50 p-2"
              aria-label="Toggle navigation menu"
            >
              <div className="relative w-5 h-5">
                <Menu className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'}`} />
                <X className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-0 opacity-100' : 'rotate-180 opacity-0'}`} />
              </div>
            </Button>
            <Link href="/" className="flex items-center space-x-2">
              <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-black dark:text-white" />
              <span className="text-lg sm:text-xl font-bold">AgenticPilot</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
          
          {/* Right side - Desktop buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/notifications">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
            </Link>
            <ModeToggle />
            
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={handleSignIn}
                  disabled={isSignInLoading}
                  className="border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black bg-transparent"
                >
                  {isSignInLoading ? "Signing In..." : "Sign In"}
                </Button>
                <Button
                  onClick={onSignUp}
                  className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button, theme toggle, and sign in */}
          <div className="md:hidden flex items-center space-x-2">
            <ModeToggle />
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-xs">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignIn}
                disabled={isSignInLoading}
                className="border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black bg-transparent text-xs px-2 py-1"
              >
                {isSignInLoading ? "..." : "Sign In"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Side Drawer Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
            onClick={toggleMobileMenu}
          />
          
          {/* Side Drawer */}
          <div className={`fixed top-0 left-0 h-screen w-80 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 z-50 md:hidden transform transition-transform duration-300 ease-in-out shadow-2xl ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <Link href="/" className="flex items-center space-x-2" onClick={toggleMobileMenu}>
                <Bot className="h-8 w-8 text-black dark:text-white" />
                <span className="text-xl font-bold text-black dark:text-white">AgenticPilot</span>
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleMobileMenu}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors p-2"
                aria-label="Close menu"
              >
                <X className="h-5 w-5 text-black dark:text-white" />
              </Button>
            </div>

            {/* User Info Section (if authenticated) */}
            {isAuthenticated && user && (
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Drawer Content */}
            <div className="flex flex-col h-full">
              {/* Navigation Links */}
              <div className="flex-1 px-6 py-6 space-y-2">
                <div className="space-y-1">
                  <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 px-4">
                    Navigation
                  </h3>
                  
                  {items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center px-4 py-3 text-base font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                      onClick={toggleMobileMenu}
                    >
                      {item.icon && <item.icon className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-500" />}
                      {item.label}
                    </Link>
                  ))}

                  <Link
                    href="/notifications"
                    className="flex items-center px-4 py-3 text-base font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                    onClick={toggleMobileMenu}
                  >
                    <Bell className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-500" />
                    Notifications
                  </Link>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="px-6 py-6 border-t border-gray-200 dark:border-gray-800 space-y-3">
                {isAuthenticated ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      onSignOut()
                      toggleMobileMenu()
                    }}
                    className="w-full"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      onSignUp()
                      toggleMobileMenu()
                    }}
                    className="w-full bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-all duration-200"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  )
}
