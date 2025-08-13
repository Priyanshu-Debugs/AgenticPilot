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
    positive: "text-green-600 dark:text-green-400",
    negative: "text-red-600 dark:text-red-400",
    neutral: "text-gray-500 dark:text-gray-400"
  }

  return (
    <Card className="border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
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
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
              <div 
                className="bg-gray-600 dark:bg-gray-400 h-1 rounded-full transition-all duration-300" 
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
      <Card className={`group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
        isActive ? "ring-2 ring-gray-400 bg-gray-50 dark:bg-gray-900" : ""
      }`} onClick={onClick}>
        <CardHeader className="text-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto transform rotate-45 bg-black dark:bg-white flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-white dark:text-black transform -rotate-45" />
            </div>
            {badge && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white">
                {badge}
              </Badge>
            )}
          </div>
          <div className="space-y-2">
            <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              {description}
            </p>
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
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
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
