"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/shared/Navigation"
import { FeatureCard } from "@/components/shared/Cards"
import { GlowCard, BentoCard } from "@/components/ui/card"
import { AnimatedCounter } from "@/components/ui/animations"
import { InfiniteGrid } from "@/components/ui/infinite-grid"
import { ContainerScroll } from "@/components/ui/container-scroll-animation"
// Phosphor Icons - More premium and unique than Lucide
import {
  ArrowRight,
  Envelope,
  Package,
  InstagramLogo,
  Robot,
  Star,
  CheckCircle,
  Sparkle,
  Lightning,
  Users,
  ShieldCheck,
  Clock,
  Play,
  CaretRight,
  RocketLaunch,
  ChartLineUp,
  Gear
} from "@phosphor-icons/react"
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
      icon: Envelope,
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
      icon: InstagramLogo,
      href: "/dashboard/instagram",
      stats: "3x engagement boost"
    }
  ]

  const stats = [
    { value: "50K+", label: "Tasks Automated Daily", icon: Lightning },
    { value: "99.9%", label: "Uptime Guarantee", icon: ShieldCheck },
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

      {/* Hero Section - With Infinite Grid Background */}
      <InfiniteGrid className="min-h-screen" gridSize={60}>
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none z-0"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(62,207,142,0.1),transparent_60%)] pointer-events-none z-0"></div>

        {/* Decorative Blur Spheres */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <motion.div
            className="absolute right-[-10%] top-[-10%] w-[40%] h-[40%] rounded-full bg-orange-500/20 dark:bg-orange-600/10 blur-[120px]"
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute left-[-10%] bottom-[10%] w-[35%] h-[35%] rounded-full bg-blue-500/20 dark:bg-blue-600/10 blur-[100px]"
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-[20%] bottom-[20%] w-[25%] h-[25%] rounded-full bg-primary/20 blur-[80px]"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative container-padding section-spacing">
          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
            {/* Animated Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm px-4 py-1.5 text-xs sm:text-sm font-medium shadow-lg shadow-primary/10"
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkle weight="fill" className="w-4 h-4 mr-2 text-primary" />
              </motion.div>
              AI-Powered Business Automation
            </motion.div>

            {/* Main Heading with Stagger Animation */}
            <motion.div
              className="space-y-4 sm:space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                Automate Your Business with{" "}
                <span className="text-gradient-static">
                  AI Agents
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Transform your business operations with intelligent automation. From customer support to inventory
                management, let AI handle the repetitive tasks while you focus on{" "}
                <span className="text-primary font-semibold">growth</span>.
              </p>
            </motion.div>

            {/* CTA Buttons with Animation */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button
                size="lg"
                variant="glow"
                onClick={handleGetStarted}
                className="w-full sm:w-auto px-8 py-6 text-base font-semibold group"
              >
                <RocketLaunch weight="fill" className="mr-2 h-5 w-5" />
                Start Free Trial
                <ArrowRight weight="bold" className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="glass"
                onClick={handleWatchDemo}
                disabled={showDemoMessage}
                className="w-full sm:w-auto px-8 py-6 text-base font-medium group"
              >
                <Play weight="fill" className="mr-2 h-5 w-5" />
                {showDemoMessage ? "Opening Dashboard..." : "Watch Demo"}
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="pt-8 sm:pt-12 space-y-3 sm:space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <p className="text-xs sm:text-sm text-muted-foreground">Trusted by modern teams worldwide</p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-xs sm:text-sm text-muted-foreground">
                <span className="flex items-center">
                  <CheckCircle weight="fill" className="w-4 h-4 mr-1.5 text-primary" />
                  No credit card required
                </span>
                <span className="flex items-center">
                  <ShieldCheck weight="fill" className="w-4 h-4 mr-1.5 text-primary" />
                  Enterprise security
                </span>
                <span className="flex items-center">
                  <Clock weight="fill" className="w-4 h-4 mr-1.5 text-primary" />
                  5-minute setup
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </InfiniteGrid>


      {/* Stats Section with Animated Counters */}
      <section className="relative border-y border-border/50 overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5"></div>

        <div className="container-padding py-16 sm:py-20 relative">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center space-y-3 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all cursor-default"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ scale: 1.03, y: -5 }}
                >
                  <div className="flex items-center justify-center">
                    <div className="p-4 bg-gradient-to-br from-primary/20 to-accent/10 rounded-2xl">
                      <stat.icon weight="fill" className="w-7 h-7 text-primary" />
                    </div>
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>


      {/* Product Showcase Section with 3D Scroll Animation */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background">
        <ContainerScroll
          titleComponent={
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs sm:text-sm font-medium mx-auto">
                <Robot weight="fill" className="w-4 h-4 mr-2 text-primary" />
                AI-Powered Technology
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                AI-Powered <br />
                <span className="text-gradient-static">
                  Automation
                </span>
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                Reducing Costs & Boosting Productivity with intelligent automation that works around the clock.
              </p>
            </motion.div>
          }
        >
          <Image
            src="/ai-automation-hero.jpg"
            alt="AI-Powered Automation"
            height={720}
            width={1400}
            className="mx-auto rounded-2xl object-cover h-full object-center"
            draggable={false}
          />
        </ContainerScroll>
      </section>


      {/* Features Section */}
      <section id="features" className="section-spacing">
        <div className="container-padding">
          <div className="max-w-6xl mx-auto">
            {/* Section Header with Animation */}
            <motion.div
              className="text-center space-y-4 sm:space-y-6 mb-12 sm:mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs sm:text-sm font-medium">
                Core Features
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Three Core{" "}
                <span className="text-gradient-static">
                  Automations
                </span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Streamline your business with our essential automation tools designed for modern teams.
              </p>
            </motion.div>


            {/* Features Grid with Stagger Animation */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.15 }
                }
              }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="group relative h-full"
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <GlowCard className="h-full hover:border-primary/30">
                    <div className="flex flex-col h-full space-y-4 sm:space-y-6">
                      {/* Icon and Badge */}
                      <div className="flex items-center justify-between">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center group-hover:from-primary group-hover:to-primary group-hover:scale-110 transition-all duration-300">
                          <feature.icon weight="duotone" className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
                        </div>
                        <Badge className="text-xs bg-primary/10 text-primary border-0 font-medium">
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

                      {/* Learn More Link - pushed to bottom */}
                      <div className="mt-auto pt-2">
                        <Link
                          href={feature.href}
                          className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors group/link"
                        >
                          Learn more
                          <CaretRight weight="bold" className="ml-1 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </GlowCard>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </div>
      </section>


      {/* Testimonials Section */}
      <section className="relative overflow-hidden">
        {/* Subtle gradient background instead of solid grey */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent"></div>

        <div className="container-padding section-spacing relative">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <motion.div
              className="text-center space-y-4 sm:space-y-6 mb-12 sm:mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs sm:text-sm font-medium">
                <Star weight="fill" className="w-4 h-4 mr-2 text-yellow-500" />
                Customer Stories
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Loved by teams everywhere
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                See how businesses use AgenticPilot to streamline operations and boost productivity.
              </p>
            </motion.div>

            {/* Testimonials Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.15 }
                }
              }}
            >
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="group"
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 sm:p-8 h-full shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-300">
                    <div className="space-y-4 sm:space-y-6">
                      {/* Star Rating with Animation */}
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 * i, duration: 0.3 }}
                          >
                            <Star weight="fill" className="w-5 h-5 text-yellow-400" />
                          </motion.div>
                        ))}
                      </div>

                      {/* Testimonial Content */}
                      <blockquote className="text-sm sm:text-base text-muted-foreground leading-relaxed italic">
                        "{testimonial.content}"
                      </blockquote>

                      {/* Author Info */}
                      <div className="flex items-center space-x-3 pt-4 border-t border-border/50">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <span className="text-sm font-semibold text-primary">
                            {testimonial.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-foreground text-sm">
                            {testimonial.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {testimonial.role} at {testimonial.company}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="section-spacing relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"></div>
        <motion.div
          className="absolute top-10 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl"
          animate={{ opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        <div className="container-padding relative">
          <motion.div
            className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Ready to{" "}
              <span className="text-gradient-static">
                automate your success?
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Join thousands of businesses already using AgenticPilot to streamline their operations and boost productivity.
            </p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button
                size="lg"
                variant="glow"
                onClick={handleGetStarted}
                className="w-full sm:w-auto px-8 py-6 text-base font-semibold group"
              >
                <RocketLaunch weight="fill" className="mr-2 h-5 w-5" />
                Start Your Free Trial
                <ArrowRight weight="bold" className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="glass"
                className="w-full sm:w-auto px-8 py-6 text-base font-medium"
              >
                Contact Sales
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              className="pt-6 sm:pt-8 text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-sm">
                <span className="flex items-center">
                  <CheckCircle weight="fill" className="w-4 h-4 mr-1.5 text-primary" />
                  No credit card required
                </span>
                <span className="flex items-center">
                  <ShieldCheck weight="fill" className="w-4 h-4 mr-1.5 text-primary" />
                  Enterprise security
                </span>
                <span className="flex items-center">
                  <Clock weight="fill" className="w-4 h-4 mr-1.5 text-primary" />
                  Setup in minutes
                </span>
              </div>

            </motion.div>
          </motion.div>
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
                  <Robot className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
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
