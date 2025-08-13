"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Mail, Package, Instagram, Bot, Bell, Menu, X, Star, Users, Zap, Shield } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import Link from "next/link"
import Image from "next/image"

export default function LandingPage() {
  const [showSignIn, setShowSignIn] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleGetStarted = () => {
    window.location.href = "/auth/signup"
  }

  const handleSignIn = () => {
    window.location.href = "/auth/signin"
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Navigation */}
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
              <div className="flex items-center space-x-2">
                <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-black dark:text-white" />
                <span className="text-lg sm:text-xl font-bold">AgenticPilot</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="#features"
                className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                Features
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/pricing"
                className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/contact"
                className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                Contact
              </Link>
            </div>
            
            {/* Right side - Desktop buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/notifications">
                <Button variant="ghost" size="sm">
                  <Bell className="h-4 w-4" />
                </Button>
              </Link>
              <ModeToggle />
              <Button
                variant="outline"
                onClick={handleSignIn}
                disabled={showSignIn}
                className="border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black bg-transparent"
              >
                {showSignIn ? "Signing In..." : "Sign In"}
              </Button>
              <Button
                onClick={handleGetStarted}
                className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                Get Started
              </Button>
            </div>

            {/* Mobile menu button and mode toggle */}
            <div className="md:hidden flex items-center space-x-2">
              <ModeToggle />
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
            
            {/* Side Drawer - Full Height */}
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

              {/* Drawer Content */}
              <div className="flex flex-col h-full">
                {/* Navigation Links */}
                <div className="flex-1 px-6 py-6 space-y-2">
                  <div className="space-y-1">
                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 px-4">
                      Navigation
                    </h3>
                    
                    <Link
                      href="#features"
                      className="flex items-center px-4 py-3 text-base font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                      onClick={toggleMobileMenu}
                    >
                      <Bot className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-500" />
                      Features
                    </Link>
                    
                    <Link
                      href="#benefits"
                      className="flex items-center px-4 py-3 text-base font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                      onClick={toggleMobileMenu}
                    >
                      <Star className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-500" />
                      Benefits
                    </Link>
                    
                    <Link
                      href="/dashboard"
                      className="flex items-center px-4 py-3 text-base font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                      onClick={toggleMobileMenu}
                    >
                      <Bot className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-500" />
                      Dashboard
                    </Link>
                    
                    <Link
                      href="/pricing"
                      className="flex items-center px-4 py-3 text-base font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                      onClick={toggleMobileMenu}
                    >
                      <Package className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-500" />
                      Pricing
                    </Link>
                    
                    <Link
                      href="/contact"
                      className="flex items-center px-4 py-3 text-base font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                      onClick={toggleMobileMenu}
                    >
                      <Mail className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-500" />
                      Contact
                    </Link>

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
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleSignIn()
                      toggleMobileMenu()
                    }}
                    disabled={showSignIn}
                    className="w-full border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black bg-transparent transition-all duration-200"
                  >
                    {showSignIn ? "Signing In..." : "Sign In"}
                  </Button>
                  <Button
                    onClick={() => {
                      handleGetStarted()
                      toggleMobileMenu()
                    }}
                    className="w-full bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-all duration-200"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </nav>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <Badge className="bg-black/10 dark:bg-white/10 text-black dark:text-white border-black/20 dark:border-white/20">
                  AI-Powered Automation
                </Badge>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Automate Your Business with <span className="underline decoration-2">AI Agents</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Transform your business operations with intelligent automation. From customer support to inventory
                  management, let AI handle the repetitive tasks while you focus on growth.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  onClick={handleGetStarted}
                  className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-base sm:text-lg px-6 sm:px-8"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base sm:text-lg px-6 sm:px-8 border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black bg-transparent"
                >
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="relative mt-8 lg:mt-0">
              <div className="relative z-10">
                <Image
                  src="/ai-automation-dashboard.png"
                  alt="AI Automation Dashboard"
                  width={800}
                  height={600}
                  className="rounded-lg shadow-2xl border border-gray-200 dark:border-gray-800 w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Changed to hexagonal shapes and minimal design */}
      <section id="features" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold">
              Three Core <span className="underline decoration-2">Automations</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Streamline your business with our essential automation tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Gmail Automation */}
            <div className="group text-center">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 transform rotate-45 bg-black dark:bg-white flex items-center justify-center">
                  <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-white dark:text-black transform -rotate-45" />
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-lg sm:text-xl font-bold">Smart Email Responses</h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    AI-powered Gmail automation that responds to customer inquiries instantly.
                  </p>
                </div>
              </div>
            </div>

            {/* Inventory Management */}
            <div className="group text-center">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 transform rotate-45 bg-black dark:bg-white flex items-center justify-center">
                  <Package className="h-6 w-6 sm:h-8 sm:w-8 text-white dark:text-black transform -rotate-45" />
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-lg sm:text-xl font-bold">Inventory Management</h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    Automated inventory tracking, stock alerts, and reorder management.
                  </p>
                </div>
              </div>
            </div>

            {/* Instagram Automation */}
            <div className="group text-center">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 transform rotate-45 bg-black dark:bg-white flex items-center justify-center">
                  <Instagram className="h-6 w-6 sm:h-8 sm:w-8 text-white dark:text-black transform -rotate-45" />
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-lg sm:text-xl font-bold">Social Media Automation</h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    Schedule and automatically post engaging content to Instagram.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6 lg:space-y-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold">
            Ready to <span className="underline decoration-2">Automate Your Success?</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
            Join thousands of businesses already using AgenticPilot.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-base sm:text-lg px-6 sm:px-8"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer - Added contact email */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Bot className="h-6 w-6 text-black dark:text-white" />
              <span className="text-lg font-bold">AgenticPilot</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
              <Link href="/contact" className="hover:text-black dark:hover:text-white transition-colors">
                Contact
              </Link>
              <span>agenticpilot.team@gmail.com</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">© 2024 AgenticPilot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
