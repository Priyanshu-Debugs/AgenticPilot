<div align="center">

# 🤖 AgenticPilot

**AI-Powered Business Automation Platform**

*Intelligent agents that automate your business operations 24/7*

<br>

[![Typing SVG](https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=500&size=20&duration=3000&pause=1000&color=FFFFFF&center=true&vCenter=true&random=false&width=500&lines=Smart+AI+Automations;Intelligent+Task+Orchestration;Built+for+Modern+Teams)](https://github.com/Priyanshu-Debugs/AgenticPilot)

<br>

<!-- Tech Stack Icons -->
<p>
  <img src="https://skillicons.dev/icons?i=nextjs,react,typescript,tailwind,supabase,vercel&theme=dark" alt="Tech Stack" />
</p>

<br>

<!-- Repository Stats -->
[![Stars](https://img.shields.io/github/stars/Priyanshu-Debugs/AgenticPilot?style=flat&color=white&labelColor=black)](https://github.com/Priyanshu-Debugs/AgenticPilot/stargazers)
[![Forks](https://img.shields.io/github/forks/Priyanshu-Debugs/AgenticPilot?style=flat&color=white&labelColor=black)](https://github.com/Priyanshu-Debugs/AgenticPilot/network/members)
[![Issues](https://img.shields.io/github/issues/Priyanshu-Debugs/AgenticPilot?style=flat&color=white&labelColor=black)](https://github.com/Priyanshu-Debugs/AgenticPilot/issues)
[![License](https://img.shields.io/github/license/Priyanshu-Debugs/AgenticPilot?style=flat&color=white&labelColor=black)](https://github.com/Priyanshu-Debugs/AgenticPilot/blob/main/LICENSE)

<br>

[**Get Started**](#-quick-start) · [**Features**](#-features) · [**Tech Stack**](#-tech-stack) · [**Architecture**](#-architecture) · [**Team**](#-team)

</div>

---

## 📌 Overview

**AgenticPilot** is a modern SaaS platform that uses AI agents to automate repetitive business tasks. Built with Next.js 15 and powered by Google's Gemini AI, it handles everything from customer communications to operational workflows.

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│   🎯 FOR                          💡 BENEFITS                  │
│   ────                            ────────                     │
│   • Startups & SMBs               • Save 20+ hours/week        │
│   • E-commerce Teams              • 95% automation accuracy    │
│   • Customer Support              • 24/7 autonomous operation  │
│   • Marketing Teams               • 40% cost reduction         │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

<br>

<div align="center">

| Smart AI Automations | Platform Capabilities |
|:---:|:---:|
| Context-aware AI responses | Dark/Light mode |
| Intelligent task classification | Responsive design |
| Automated workflow execution | Real-time updates |
| Confidence scoring & escalation | Enterprise security |
| Custom template management | Analytics dashboard |
| Comprehensive logging | OAuth integrations |

</div>

<br>

---

## 🛠 Tech Stack

<div align="center">

### Core Technologies

<img src="https://skillicons.dev/icons?i=nextjs,react,typescript,tailwind&theme=dark" alt="Frontend" />

**Next.js 15** · **React 19** · **TypeScript 5** · **Tailwind CSS 4**

<br>

### Backend & Services

<img src="https://skillicons.dev/icons?i=supabase,vercel,nodejs,gcp&theme=dark" alt="Backend" />

**Supabase** · **Vercel** · **Node.js** · **GCP**

<br>

### Additional Tools

<img src="https://skillicons.dev/icons?i=git,github,vscode&theme=dark" alt="Tools" />

**Git** · **GitHub** · **VS Code**

</div>

<br>

| Category | Technologies |
|:---|:---|
| **Framework** | Next.js 15 (App Router) |
| **UI** | React 19, Tailwind CSS, shadcn/ui, Framer Motion |
| **Language** | TypeScript 5 |
| **Database** | Supabase (PostgreSQL + RLS) |
| **AI** | Google Gemini AI |
| **Auth** | Supabase Auth (OAuth) |
| **Deployment** | Vercel |
| **Icons** | Phosphor Icons |
| **Validation** | Zod |

---

## 📁 Project Structure

```
AgenticPilot/
│
├── app/                              # Next.js App Router
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Landing page
│   │
│   ├── api/                          # API Routes
│   │   ├── auth/                     # Auth endpoints
│   │   ├── gmail/                    # Automation API
│   │   ├── instagram/                # Social API
│   │   ├── notifications/            # Notifications
│   │   └── settings/                 # Settings API
│   │
│   ├── auth/                         # Auth pages
│   │   ├── signin/
│   │   └── signup/
│   │
│   ├── dashboard/                    # Dashboard
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # Overview
│   │   ├── gmail/
│   │   ├── instagram/
│   │   └── inventory/
│   │
│   ├── billing/
│   ├── contact/
│   ├── pricing/
│   ├── profile/
│   ├── settings/
│   └── notifications/
│
├── components/                       # Components
│   ├── ui/                           # Base UI (shadcn)
│   ├── shared/                       # Shared components
│   │   ├── DashboardNavbar.tsx
│   │   ├── DashboardSidebar.tsx
│   │   ├── Navigation.tsx
│   │   └── Cards.tsx
│   ├── gmail/                        # Feature components
│   ├── mode-toggle.tsx
│   └── theme-provider.tsx
│
├── lib/                              # Libraries
│   ├── gmail/                        # Integration logic
│   └── utils.ts
│
├── utils/                            # Helpers
├── styles/                           # Styles
├── public/                           # Assets
│
├── middleware.ts                     # Auth middleware
├── tailwind.config.js
├── next.config.mjs
├── vercel.json
└── package.json
```

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/Priyanshu-Debugs/AgenticPilot.git
cd AgenticPilot

# Install
npm install

# Setup environment
cp .env.example .env.local

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

<br>

| Command | Description |
|:---|:---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production |
| `npm run lint` | Lint code |

---

## ⚙️ Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_key

# Google OAuth
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret

# Google AI
GOOGLE_AI_API_KEY=your_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

<details>
<summary><b>Setup Guides</b></summary>

**Supabase**: Go to [supabase.com](https://supabase.com) → Create project → Settings → API

**Google OAuth**: Go to [Google Cloud Console](https://console.cloud.google.com) → Enable Gmail API → Create OAuth credentials

**Google AI**: Go to [Google AI Studio](https://makersuite.google.com/app/apikey) → Create API key

</details>

---

## 📊 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│   Next.js App Router + React + Tailwind + Framer Motion     │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        API LAYER                            │
│              Next.js API Routes + Middleware                │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      AI AGENTS                              │
│                                                             │
│    ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│    │   Classify  │  │   Generate  │  │   Execute   │       │
│    │    Input    │──▶│   Response  │──▶│   Action    │       │
│    └─────────────┘  └─────────────┘  └─────────────┘       │
│                                                             │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                        │
│                                                             │
│   Supabase        Google AI       Gmail API      Vercel     │
│   (Database)      (Gemini)        (OAuth)        (Deploy)   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Agent Flow

```
Input ──▶ Classify ──▶ Load Context ──▶ Generate ──▶ Confidence Check
                                                          │
                                    ┌─────────────────────┴─────────────────────┐
                                    │                                           │
                                    ▼                                           ▼
                              Confidence ≥80%                            Confidence <80%
                                    │                                           │
                                    ▼                                           ▼
                              Auto Execute                               Escalate to Human
                                    │                                           │
                                    └───────────────────┬───────────────────────┘
                                                        │
                                                        ▼
                                                   Log Action
```

---

## 🔐 Security

| Layer | Implementation |
|:---|:---|
| **Authentication** | Supabase Auth + OAuth |
| **Database** | Row Level Security (RLS) |
| **API** | Middleware protection |
| **Secrets** | Encrypted at rest |
| **Validation** | Zod schemas |
| **Rate Limiting** | Per-endpoint limits |

---

## 🗺️ Roadmap

| Status | Milestone |
|:---:|:---|
| ✅ | Core platform & dashboard |
| ✅ | AI-powered automations |
| ✅ | OAuth integrations |
| ✅ | Dark/Light theme |
| 🚧 | Advanced analytics |
| 📋 | Workflow builder |
| 📋 | Plugin system |
| 📋 | Team collaboration |

---

## 👥 Team

<div align="center">

<table>
<tr>
<td align="center">
<a href="https://github.com/Priyanshu-Debugs">
<img src="https://avatars.githubusercontent.com/u/190604401?v=4" width="80px;" alt="Priyanshu"/><br />
<sub><b>Priyanshu-Debugs</b></sub>
</a>
</td>
<td align="center">
<a href="https://github.com/MihirPatel204">
<img src="https://avatars.githubusercontent.com/u/149526832?v=4" width="80px;" alt="Mihir"/><br />
<sub><b>MihirPatel204</b></sub>
</a>
</td>
</tr>
</table>

<br>

<a href="https://github.com/Priyanshu-Debugs/AgenticPilot/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Priyanshu-Debugs/AgenticPilot" alt="Contributors" />
</a>

</div>

---

## 🤝 Contributing

```bash
# Fork the repo
# Clone your fork
git clone https://github.com/YOUR-USERNAME/AgenticPilot.git

# Create branch
git checkout -b feature/your-feature

# Commit changes
git commit -m "feat: add your feature"

# Push
git push origin feature/your-feature

# Open PR
```

| Prefix | Use |
|:---|:---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `refactor` | Code refactor |
| `chore` | Maintenance |

---

## 📄 License

MIT License - see [LICENSE](LICENSE)

---

<div align="center">

<br>

**If you find this useful, give it a ⭐**

<br>

<img src="https://skillicons.dev/icons?i=nextjs,react,typescript,tailwind,supabase&theme=dark" alt="Stack" />

<br><br>

[Report Bug](https://github.com/Priyanshu-Debugs/AgenticPilot/issues) · [Request Feature](https://github.com/Priyanshu-Debugs/AgenticPilot/issues)

<br>

**Made by the AgenticPilot Team**

</div>
