# AgenticPilot Architecture Documentation

## 🏗️ Project Overview

**AgenticPilot** is a Next.js-based AI automation platform that manages three core AI agents for business automation. The application uses LangChain.js for intelligent agent processing and Supabase for data persistence.

### Tech Stack
- **Frontend/Backend**: Next.js 15.2.4 with TypeScript
- **UI Framework**: Tailwind CSS + shadcn/ui components
- **Database**: Supabase (PostgreSQL with RLS)
- **AI Framework**: LangChain.js with OpenAI GPT-4
- **Authentication**: Supabase Auth
- **Deployment**: Vercel (Frontend) + Supabase Cloud (Database)
- **Icons**: Lucide React
- **Styling**: Dark/Light theme with next-themes

---

## 🤖 AI Agents Architecture

### Three Core Agents

#### 📧 Gmail Agent
- **Purpose**: AI-powered email automation and response management
- **Features**: Auto-reply, template management, intelligent email processing
- **Integration**: Gmail API + OpenAI for response generation

#### 📱 Instagram Agent
- **Purpose**: Social media automation for content creation and posting
- **Features**: AI caption generation, hashtag suggestions, post scheduling
- **Integration**: Instagram Business API + DALL-E for image generation

#### 📦 Inventory Agent
- **Purpose**: Intelligent inventory monitoring and management
- **Features**: Stock analysis, demand prediction, reorder recommendations
- **Integration**: Custom business logic + AI for predictive analytics

### Agent Implementation Pattern

```typescript
// Each agent follows this structure:
class [AgentName]Agent {
  constructor(userId: string)
  async execute(input: any): Promise<result>
  async saveToSupabase(executionData: any)
  async getUserConfig(): Promise<config>
  async getUserCredentials(): Promise<credentials>
}
```

---

## 🗄️ Supabase Database Schema

### Core Tables

```sql
-- User agent configurations
CREATE TABLE user_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  agent_type TEXT NOT NULL, -- 'gmail' | 'instagram' | 'inventory'
  config JSONB NOT NULL,    -- Agent-specific settings
  credentials_encrypted TEXT, -- Encrypted OAuth tokens
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent execution logs
CREATE TABLE agent_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  agent_type TEXT NOT NULL,
  status TEXT NOT NULL, -- 'running' | 'success' | 'error'
  input_data JSONB,
  output_data JSONB,
  error_message TEXT,
  execution_time_ms INTEGER,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Encrypted user credentials
CREATE TABLE user_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL, -- 'gmail' | 'instagram' | 'openai'
  credentials_encrypted TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE user_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_credentials ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can manage their agents" ON user_agents
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their executions" ON agent_executions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their credentials" ON user_credentials
  FOR ALL USING (auth.uid() = user_id);
```

---

## 📁 Project Structure

```
AgenticPilot/
├── app/
│   ├── api/
│   │   └── agents/
│   │       ├── gmail/route.ts
│   │       ├── instagram/route.ts
│   │       └── inventory/route.ts
│   ├── dashboard/
│   │   ├── page.tsx              # Main dashboard
│   │   ├── gmail/page.tsx        # Gmail agent UI
│   │   ├── instagram/page.tsx    # Instagram agent UI
│   │   └── inventory/page.tsx    # Inventory agent UI
│   ├── auth/                     # Authentication pages
│   │   ├── signin/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css
├── components/
│   ├── shared/
│   │   ├── AutomationController.tsx
│   │   ├── DashboardNavbar.tsx
│   │   ├── DashboardSidebar.tsx
│   │   ├── Navigation.tsx
│   │   ├── Cards.tsx
│   │   ├── NotificationSystem.tsx
│   │   └── SettingsPage.tsx
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── progress.tsx
│   │   ├── dialog.tsx
│   │   ├── tabs.tsx
│   │   └── ...
│   ├── theme-provider.tsx
│   └── mode-toggle.tsx
├── lib/
│   ├── supabase-client.ts        # Supabase configuration
│   ├── agents/
│   │   ├── gmail-agent.ts
│   │   ├── instagram-agent.ts
│   │   └── inventory-agent.ts
│   ├── password-validation.ts
│   ├── rate-limiting.ts
│   └── utils.ts
├── utils/
│   ├── auth/
│   │   └── AuthProvider.tsx
│   ├── hooks/
│   │   └── useUserProfile.ts
│   └── supabase/
│       ├── client.ts
│       ├── middleware.ts
│       └── server.ts
├── public/                       # Static assets
├── middleware.ts                 # Next.js middleware
├── tailwind.config.js           # Tailwind configuration
├── components.json              # shadcn/ui config
└── package.json
```

