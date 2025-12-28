"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/shared/Navigation"
import { FeatureCard } from "@/components/shared/Cards"
import { ArrowRight, Mail, Package, Instagram, Bot, Star, CheckCircle, Sparkles, Zap, Users, Shield, Clock, Play, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LandingPage() {
  const [showDemoMessage, setShowDemoMessage] = useState(false)

  const handleGetStarted = () => {
    window.location.href = "/auth/signup"
  }

  const handleSignIn = () => {
    window.location.href = "/auth/signin"
  }

  const handleWatchDemo = () => {
    // Show demo message and navigate to dashboard for interactive demo
    setShowDemoMessage(true)
    setTimeout(() => {
      window.location.href = "/dashboard"
    }, 1500)
  }

  const features = [
    {
      title: "Smart Email Responses",
      description: "AI-powered Gmail automation that responds to customer inquiries instantly with human-like precision and context awareness.",
      icon: Mail,
      href: "/dashboard/gmail",
      stats: "95% accuracy rate"
    },
    {
      title: "Inventory Management",
      description: "Automated inventory tracking, smart stock alerts, and predictive reorder management that prevents stockouts.",
      icon: Package,
      href: "/dashboard/inventory",
      stats: "40% cost reduction"
    },
    {
      title: "Social Media Automation",
      description: "Schedule and automatically post engaging content across all your social platforms with AI-generated captions.",
      icon: Instagram,
      href: "/dashboard/instagram",
      stats: "3x engagement boost"
    }
  ]

  const stats = [
    { value: "50K+", label: "Tasks Automated Daily", icon: Zap },
    { value: "99.9%", label: "Uptime Guarantee", icon: Shield },
    { value: "< 2s", label: "Average Response", icon: Clock },
    { value: "10K+", label: "Active Users", icon: Users }
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CEO at TechFlow",
      content: "AgenticPilot transformed our customer support. We went from 4-hour response times to instant replies.",
      avatar: "/placeholder-user.jpg",
      company: "TechFlow"
    },
    {
      name: "Marcus Rodriguez",
      role: "Operations Manager",
      content: "The inventory automation saved us 20 hours per week and eliminated stockouts completely.",
      avatar: "/placeholder-user.jpg",
      company: "RetailCorp"
    },
    {
      name: "Emily Watson",
      role: "Marketing Director",
      content: "Our social media engagement increased 300% after implementing AgenticPilot's automation.",
      avatar: "/placeholder-user.jpg",
      company: "BrandStudio"
    }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <Navigation
        onSignIn={handleSignIn}
        onSignUp={handleGetStarted}
      />

      {/* Hero Section - Mobile-First Design */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(62,207,142,0.1),transparent_50%)]"></div>

        <div className="relative container-padding section-spacing">
          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs sm:text-sm font-medium">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-primary" />
              AI-Powered Business Automation
            </div>

            {/* Main Heading */}
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                Automate Your Business with{" "}
                <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  AI Agents
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Transform your business operations with intelligent automation. From customer support to inventory
                management, let AI handle the repetitive tasks while you focus on{" "}
                <span className="text-primary font-medium">growth</span>.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-4">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 px-6 sm:px-8 py-3 sm:py-4 text-base font-medium shadow-md hover:shadow-lg group"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleWatchDemo}
                disabled={showDemoMessage}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base font-medium group"
              >
                <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                {showDemoMessage ? "Opening Dashboard..." : "Watch Demo"}
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-8 sm:pt-12 space-y-3 sm:space-y-4">
              <p className="text-xs sm:text-sm text-muted-foreground">Trusted by modern teams worldwide</p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-xs sm:text-sm text-muted-foreground">
                <span className="flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1.5 text-primary" />
                  No credit card required
                </span>
                <span className="flex items-center">
                  <Shield className="w-3 h-3 mr-1.5 text-primary" />
                  Enterprise security
                </span>
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1.5 text-primary" />
                  5-minute setup
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/30 border-y border-border">
        <div className="container-padding py-12 sm:py-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-center">
                    <div className="p-2 sm:p-3 bg-primary/10 rounded-lg">
                      <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-spacing">
        <div className="container-padding">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center space-y-4 sm:space-y-6 mb-12 sm:mb-16">
              <div className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs sm:text-sm font-medium">
                Core Features
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Three Core{" "}
                <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Automations
                </span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Streamline your business with our essential automation tools designed for modern teams.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="group relative"
                >
                  <div className="card-elevated-strong h-full p-6 sm:p-8 hover:border-primary/20 transition-all duration-300">
                    <div className="space-y-4 sm:space-y-6">
                      {/* Icon and Badge */}
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                          <feature.icon className="h-6 w-6 sm:h-7 sm:w-7 text-primary group-hover:text-primary-foreground transition-colors" />
                        </div>
                        <Badge variant="outline" className="text-xs border-border bg-background">
                          {feature.stats}
                        </Badge>
                      </div>

                      {/* Content */}
                      <div className="space-y-3 sm:space-y-4">
                        <h3 className="text-lg sm:text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </div>

                      {/* Learn More Link */}
                      <Link
                        href={feature.href}
                        className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
                      >
                        Learn more
                        <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-muted/30 border-y border-border">
        <div className="container-padding section-spacing">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center space-y-4 sm:space-y-6 mb-12 sm:mb-16">
              <div className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs sm:text-sm font-medium">
                Customer Stories
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Loved by teams everywhere
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                See how businesses use AgenticPilot to streamline operations and boost productivity.
              </p>
            </div>

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="card-elevated p-6 sm:p-8 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="space-y-4 sm:space-y-6">
                    {/* Star Rating */}
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>

                    {/* Testimonial Content */}
                    <blockquote className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      "{testimonial.content}"
                    </blockquote>

                    {/* Author Info */}
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-foreground text-sm">
                          {testimonial.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing">
        <div className="container-padding">
          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Ready to{" "}
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                automate your success?
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Join thousands of businesses already using AgenticPilot to streamline their operations and boost productivity.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-4">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 px-6 sm:px-8 py-3 sm:py-4 text-base font-medium shadow-md hover:shadow-lg group"
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base font-medium"
              >
                Contact Sales
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="pt-6 sm:pt-8 text-muted-foreground">
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-sm">
                <span className="flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1.5 text-primary" />
                  No credit card required
                </span>
                <span className="flex items-center">
                  <Shield className="w-3 h-3 mr-1.5 text-primary" />
                  Enterprise security
                </span>
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1.5 text-primary" />
                  Setup in minutes
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container-padding py-12 sm:py-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              {/* Company Info */}
              <div className="space-y-4 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center space-x-2">
                  <Bot className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                  <span className="text-lg sm:text-xl font-bold text-foreground">
                    AgenticPilot
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                  The AI-powered automation platform that helps businesses scale efficiently and focus on what matters most.
                </p>
              </div>

              {/* Product Links */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Product</h4>
                <div className="space-y-2 text-sm">
                  <Link href="/dashboard/gmail" className="block text-muted-foreground hover:text-primary transition-colors">
                    Email Automation
                  </Link>
                  <Link href="/dashboard/inventory" className="block text-muted-foreground hover:text-primary transition-colors">
                    Inventory Management
                  </Link>
                  <Link href="/dashboard/instagram" className="block text-muted-foreground hover:text-primary transition-colors">
                    Social Media
                  </Link>
                  <Link href="/pricing" className="block text-muted-foreground hover:text-primary transition-colors">
                    Pricing
                  </Link>
                </div>
              </div>

              {/* Company Links */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Company</h4>
                <div className="space-y-2 text-sm">
                  <Link href="/contact" className="block text-muted-foreground hover:text-primary transition-colors">
                    Contact
                  </Link>
                  <Link href="/about" className="block text-muted-foreground hover:text-primary transition-colors">
                    About
                  </Link>
                  <Link href="/blog" className="block text-muted-foreground hover:text-primary transition-colors">
                    Blog
                  </Link>
                  <Link href="/careers" className="block text-muted-foreground hover:text-primary transition-colors">
                    Careers
                  </Link>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Connect</h4>
                <div className="space-y-2 text-sm">
                  <a href="mailto:agenticpilot.team@gmail.com" className="block text-muted-foreground hover:text-primary transition-colors">
                    agenticpilot.team@gmail.com
                  </a>
                  <div className="flex items-center space-x-4 pt-2">
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-base">
                      <span className="sr-only">Twitter</span>
                      🐦
                    </a>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-base">
                      <span className="sr-only">GitHub</span>
                      🐙
                    </a>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-base">
                      <span className="sr-only">LinkedIn</span>
                      💼
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Bottom */}
            <div className="border-t border-border pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <p className="text-sm text-muted-foreground">
                © 2024 AgenticPilot. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 sm:space-x-6 text-sm text-muted-foreground">
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
