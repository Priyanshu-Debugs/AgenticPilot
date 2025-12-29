"use client"

import { motion, Variants, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"
import React from "react"

// Fade in from bottom animation
export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
}

// Fade in from left
export const fadeInLeft: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
}

// Fade in from right
export const fadeInRight: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
}

// Scale up animation
export const scaleUp: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.4, ease: "easeOut" }
    }
}

// Stagger container for children
export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
}

// Stagger item for use with staggerContainer
export const staggerItem: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" }
    }
}

// Animated container with viewport trigger
interface AnimatedDivProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode
    className?: string
    delay?: number
    animation?: "fadeInUp" | "fadeInLeft" | "fadeInRight" | "scaleUp"
}

const animations = {
    fadeInUp,
    fadeInLeft,
    fadeInRight,
    scaleUp
}

export function AnimatedDiv({
    children,
    className,
    delay = 0,
    animation = "fadeInUp",
    ...props
}: AnimatedDivProps) {
    const selectedAnimation = animations[animation]

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
                hidden: selectedAnimation.hidden,
                visible: {
                    ...selectedAnimation.visible,
                    transition: {
                        ...(selectedAnimation.visible as any).transition,
                        delay
                    }
                }
            }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    )
}

// Stagger wrapper for lists
interface StaggerWrapperProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode
    className?: string
    staggerDelay?: number
}

export function StaggerWrapper({
    children,
    className,
    staggerDelay = 0.1,
    ...props
}: StaggerWrapperProps) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: staggerDelay,
                        delayChildren: 0.1
                    }
                }
            }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    )
}

// Stagger item to use inside StaggerWrapper
interface StaggerItemProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode
    className?: string
}

export function StaggerItem({ children, className, ...props }: StaggerItemProps) {
    return (
        <motion.div
            variants={staggerItem}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    )
}

// Hover scale effect
interface HoverScaleProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode
    className?: string
    scale?: number
}

export function HoverScale({
    children,
    className,
    scale = 1.02,
    ...props
}: HoverScaleProps) {
    return (
        <motion.div
            whileHover={{ scale }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    )
}

// Animated counter for stats
interface AnimatedCounterProps {
    value: number
    duration?: number
    suffix?: string
    prefix?: string
    className?: string
}

export function AnimatedCounter({
    value,
    duration = 2,
    suffix = "",
    prefix = "",
    className
}: AnimatedCounterProps) {
    const [count, setCount] = React.useState(0)
    const [isInView, setIsInView] = React.useState(false)
    const ref = React.useRef<HTMLSpanElement>(null)

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isInView) {
                    setIsInView(true)
                }
            },
            { threshold: 0.5 }
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => observer.disconnect()
    }, [isInView])

    React.useEffect(() => {
        if (!isInView) return

        let startTime: number
        let animationFrame: number

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)

            // Easing function (ease out)
            const easeOut = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(easeOut * value))

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate)
            } else {
                setCount(value)
            }
        }

        animationFrame = requestAnimationFrame(animate)

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame)
            }
        }
    }, [value, duration, isInView])

    return (
        <span ref={ref} className={className}>
            {prefix}{count.toLocaleString()}{suffix}
        </span>
    )
}

// Glow effect wrapper
interface GlowWrapperProps {
    children: React.ReactNode
    className?: string
    glowColor?: string
}

export function GlowWrapper({
    children,
    className,
    glowColor = "rgba(62, 207, 142, 0.3)"
}: GlowWrapperProps) {
    return (
        <motion.div
            className={cn("relative group", className)}
            whileHover="hover"
        >
            <motion.div
                className="absolute -inset-0.5 rounded-xl opacity-0 blur-md transition-opacity group-hover:opacity-100"
                style={{ background: glowColor }}
                variants={{
                    hover: { opacity: 0.6, scale: 1.02 }
                }}
            />
            <div className="relative">
                {children}
            </div>
        </motion.div>
    )
}

// Shimmer/shine effect for buttons
export function ShimmerButton({
    children,
    className,
    ...props
}: HTMLMotionProps<"button"> & { children: React.ReactNode }) {
    return (
        <motion.button
            className={cn(
                "relative overflow-hidden",
                className
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            {...props}
        >
            <span className="relative z-10">{children}</span>
            <motion.div
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                    repeat: Infinity,
                    repeatDelay: 3,
                    duration: 1.5,
                    ease: "easeInOut"
                }}
            />
        </motion.button>
    )
}

// Pulse animation for badges
export function PulseBadge({
    children,
    className
}: {
    children: React.ReactNode
    className?: string
}) {
    return (
        <motion.div
            className={cn("relative inline-flex", className)}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut"
            }}
        >
            {children}
        </motion.div>
    )
}

// Floating animation (for hero icons)
interface FloatingProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode
    className?: string
    duration?: number
    distance?: number
}

export function Floating({
    children,
    className,
    duration = 3,
    distance = 10,
    ...props
}: FloatingProps) {
    return (
        <motion.div
            className={className}
            animate={{
                y: [-distance, distance, -distance]
            }}
            transition={{
                repeat: Infinity,
                duration,
                ease: "easeInOut"
            }}
            {...props}
        >
            {children}
        </motion.div>
    )
}
