"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bot, ArrowLeft, Upload, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/utils/auth/AuthProvider"
import { useUserProfile } from "@/utils/hooks/useUserProfile"

export default function ProfilePage() {
  const { user } = useAuth()
  const { profile, loading, updateProfile } = useUserProfile()
  const [isUpdating, setIsUpdating] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  
  // Form state
  const [fullName, setFullName] = useState("")

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "")
    }
  }, [profile])

  const handleSaveProfile = async () => {
    setIsUpdating(true)
    setError("")
    setSuccess("")

    try {
      const { error } = await updateProfile({
        full_name: fullName || null,
      })

      if (error) {
        setError(error.message || "Failed to update profile")
      } else {
        setSuccess("Profile updated successfully!")
        setTimeout(() => setSuccess(""), 3000)
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsUpdating(false)
    }
  }

  // Generate user initials
  const getUserInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase()
    }
    return 'U'
  }

  // Get plan display info
  const getPlanInfo = () => {
    if (!profile) return { name: 'Loading...', price: '...' }
    
    const planMap = {
      starter: { name: 'Starter Plan', price: 'Free' },
      professional: { name: 'Pro Plan', price: '$29.99/month' },
      enterprise: { name: 'Enterprise Plan', price: '$99.99/month' }
    }
    return planMap[profile.plan] || planMap.starter
  }

  // Format join date
  const getJoinDate = () => {
    if (!profile?.created_at) return 'Unknown'
    return new Date(profile.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container-padding">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <Link href="/" className="text-lg sm:text-xl font-bold">
                AgenticPilot
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <ModeToggle />
              <Button variant="outline" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Profile Content */}
      <div className="container-padding section-spacing">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight">Profile Settings</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Manage your account information and preferences</p>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <p className="text-emerald-600">{success}</p>
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive">{error}</p>
            </div>
          )}

          <div className="space-y-6 sm:space-y-8">
            {/* Top Section - Profile Picture and Information */}
            <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
              {/* Profile Picture */}
              <Card className="lg:col-span-1 card-elevated">
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                  <CardDescription>Update your profile image</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                  <Avatar className="w-24 h-24 sm:w-32 sm:h-32">
                    <AvatarImage src={profile?.avatar_url || "/placeholder-user.jpg"} alt="Profile" />
                    <AvatarFallback className="text-xl sm:text-2xl">{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" className="w-full" disabled>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New Picture
                    <span className="text-xs text-muted-foreground ml-2">(Coming Soon)</span>
                  </Button>
                </CardContent>
              </Card>

              {/* Profile Information */}
              <Card className="lg:col-span-2 card-elevated">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={user?.email || ""} 
                  disabled
                  className="bg-muted/50"
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                <Button variant="outline" asChild className="flex-1 sm:flex-none">
                  <Link href="/dashboard">Cancel</Link>
                </Button>
                <Button onClick={handleSaveProfile} disabled={isUpdating} className="flex-1 sm:flex-none">
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
              </Card>
            </div>

            {/* Account Status */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
                <CardDescription>Your account information and subscription details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>Plan</Label>
                    <p className="text-lg font-semibold">{getPlanInfo().name}</p>
                    <p className="text-sm text-muted-foreground">{getPlanInfo().price}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Member Since</Label>
                    <p className="text-lg font-semibold">{getJoinDate()}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Account Status</Label>
                    <p className="text-lg font-semibold text-emerald-600">Active</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