---

## 🔄 User Flow & Agent Lifecycle

### Agent Activation Flow

1. User enables agent in dashboard
2. Agent configuration saved to `user_agents` table
3. User credentials stored encrypted in `user_credentials`
4. Agent status tracked in real-time
5. Executions logged in `agent_executions`

### Agent Execution Flow

```typescript
// API Route: /api/agents/[agentType]/route.ts
POST /api/agents/gmail
{
  userId: "uuid",
  action: "start" | "stop" | "configure",
  settings: { /* agent-specific config */ }
}

// Agent Processing:
// 1. Authenticate user (Supabase Auth)
// 2. Load agent config from database
// 3. Initialize LangChain agent with user credentials
// 4. Execute agent logic
// 5. Save results to database
// 6. Return status to frontend
```

### Multi-User Isolation

```typescript
// Each user's agents run independently
const agentKey = `${userId}-${agentType}`
const userAgent = await agentManager.getAgent(agentKey)
const userMemory = await agentManager.getUserMemory(userId)
const userCredentials = await agentDB.getUserCredentials(userId, serviceType)
```

---

## 🎨 UI/UX Architecture

### Design System

- **Color Scheme**: Monochromatic with blue accents
- **Theme**: Dark/Light mode with CSS variables
- **Typography**: Geist Sans/Mono font stack
- **Components**: shadcn/ui with custom styling
- **Layout**: Responsive with mobile-first approach

### Dashboard Components

#### AutomationController
- Central agent management interface
- Real-time status monitoring
- Start/stop/configure actions
- Progress tracking with visual indicators

#### StatsCard
- Metrics display with trend indicators
- Performance analytics
- Success rate visualization
- Time-based statistics

#### FeatureCard
- Agent overview cards
- Quick access to agent pages
- Status badges and icons
- Hover effects and transitions

#### ActionCard
- Quick action buttons
- Configuration shortcuts
- Bulk operations
- Loading states

### Navigation Structure

- **Fixed navbar** with user dropdown
- **Collapsible sidebar** with agent sections
- **Active state indicators** for current page
- **Mobile-responsive** hamburger menu
- **Breadcrumb navigation** for deep pages

---

## 🔐 Security & Authentication

### Authentication System

- **Supabase Auth** with email/password
- **JWT tokens** for API authentication
- **Row Level Security** for data isolation
- **Password validation** with strength requirements
- **Rate limiting** for security endpoints

### Credential Management

- **OAuth2 tokens** encrypted in database
- **Per-user credential storage**
- **Automatic token refresh** handling
- **Secure credential retrieval** in agents
- **Encryption at rest** for sensitive data

### Security Features

```typescript
// Rate limiting implementation
export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
  isBlocked: boolean
}

// Password validation
export const passwordRequirements = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true
}
```

---

## 🚀 Deployment Architecture

```
Frontend (Vercel)
├── Next.js App Router
├── Static assets
├── Serverless functions
└── Edge middleware

Database (Supabase Cloud)
├── PostgreSQL database
├── Row Level Security
├── Real-time subscriptions
├── Edge functions
└── Storage buckets

AI Services
├── OpenAI GPT-4 (text generation)
├── DALL-E (image generation)
├── Custom AI endpoints
└── LangChain.js framework
```

### Environment Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Services
OPENAI_API_KEY=your_openai_key

