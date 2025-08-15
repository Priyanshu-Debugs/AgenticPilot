"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"
import Link from "next/link"

interface StatsCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: LucideIcon
  trend?: number
}

export function StatsCard({ title, value, change, changeType = "neutral", icon: Icon, trend }: StatsCardProps) {
  const changeColor = {
    positive: "text-emerald-600",
    negative: "text-destructive",
    neutral: "text-muted-foreground"
  }

  return (
    <Card className="card-elevated hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className={`text-xs ${changeColor[changeType]}`}>
            {change}
          </p>
        )}
        {trend !== undefined && (
          <div className="mt-2 flex items-center space-x-2">
            <div className="flex-1 bg-muted rounded-full h-1">
              <div 
                className="bg-primary h-1 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(trend, 100)}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{trend}%</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface FeatureCardProps {
  title: string
  description: string
  icon: LucideIcon
  href?: string
  badge?: string
  isActive?: boolean
  onClick?: () => void
}

export function FeatureCard({ title, description, icon: Icon, href, badge, isActive, onClick }: FeatureCardProps) {
  const CardWrapper = href ? Link : "div"
  
  return (
    <CardWrapper href={href || ""} className={href ? "block" : ""}>
      <Card className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/20 ${
        isActive ? "ring-2 ring-primary border-primary/30" : ""
      } h-full`} onClick={onClick}>
        <CardHeader className="space-y-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              {badge && (
                <Badge className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5">
                  {badge}
                </Badge>
              )}
            </div>
            <div className="flex-1 space-y-2 min-w-0">
              <CardTitle className="text-lg sm:text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                {title}
              </CardTitle>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>
    </CardWrapper>
  )
}

interface ActionCardProps {
  title: string
  description: string
  icon: LucideIcon
  buttonText: string
  onAction: () => void
  isLoading?: boolean
  variant?: "default" | "outline" | "destructive"
}

export function ActionCard({ 
  title, 
  description, 
  icon: Icon, 
  buttonText, 
  onAction, 
  isLoading = false,
  variant = "default" 
}: ActionCardProps) {
  return (
    <Card className="card-elevated hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-muted rounded-lg">
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={onAction} 
          disabled={isLoading}
          variant={variant}
          className="w-full"
        >
          {isLoading ? "Loading..." : buttonText}
        </Button>
      </CardContent>
    </Card>
  )
}
