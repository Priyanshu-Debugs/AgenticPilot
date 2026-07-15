"use client"

import { useEffect, useRef } from "react"
import { animate, createTimeline, stagger } from "animejs"
import {
  Bot,
  CheckCircle2,
  Instagram,
  Linkedin,
  Mail,
  Sparkles,
  Twitter,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AgentRow {
  label: string
  detail: string
  metric: string
  icon: LucideIcon
  color: string
}

const agents: AgentRow[] = [
  {
    label: "Gmail",
    detail: "Context-aware replies",
    metric: "1.8s avg",
    icon: Mail,
    color: "text-emerald-400",
  },
  {
    label: "X/Twitter",
    detail: "Threads and engagement",
    metric: "+24%",
    icon: Twitter,
    color: "text-sky-400",
  },
  {
    label: "LinkedIn",
    detail: "Professional outreach",
    metric: "5.2%",
    icon: Linkedin,
    color: "text-blue-400",
  },
  {
    label: "Instagram",
    detail: "AI product studio",
    metric: "4 styles",
    icon: Instagram,
    color: "text-pink-400",
  },
]

export function AnimeCommandDeck({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    const meter = root?.querySelector("[data-agent-meter]")
    if (!root || !meter) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduceMotion) return

    const rows = root.querySelectorAll("[data-agent-row]")
    const rails = root.querySelectorAll("[data-agent-rail]")
    const pips = root.querySelectorAll("[data-agent-pip]")

    const intro = createTimeline({
      defaults: {
        ease: "outCubic",
      },
    })

    intro
      .add(root, { opacity: [0, 1], y: [18, 0], duration: 600 })
      .add(rows, { opacity: [0, 1], y: [16, 0], duration: 520, delay: stagger(70) }, "-=260")
      .add(meter, { width: ["28%", "83%"], duration: 900 }, "-=420")

    const railMotion = animate(rails, {
      scaleX: [0.22, 1],
      transformOrigin: "0% 50%",
      delay: stagger(160),
      duration: 1400,
      loop: true,
      alternate: true,
      ease: "inOutSine",
    })

    const pipMotion = animate(pips, {
      x: ["-8%", "108%"],
      opacity: [0, 1, 0],
      delay: stagger(210),
      duration: 2200,
      loop: true,
      ease: "inOutQuad",
    })

    return () => {
      intro.revert()
      railMotion.revert()
      pipMotion.revert()
    }
  }, [])

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/[0.12] bg-zinc-950/75 p-4 text-white shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-5",
        className
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
            <Bot className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold">AgenticPilot Command</p>
            <p className="text-xs text-white/55">Live automation queue</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
          <CheckCircle2 className="size-3.5" />
          Active
        </div>
      </div>

      <div className="py-4">
        <div className="mb-2 flex items-center justify-between text-xs text-white/55">
          <span>Workflow load</span>
          <span>83%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            data-agent-meter
            className="h-full rounded-full bg-gradient-to-r from-primary via-emerald-300 to-cyan-300"
            style={{ width: "28%" }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-y-3">
        {agents.map((agent) => {
          const Icon = agent.icon

          return (
            <div
              key={agent.label}
              data-agent-row
              className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-3"
            >
              <div className="flex size-9 items-center justify-center rounded-md bg-white/[0.08]">
                <Icon className={cn("size-4", agent.color)} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-medium">{agent.label}</p>
                  <p className="text-xs font-semibold text-white">{agent.metric}</p>
                </div>
                <p className="truncate text-xs text-white/50">{agent.detail}</p>
                <div className="relative mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                  <div data-agent-rail className="h-full rounded-full bg-primary/70" />
                  <span data-agent-pip className="absolute left-0 top-0 h-full w-8 rounded-full bg-white/80" />
                </div>
              </div>
              <Sparkles className="size-4 text-primary/80" />
            </div>
          )
        })}
      </div>
    </div>
  )
}
