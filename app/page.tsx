"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/shared/Navigation"
import { FeatureCard } from "@/components/shared/Cards"
import { ArrowRight, Mail, Package, Instagram, Bot } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LandingPage() {
  const handleGetStarted = () => {
    window.location.href = "/auth/signup"
  }

  const handleSignIn = () => {
    window.location.href = "/auth/signin"
  }

  const features = [
    {
      title: "Smart Email Responses",
      description: "AI-powered Gmail automation that responds to customer inquiries instantly.",
      icon: Mail,
      href: "/dashboard/gmail"
    },
    {
      title: "Inventory Management", 
      description: "Automated inventory tracking, stock alerts, and reorder management.",
      icon: Package,
      href: "/dashboard/inventory"
    },
    {
      title: "Social Media Automation",
      description: "Schedule and automatically post engaging content to Instagram.",
      icon: Instagram,
      href: "/dashboard/instagram"
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Navigation */}
      <Navigation 
        onSignIn={handleSignIn}
        onSignUp={handleGetStarted}
      />

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

      {/* Features Section */}
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
            {features.map((feature) => (
              <FeatureCard
                key={feature.title}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                href={feature.href}
              />
            ))}
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

      {/* Footer */}
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
