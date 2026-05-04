"use client"

import { useState, type MouseEvent } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { useAuth } from "@/utils/auth/AuthProvider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/shared/Navigation"
import { SpotlightCard } from "@/components/ui/card"
import { AnimatedCounter } from "@/components/ui/animations"
import {
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle,
  ChevronRight,
  Clock,
  Gauge,
  LayoutDashboard,
  Layers3,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Workflow,
  Zap,
  Mail,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react"

interface FeatureItem {
  title: string
  description: string
  href: string
  stats: string
  code: string
  signal: string
  bars: [number, number, number]
}

const features: FeatureItem[] = [
  {
    title: "Gmail AI Assistant",
    description:
      "Analyze intent, draft high-context replies, and keep support moving without losing the human tone your customers expect.",
    href: "/dashboard/gmail",
    stats: "95% accuracy",
    code: "AP-01",
    signal: "Inbox intelligence",
    bars: [72, 92, 58],
  },
  {
    title: "X/Twitter Automation",
    description:
      "Plan posts, shape threads, and keep audience engagement active from one operator-friendly workflow.",
    href: "/dashboard/twitter",
    stats: "3x growth",
    code: "AP-02",
    signal: "Audience loop",
    bars: [64, 48, 86],
  },
  {
    title: "LinkedIn Outreach",
    description:
      "Coordinate professional posts, relationship prompts, and outreach sequences built for repeated daily use.",
    href: "/dashboard/linkedin",
    stats: "5x engagement",
    code: "AP-03",
    signal: "Network cadence",
    bars: [42, 78, 68],
  },
  {
    title: "Instagram Product Studio",
    description:
      "Turn raw product shots into polished content, captions, hashtags, and scheduled campaigns with AI assistance.",
    href: "/dashboard/instagram",
    stats: "4 photo styles",
    code: "AP-04",
    signal: "Creative pipeline",
    bars: [88, 52, 74],
  },
]

const stats = [
  { value: 50, suffix: "K+", label: "Tasks automated daily", icon: Zap },
  { value: 99, suffix: ".9%", label: "Uptime target", icon: ShieldCheck },
  { value: 2, prefix: "<", suffix: "s", label: "Average AI response", icon: Clock },
  { value: 10, suffix: "K+", label: "Active operators", icon: Users },
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CEO at TechFlow",
    content: "AgenticPilot moved our support team from delayed replies to instant, context-aware responses.",
  },
  {
    name: "Marcus Rodriguez",
    role: "Operations Manager",
    content: "The cross-channel workflow is the part that stuck. Email, social, and analytics finally feel connected.",
  },
  {
    name: "Emily Watson",
    role: "Marketing Director",
    content: "The product studio cut our content production loop from hours to minutes without making it feel generic.",
  },
]

const neutralBadgeClass =
  "border-border/80 bg-muted/45 text-muted-foreground hover:bg-muted/55 hover:text-foreground"

const darkBadgeClass =
  "border-white/[0.14] bg-white/[0.06] text-white/75 hover:bg-white/[0.08] hover:text-white"

const featureIcons: Record<string, { icon: typeof Mail; color: string; bg: string }> = {
  "AP-01": { icon: Mail, color: "text-emerald-400", bg: "bg-emerald-500/15" },
  "AP-02": { icon: Twitter, color: "text-sky-400", bg: "bg-sky-500/15" },
  "AP-03": { icon: Linkedin, color: "text-blue-400", bg: "bg-blue-500/15" },
  "AP-04": { icon: Instagram, color: "text-pink-400", bg: "bg-pink-500/15" },
}

function FeatureIcon({ feature }: { feature: FeatureItem }) {
  const config = featureIcons[feature.code] || featureIcons["AP-01"]
  const IconComponent = config.icon
  return (
    <div className={`relative flex h-20 w-20 items-center justify-center rounded-xl border border-border ${config.bg}`}>
      <IconComponent className={`h-8 w-8 ${config.color}`} />
      <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
        {feature.code.split("-")[1]}
      </span>
    </div>
  )
}

