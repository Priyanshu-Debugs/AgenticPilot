"use client"

import { motion } from "framer-motion"
import { SpotlightCard } from "@/components/ui/card"
import { Navigation } from "@/components/shared/Navigation"
import { BookOpen, Calendar, Clock, ArrowRight, BrainCircuit, ExternalLink, Loader2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useAuth } from "@/utils/auth/AuthProvider"

interface Blog {
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
  source: string
  link: string
}

export default function BlogPage() {
  const { user, signOut } = useAuth()
  const navUser = user
    ? {
        name: user.full_name || user.email?.split("@")[0] || "User",
        email: user.email || "",
        avatar: user.avatar_url || user.user_metadata?.avatar_url || "",
      }
    : undefined

  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const response = await fetch("/api/blog")
        if (!response.ok) throw new Error("Failed to fetch blogs")
        const data = await response.json()
        setBlogs(data)
      } catch (err) {
        console.error("Fetch error:", err)
        setError("Unable to load latest blogs. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation
        isAuthenticated={!!user}
        user={navUser}
        onSignIn={() => window.location.href = "/auth/signin"}
        onSignUp={() => window.location.href = "/auth/signup"}
        onSignOut={() => {
          void signOut()
        }}
      />

      {/* Ambient background styling */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute right-[10%] top-[10%] w-[30%] h-[30%] rounded-full bg-accent/5 blur-[120px]" />
        <div className="absolute left-[20%] bottom-[20%] w-[25%] h-[25%] rounded-full bg-primary/10 blur-[100px]" />
      </div>

      <div className="relative z-10 container-padding py-32 lg:py-40">
        <div className="max-w-5xl mx-auto space-y-16">
          
          {/* Header Section */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <BookOpen className="w-4 h-4 mr-2" />
              Agentic Insights
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              Thoughts on <span className="text-gradient-static">AI & Automation</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Dive deep into the engineering, design, and architecture behind the next generation of autonomous business software.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-muted-foreground animate-pulse">Fetching latest AI blogs...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-destructive font-medium">{error}</p>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {blogs.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <SpotlightCard className="p-0 overflow-hidden border-primary/30">
                    <div className="flex flex-col md:flex-row h-full">
                      <div className="md:w-1/2 bg-gradient-to-br from-primary/20 via-accent/10 to-background p-10 flex items-center justify-center border-b md:border-b-0 md:border-r border-border/50">
                        <BrainCircuit className="w-32 h-32 text-primary opacity-80" />
                      </div>
                      <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                        <div className="flex items-center space-x-4 mb-4 text-xs font-medium text-muted-foreground">
                          <span className="text-primary uppercase tracking-wider">{blogs[0].category}</span>
                          <span>•</span>
                          <span className="flex items-center"><Calendar className="w-3 h-3 mr-1"/> {blogs[0].date}</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                          {blogs[0].title}
                        </h2>
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                          {blogs[0].excerpt}
                        </p>
                        <div className="mt-auto flex items-center justify-end">
                          <Link 
                            href={blogs[0].link} 
                            target="_blank"
                            className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors group/link"
                          >
                            Read Original <ExternalLink className="ml-1 h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </SpotlightCard>
                </motion.div>
              )}

              {/* Grid Posts */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.slice(1).map((blog, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="h-full"
                  >
                    <SpotlightCard className="h-full p-6 flex flex-col hover:border-primary/50">
                      <div className="flex items-center justify-between mb-4 text-xs text-muted-foreground">
                        <span className="text-accent font-semibold">{blog.category}</span>
                        <span className="flex items-center"><Clock className="w-3 h-3 mr-1"/> {blog.readTime}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-3 line-clamp-2">{blog.title}</h3>
                      <p className="text-muted-foreground text-sm mb-6 flex-1 line-clamp-3">{blog.excerpt}</p>
                      <div className="mt-auto flex items-center justify-end pt-4 border-t border-border/30">
                        <Link 
                          href={blog.link} 
                          target="_blank"
                          className="inline-flex items-center text-xs font-semibold text-primary hover:text-primary/80 transition-colors group/link"
                        >
                          Read <ExternalLink className="ml-1 h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                        </Link>
                      </div>
                    </SpotlightCard>
                  </motion.div>
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  )
}