# Agent Service Credentials
GMAIL_CLIENT_ID=your_gmail_client_id
GMAIL_CLIENT_SECRET=your_gmail_client_secret
INSTAGRAM_APP_ID=your_instagram_app_id
INSTAGRAM_APP_SECRET=your_instagram_app_secret

# Application
NEXTAUTH_SECRET=your_auth_secret
NEXTAUTH_URL=your_app_url
```

---

## 📊 Agent State Management

### Agent Status Types

- **running**: Agent actively processing tasks
- **paused**: Temporarily stopped by user
- **stopped**: Completely inactive
- **error**: Encountered issues requiring attention
- **completed**: Task finished successfully

### Real-time Updates

- **Supabase subscriptions** for live status updates
- **WebSocket connections** for instant feedback
- **Progress tracking** with percentage completion
- **Error handling** with user notifications
- **Execution logs** for debugging and monitoring

### State Persistence

```typescript
interface AutomationTask {
  id: string
  name: string
  description: string
  status: "running" | "paused" | "stopped" | "error" | "completed"
  progress: number
  lastRun?: string
  nextRun?: string
  executionTime?: string
  tasksProcessed?: number
  successRate?: number
}
```

---

## 🔧 Development Patterns

### Agent Development Workflow

1. **Create LangChain agent class** with user context
2. **Implement Supabase integration** for data persistence
3. **Add API route handler** for frontend communication
4. **Update dashboard UI** with agent controls
5. **Add configuration options** for user customization
6. **Implement error handling** and logging
7. **Add real-time status updates**

### Database Operations Pattern

```typescript
// Use agentDB helper class for all database operations
class AgentDatabase {
  async saveAgentConfig(userId: string, agentType: string, config: any)
  async getAgentConfig(userId: string, agentType: string)
  async logExecution(userId: string, agentType: string, execution: any)
  async getUserCredentials(userId: string, serviceType: string)
  private decryptCredentials(encrypted: string)
}
```

### UI Development Patterns

- **Card-based layouts** for agent interfaces
- **Badge indicators** for status display
- **Progress bars** for execution tracking
- **Modal dialogs** for configuration
- **Responsive design** with mobile-first approach
- **Loading states** for better UX
- **Error boundaries** for graceful error handling

---

## 🎯 Current Implementation Status

### ✅ Completed Features

- **Dashboard UI** with all agent pages
- **Authentication system** (Supabase Auth)
- **Database schema** design and implementation
- **Component architecture** with shadcn/ui
- **Responsive design** system
- **Theme switching** (dark/light mode)
- **Rate limiting** and security features
- **Password validation** system
- **User profile** management

### 🔄 In Progress

- **LangChain agent** implementation
- **Supabase integration** for agents
- **Real-time status** updates
- **OAuth credential** management

### 📅 Planned Features

- **Agent execution** monitoring
- **Advanced AI capabilities**
- **Performance analytics** dashboard
- **Webhook integrations**
- **Bulk operations** for agents
- **Advanced scheduling** options
- **Custom AI model** integration

---

## 🚀 Quick Start Guide

### Prerequisites

- Node.js 18+ installed
- Supabase account and project
- OpenAI API key
- Vercel account (for deployment)

### Setup Steps

1. **Clone and install dependencies**
   ```bash
   git clone [repository-url]
   cd AgenticPilot
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   # Fill in your API keys and configuration
   ```

3. **Set up Supabase database**
   ```sql
   -- Run the SQL scripts from the database schema section
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

---

## 📚 Additional Resources

### Documentation Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [LangChain.js Documentation](https://js.langchain.com/docs/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### API References

- [OpenAI API](https://platform.openai.com/docs/api-reference)
- [Gmail API](https://developers.google.com/gmail/api)
- [Instagram Basic Display API](https://developers.facebook.com/docs/instagram-basic-display-api)

---

## 📞 Support and Contribution

### Getting Help

- Check the [Issues](https://github.com/your-repo/issues) section
- Review the documentation above
- Contact the development team

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Last Updated**: August 15, 2025
**Version**: 1.0.0
**Maintainer**: AgenticPilot Development Team