function DashboardPreview({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [isOpening, setIsOpening] = useState(false)

  const handleOpenDashboard = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    setIsOpening(true)
    window.setTimeout(() => {
      window.location.assign("/dashboard")
    }, 520)
  }

  return (
    <Link
      href="/dashboard"
      onClick={handleOpenDashboard}
      className="group relative block overflow-hidden rounded-lg border border-border bg-card p-2 shadow-2xl outline-none transition duration-300 hover:-translate-y-1 hover:border-border/90 hover:shadow-primary/10 focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="ml-3 text-xs text-muted-foreground">agenticpilot.app/dashboard</span>
        </div>
        <span className="rounded-full border border-border bg-muted/45 px-2 py-0.5 text-[10px] font-medium text-muted-foreground transition group-hover:bg-muted/60">
          Click to open
        </span>
      </div>

      <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-zinc-950">
        {isAuthenticated ? (
          <iframe
            src="/dashboard"
            title="Live AgenticPilot dashboard preview"
            className="pointer-events-none h-[150%] w-[150%] origin-top-left scale-[0.67] border-0 bg-background"
            tabIndex={-1}
          />
        ) : (
          <div className="h-full bg-background p-4 text-foreground">
            <div className="mb-4 flex items-center justify-between rounded-lg border border-border bg-card p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <LayoutDashboard className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Command center</p>
                  <p className="text-xs text-muted-foreground">Live dashboard appears after sign in</p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-500">Ready</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Processed", value: "1,248", icon: Workflow },
                { label: "Success", value: "98.4%", icon: Gauge },
                { label: "Agents", value: "4", icon: Layers3 },
                { label: "Queue", value: "12", icon: Zap },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-border bg-card p-3">
                  <item.icon className="mb-3 h-4 w-4 text-primary" />
                  <p className="text-lg font-bold">{item.value}</p>
                  <p className="text-[10px] text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-[1.1fr_0.9fr] gap-2">
              <div className="rounded-lg border border-border bg-card p-3">
                <div className="mb-3 flex items-center justify-between text-xs">
                  <span className="font-medium">Automation health</span>
                  <span className="text-muted-foreground">83%</span>
                </div>
                <div className="space-y-2">
                  {[74, 92, 58].map((width, index) => (
                    <div key={index} className="h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary/70" style={{ width: `${width}%` }} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-border bg-card p-3">
                <p className="mb-3 text-xs font-medium">Recent activity</p>
                <div className="space-y-2">
                  {["Gmail analyzed", "Caption drafted", "Thread queued"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
      </div>

      <AnimatePresence>
        {isOpening && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <motion.div
              className="h-1 w-32 overflow-hidden rounded-full bg-muted"
              initial={{ width: 32 }}
              animate={{ width: 180 }}
              transition={{ duration: 0.42, ease: "easeOut" }}
            >
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ x: "-100%" }}
                animate={{ x: "110%" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Link>
  )
}

export default function LandingPage() {
  const { user, signOut } = useAuth()

  const navUser = user
    ? {
        name: user.full_name || user.email?.split("@")[0] || "User",
        email: user.email || "",
        avatar: user.user_metadata?.avatar_url || "",
      }
    : undefined

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation
        isAuthenticated={!!user}
        user={navUser}
        onSignIn={() => window.location.assign("/auth/signin")}
        onSignUp={() => window.location.assign("/auth/signup")}
        onSignOut={() => {
          void signOut()
        }}
      />

      <section className="border-y border-border/70 bg-muted/20">
        <div className="container-padding mx-auto max-w-6xl py-12 sm:py-16">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-border/70 bg-card/70 p-5 shadow-sm">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="text-2xl font-bold tracking-tight sm:text-3xl">
                  <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing overflow-hidden">
        <div className="container-padding mx-auto max-w-6xl">
          <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <motion.div
              className="space-y-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="outline" className={neutralBadgeClass}>
                <Bot className="mr-1.5 h-3.5 w-3.5" />
                Unified cockpit
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                A dashboard that feels built for operators.
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                The main workspace connects automation status, Gmail activity, channel setup, and performance signals so the product feels like one system.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  "Real Gmail activity summary",
                  "Direct routes to every agent",
                  "Clear setup states",
                  "Responsive command layout",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 rounded-lg border border-border bg-card p-3 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65 }}
            >
              <DashboardPreview isAuthenticated={!!user} />
            </motion.div>
          </div>
        </div>
      </section>

      <section id="features" className="section-spacing bg-muted/20">
        <div className="container-padding mx-auto max-w-6xl">
          <motion.div
            className="mx-auto mb-12 max-w-3xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className={`${neutralBadgeClass} mb-4`}>Core automations</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Four agent surfaces, one connected experience.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Each automation page is reachable from the dashboard and designed around the actual work: connect, configure, monitor, and improve.
            </p>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-2">
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45 }}
              >
                <SpotlightCard className="rounded-lg">
                  <div className="flex h-full flex-col">
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <FeatureIcon feature={feature} />
                      <Badge variant="outline" className={neutralBadgeClass}>{feature.stats}</Badge>
                    </div>
                    <h3 className="text-xl font-semibold tracking-tight">{feature.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {feature.description}
                    </p>
                    <Link
                      href={feature.href}
                      className="mt-6 inline-flex w-fit items-center text-sm font-semibold text-primary"
                    >
                      Configure agent
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-padding mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-4">
              <Badge variant="outline" className={`${neutralBadgeClass} mb-4`}>
                <BarChart3 className="mr-1.5 h-3.5 w-3.5" />
                Operating rhythm
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Premium where it matters: clarity, speed, and fewer broken paths.
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground">
                The refreshed surfaces put the route structure and the product story in the same direction: sign in, land on the dashboard, choose an agent, and act.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Authenticate", value: "Direct dashboard redirect" },
                { label: "Monitor", value: "Live Gmail stats endpoint" },
                { label: "Operate", value: "Agent routes linked together" },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-border bg-card p-5">
                  <p className="text-sm font-semibold text-primary">{item.label}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-spacing border-y border-border/70 bg-muted/20">
        <div className="container-padding mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <Badge variant="outline" className={`${neutralBadgeClass} mb-4`}>
                <Star className="mr-1.5 h-3.5 w-3.5 fill-current" />
                Customer signal
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Built for teams that repeat the work daily.</h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Clean workflows, practical controls, and polished motion only where it helps the interface feel responsive.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="rounded-lg border border-border bg-card p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-1">
                  {[...Array(5)].map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-foreground">&quot;{testimonial.content}&quot;</p>
                <div className="mt-6 border-t border-border pt-4">
                  <p className="text-sm font-semibold">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-padding mx-auto max-w-5xl text-center">
          <Badge variant="outline" className={`${neutralBadgeClass} mb-5`}>Ready when you are</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Start with one agent, then connect the whole workflow.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Create an account, connect the channels you need, and use the dashboard as the control surface for your automation stack.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" variant="glow" asChild className="h-12 px-7">
              <Link href="/auth/signup">
                Start free
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 px-7">
              <Link href="/pricing">View pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-muted/30">
        <div className="container-padding mx-auto max-w-6xl py-10">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-3">
              <Link href="/" className="flex items-center gap-2">
                <Bot className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">AgenticPilot</span>
              </Link>
              <p className="text-sm leading-relaxed text-muted-foreground">
                AI-powered automation for customer support, social operations, and content workflows.
              </p>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold">Product</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <Link href="/dashboard/gmail" className="block hover:text-primary">Gmail Automation</Link>
                <Link href="/dashboard/twitter" className="block hover:text-primary">X/Twitter Automation</Link>
                <Link href="/dashboard/linkedin" className="block hover:text-primary">LinkedIn Automation</Link>
                <Link href="/dashboard/instagram" className="block hover:text-primary">Instagram Studio</Link>
              </div>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold">Company</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <Link href="/about" className="block hover:text-primary">About</Link>
                <Link href="/blog" className="block hover:text-primary">Blog</Link>
                <Link href="/pricing" className="block hover:text-primary">Pricing</Link>
                <Link href="/contact" className="block hover:text-primary">Contact</Link>
              </div>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold">Connect</h4>
              <a href="mailto:agenticpilot.team@gmail.com" className="text-sm text-muted-foreground hover:text-primary">
                agenticpilot.team@gmail.com
              </a>
            </div>
          </div>
          <div className="mt-8 flex flex-col justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
            <p>Copyright 2026 AgenticPilot. All rights reserved.</p>
            <div className="flex gap-5">
              <Link href="/privacy" className="hover:text-primary">Privacy</Link>
              <Link href="/terms" className="hover:text-primary">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
