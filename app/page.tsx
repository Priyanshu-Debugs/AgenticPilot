"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/shared/Navigation"
import { FeatureCard } from "@/components/shared/Cards"
import { GlowCard, BentoCard, SpotlightCard } from "@/components/ui/card"
import { AnimatedCounter } from "@/components/ui/animations"
import { InfiniteGrid } from "@/components/ui/infinite-grid"
import { cn } from "@/lib/utils"
import {
  ArrowRight,
  Mail,
  Twitter,
  Linkedin,
  Instagram,
  Bot,
  Star,
  CheckCircle,
  Sparkles,
  Zap,
  Users,
  ShieldCheck,
  Clock,
  Play,
  ChevronRight,
  Rocket,
  TrendingUp,
  Settings
} from "lucide-react"
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
      title: "X/Twitter Automation",
      description: "AI-powered tweet scheduling, thread generation, and smart engagement automation that grows your audience.",
      icon: Twitter,
      href: "/dashboard/twitter",
      stats: "3x follower growth"
    },
    {
      title: "LinkedIn Automation",
      description: "Automated professional networking, AI-crafted posts, and intelligent connection management for business growth.",
      icon: Linkedin,
      href: "/dashboard/linkedin",
      stats: "5x engagement boost"
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
      content: "The Twitter automation grew our following by 300% and our LinkedIn posts now consistently reach 10K+ impressions.",
      avatar: "/placeholder-user.jpg",
      company: "RetailCorp"
    },
    {
      name: "Emily Watson",
      role: "Marketing Director",
      content: "Our social media engagement increased 300% after implementing AgenticPilot's automation.",
      avatar: "/placeholder-user.jpg",
      company: "BrandStudio"
    },
    {
      name: "David Kim",
      role: "Founder",
      content: "I manage 5 different brands. AgenticPilot saves me over 20 hours a week by automating content scheduling effortlessly.",
      avatar: "/placeholder-user.jpg",
      company: "Nexus Brands"
    },
    {
      name: "Olivia Martinez",
      role: "VP of Sales",
      content: "Integrating autonomous email replies natively into our pipeline generated a 40% higher lead retention rate within a month.",
      avatar: "/placeholder-user.jpg",
      company: "Elevate AI"
    },
    {
      name: "James Wilson",
      role: "Lead Growth Engineer",
      content: "The ability to customize ML models for predictive engagement times is an absolute game-changer. Easily the best investment.",
      avatar: "/placeholder-user.jpg",
      company: "GrowthX"
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
                <Sparkles className="w-4 h-4 mr-2 text-primary" />
              </motion.div>
              AI-Powered Business Automation
            </motion.div>

            {/* Main Heading with Stagger Animation */}
            <motion.div
              className="space-y-4 sm:space-y-6"
              initial={{ filter: "blur(10px)", opacity: 0, y: 30 }}
              animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight">
                Automate Your Business with{" "}
                <span className="text-gradient-static">
                  AI Agents
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Transform your business operations with intelligent automation. From customer support to social media
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
                <Rocket className="mr-2 h-5 w-5" />
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="glass"
                onClick={handleWatchDemo}
                disabled={showDemoMessage}
                className="w-full sm:w-auto px-8 py-6 text-base font-medium group"
              >
                <Play className="mr-2 h-5 w-5 fill-current" />
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
                  <CheckCircle className="w-4 h-4 mr-1.5 text-primary" />
                  No credit card required
                </span>
                <span className="flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-1.5 text-primary" />
                  Enterprise security
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1.5 text-primary" />
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
                      <stat.icon className="w-7 h-7 text-primary" />
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


      {/* Product Showcase Section - Interactive Dashboard Mockup */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background py-20 lg:py-32">
        <div className="container-padding">
          <motion.div
            className="space-y-4 text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs sm:text-sm font-medium mx-auto">
              <Bot className="w-4 h-4 mr-2 text-primary" />
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

          <motion.div
            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative lg:mx-auto max-w-6xl"
          >
            <div className="relative rounded-xl sm:rounded-2xl bg-gray-100/5 dark:bg-zinc-900/40 p-2 sm:p-4 border-2 border-border/50 shadow-2xl backdrop-blur-sm overflow-hidden">
              <div className="absolute top-4 left-4 flex space-x-2 z-20">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <Image
                src="/ai-automation-hero.jpg"
                alt="AI-Powered Automation"
                height={720}
                width={1400}
                className="rounded-lg object-cover w-full h-auto mt-4"
                draggable={false}
              />
              
              {/* Floating UI Elements */}
              <motion.div 
                className="absolute -right-4 lg:-right-8 top-1/4 bg-card border border-border shadow-2xl rounded-xl p-4 hidden md:flex items-center space-x-4"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <CheckCircle className="text-primary w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Campaign Active</div>
                  <div className="text-xs text-muted-foreground">3 new tasks completed</div>
                </div>
              </motion.div>
              <motion.div 
                className="absolute -left-4 lg:-left-8 bottom-1/4 bg-card border border-border shadow-2xl rounded-xl p-4 hidden md:flex items-center space-x-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <TrendingUp className="text-accent w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Growth Spike</div>
                  <div className="text-xs text-muted-foreground">+24% engagement</div>
                </div>
              </motion.div>
            </div>
            
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 max-w-full -z-10 bg-gradient-to-r from-primary/30 to-accent/30 blur-[100px] opacity-40 mix-blend-screen scale-110"></div>
          </motion.div>
        </div>
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
                Four Core{" "}
                <span className="text-gradient-static">
                  Automations
                </span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Streamline your business with our essential automation tools designed for modern teams.
              </p>
            </motion.div>


            {/* Symmetric Features Grid Layout */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
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
                  className="group h-full"
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <SpotlightCard className="h-full">
                    <div className="flex flex-col h-full">
                      {/* Icon and Badge Container */}
                      <div className="flex flex-col mb-4 w-full">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-500">
                            <feature.icon className="h-7 w-7 text-primary group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <Badge className="text-xs bg-primary/10 text-primary border-primary/20 font-medium">
                            {feature.stats}
                          </Badge>
                        </div>
                      </div>

                      {/* Content Container */}
                      <div className="flex flex-col flex-1 w-full">
                        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                          {feature.title}
                        </h3>
                        <p className="text-base text-muted-foreground leading-relaxed mb-6 flex-1">
                          {feature.description}
                        </p>

                        {/* Learn More Link */}
                        <div className="mt-auto">
                          <Link
                            href={feature.href}
                            className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors group/link"
                          >
                            Explore capability
                            <ChevronRight className="ml-1 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </SpotlightCard>
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
                <Star className="w-4 h-4 mr-2 text-yellow-500 fill-current" />
                Customer Stories
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Loved by teams everywhere
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                See how businesses use AgenticPilot to streamline operations and boost productivity.
              </p>
            </motion.div>

            {/* Infinite Auto-Scrolling Testimonials */}
            <div className="relative flex overflow-hidden w-full group py-8 -mx-4 sm:-mx-0 px-4 sm:px-0">
              <div className="absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-background to-transparent z-10 hidden sm:block pointer-events-none"></div>
              <div className="absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-background to-transparent z-10 hidden sm:block pointer-events-none"></div>
              
              <div className="flex w-max animate-marquee hover:[animation-play-state:paused] space-x-6">
                {[1, 2].map((groupIndex) => (
                  <div key={groupIndex} className="flex space-x-6">
                    {testimonials.map((testimonial, index) => (
                      <div
                        key={index}
                        className="w-[300px] sm:w-[400px] shrink-0"
                      >
                        <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-3xl p-6 sm:p-8 h-full shadow-lg hover:shadow-xl hover:border-primary/50 transition-all duration-300 select-none">
                          <div className="space-y-6">
                            {/* Star Rating */}
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                              ))}
                            </div>

                            {/* Testimonial Content */}
                            <blockquote className="text-sm sm:text-base text-foreground leading-relaxed font-medium">
                              "{testimonial.content}"
                            </blockquote>

                            {/* Author Info */}
                            <div className="flex items-center space-x-3 pt-4 border-t border-border/30">
                              <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/40 rounded-full flex items-center justify-center">
                                <span className="text-sm font-bold text-primary">
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
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
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
                <Rocket className="mr-2 h-5 w-5" />
                Start Your Free Trial
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
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
                  <CheckCircle className="w-4 h-4 mr-1.5 text-primary" />
                  No credit card required
                </span>
                <span className="flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-1.5 text-primary" />
                  Enterprise security
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1.5 text-primary" />
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
                  <Link href="/dashboard/twitter" className="block text-muted-foreground hover:text-primary transition-colors">
                    X/Twitter Automation
                  </Link>
                  <Link href="/dashboard/linkedin" className="block text-muted-foreground hover:text-primary transition-colors">
                    LinkedIn Automation
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
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Connect</h4>
                <div className="space-y-2 text-sm">
                  <a href="mailto:agenticpilot.team@gmail.com" className="block text-muted-foreground hover:text-primary transition-colors">
                    agenticpilot.team@gmail.com
                  </a>
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
