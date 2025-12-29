import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  "bg-card text-card-foreground rounded-xl transition-all duration-300",
  {
    variants: {
      variant: {
        default: "border border-border shadow-sm hover:shadow-md",
        elevated: "border border-border shadow-lg hover:shadow-xl hover:-translate-y-1",
        glow: "border border-border shadow-lg hover:shadow-primary/20 hover:border-primary/50 hover:-translate-y-1",
        glass: "bg-card/80 backdrop-blur-xl border border-border/50 shadow-lg",
        interactive: "border border-border shadow-md hover:shadow-xl hover:-translate-y-2 hover:border-primary/30 cursor-pointer",
        gradient: "border border-border bg-gradient-to-br from-card via-card to-primary/5 shadow-lg hover:shadow-xl",
        outline: "border-2 border-dashed border-border bg-transparent hover:border-primary/50 hover:bg-primary/5",
      },
      padding: {
        none: "p-0",
        sm: "p-3 sm:p-4",
        default: "p-4 sm:p-6",
        lg: "p-6 sm:p-8",
      }
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
)

interface CardProps
  extends React.ComponentProps<"div">,
  VariantProps<typeof cardVariants> { }

function Card({ className, variant, padding, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant, padding, className }))}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "flex flex-col space-y-1.5 pb-4 sm:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("text-lg sm:text-xl font-semibold leading-tight tracking-tight", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm sm:text-base text-muted-foreground leading-relaxed", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "flex items-center justify-end space-x-2",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("pt-0", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center pt-4 sm:pt-6 border-t border-border", className)}
      {...props}
    />
  )
}

// New: Glow Card with animated border
function GlowCard({
  className,
  children,
  glowColor = "primary",
  ...props
}: React.ComponentProps<"div"> & { glowColor?: "primary" | "blue" | "purple" | "orange" }) {
  const glowColors = {
    primary: "from-primary/50 via-primary/20 to-primary/50",
    blue: "from-blue-500/50 via-blue-500/20 to-blue-500/50",
    purple: "from-purple-500/50 via-purple-500/20 to-purple-500/50",
    orange: "from-orange-500/50 via-orange-500/20 to-orange-500/50",
  }

  return (
    <div className="relative group h-full">
      <div
        className={cn(
          "absolute -inset-0.5 rounded-xl bg-gradient-to-r opacity-0 blur-md transition-all duration-500 group-hover:opacity-75",
          glowColors[glowColor]
        )}
      />
      <div
        data-slot="glow-card"
        className={cn(
          "relative h-full bg-card text-card-foreground border border-border rounded-xl p-4 sm:p-6 shadow-lg transition-all duration-300",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  )
}

// New: Bento Card for grid layouts
function BentoCard({
  className,
  children,
  span = 1,
  ...props
}: React.ComponentProps<"div"> & { span?: 1 | 2 }) {
  return (
    <div
      data-slot="bento-card"
      className={cn(
        "relative overflow-hidden bg-card text-card-foreground border border-border rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group",
        span === 2 && "md:col-span-2",
        className
      )}
      {...props}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  GlowCard,
  BentoCard,
  cardVariants,
}
