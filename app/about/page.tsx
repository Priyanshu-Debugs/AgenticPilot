"use client"

import { motion } from "framer-motion"
import { SpotlightCard } from "@/components/ui/card"
import { Navigation } from "@/components/shared/Navigation"
import { Github, Linkedin, Mail, ArrowRight, BookOpen, BrainCircuit } from "lucide-react"

export default function AboutPage() {
  const founders = [
    {
      name: "Priyaanshu Patel",
      role: "Co-Founder & Developer",
      github: "https://www.github.com/Priyanshu-Debugs",
      bio: "Focuses on intelligent automation architecture and robust full-stack infrastructure."
    },
    {
      name: "Mihir Patel",
      role: "Co-Founder & Developer",
      github: "https://www.github.com/mihirpatel204",
      bio: "Specializes in scalable backend systems and high-performance data processing."
    },
    {
      name: "Sujal Patel",
      role: "Co-Founder & Developer",
      github: "https://www.github.com/sujal7122005",
      bio: "Passionate about creating seamless user experiences and modern frontend interfaces."
    }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation
        onSignIn={() => window.location.href = "/auth/signin"}
        onSignUp={() => window.location.href = "/auth/signup"}
      />

      {/* Decorative Blur Spheres */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute right-[-10%] top-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute left-[-10%] bottom-[10%] w-[35%] h-[35%] rounded-full bg-accent/10 blur-[100px]" />
      </div>

      <div className="relative z-10 container-padding py-32 lg:py-40">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Header Section */}
          <motion.div 
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <BrainCircuit className="w-4 h-4 mr-2" />
              Our Mission
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              Building the Future of <br className="hidden md:block" />
              <span className="text-gradient-static">Business Automation</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We are a team of college friends studying Computer Engineering at VGEC, driven by the vision to make advanced Agentic AI accessible to every business.
            </p>
          </motion.div>

          {/* Founders Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
          >
            <div className="col-span-full mb-6">
              <h2 className="text-2xl font-bold border-b border-border/50 pb-4 text-center">Meet the Founders</h2>
            </div>
            
            {founders.map((founder, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full"
              >
                <SpotlightCard className="h-full flex flex-col p-6 items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6">
                    <span className="text-2xl font-bold text-primary">
                      {founder.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-1">{founder.name}</h3>
                  <p className="text-sm font-medium text-primary mb-4">{founder.role}</p>
                  <p className="text-sm text-muted-foreground mb-6 flex-1">{founder.bio}</p>
                  
                  <div className="mt-auto pt-4 w-full flex justify-center space-x-4 border-t border-border/30">
                    <a href={founder.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-muted/50 rounded-full hover:bg-primary/20 hover:text-primary transition-colors">
                      <Github className="w-5 h-5" />
                      <span className="sr-only">GitHub</span>
                    </a>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </motion.div>

          {/* Academic Background */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SpotlightCard className="p-8 md:p-12 border-primary/20 bg-primary/5">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-16 h-16 shrink-0 rounded-2xl bg-primary/20 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">Our Roots</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    AgenticPilot started as a shared passion project between three friends pursuing their B.E. in Computer Engineering from Vishwakarma Government Engineering College (VGEC). We combined our different technical specialties to build an AI platform capable of true autonomy—pushing the boundaries of what automated agents can do.
                  </p>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
