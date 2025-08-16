---

## 📒 Gmail Automation Planning & Conversation Log

### Project Focus
- Target users: Startups and small businesses.
- Main goal: Automate Gmail replies for customer reviews and inquiries, providing smart, context-aware responses.

### Agent Types & Features
- **Review Response Agent**: Detects customer reviews/feedback, generates positive, personalized replies, escalates negative reviews.
- **Inquiry/Support Agent**: Detects questions/support requests, generates helpful answers using business info/FAQs, escalates complex queries.

### Workflow
1. Fetch unread emails from Gmail API.
2. Classify each email as 'review', 'inquiry', or 'other' (using LLM or rules).
3. For reviews: Generate thank-you/follow-up message.
4. For inquiries: Generate answer using business context or escalate if unsure.
5. Optionally, flag uncertain/negative cases for human review.
6. Log all actions and show stats in dashboard.

### Suggested Database Schema
- `gmail_templates`: Stores user templates for reviews, inquiries, etc.
- `business_info`: Stores business name, about, and FAQs for context-aware replies.
- `gmail_logs`: Logs all automated replies and escalations, including confidence scores.

#### Example Table Definitions
```sql
CREATE TABLE public.gmail_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  type text CHECK (type IN ('review', 'inquiry', 'other')),
  template text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.business_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  business_name text,
  faq jsonb,
  about text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.gmail_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  email_id text,
  email_subject text,
  email_type text,
  action text,
  reply text,
  confidence numeric,
  created_at timestamptz DEFAULT now()
);
```

### Agent Logic Flow (Pseudocode)
```ts
for (const email of unreadEmails) {
  const type = classifyEmail(email); // 'review', 'inquiry', 'other'
  const template = getTemplate(userId, type);
  const business = getBusinessInfo(userId);

  const reply = generateReplyWithLLM(email, template, business);
  const confidence = reply.confidence;

  if (confidence > 0.8) {
    sendReply(email, reply.text);
    logAction(userId, email, type, 'auto_reply', reply.text, confidence);
  } else {
    escalateToHuman(userId, email, type, reply.text, confidence);
    logAction(userId, email, type, 'escalated', reply.text, confidence);
  }
}
```

### Key Decisions & Notes
- Use LangChain + OpenAI for classification and reply generation.
- Store all user data and templates in Supabase, scoped by user ID.
- Allow users to review and customize templates and business info.
- Provide dashboard analytics for transparency and improvement.

---

# AgenticPilot Architecture Documentation

## 🏗️ Project Overview

**AgenticPilot** is a multi-tenant SaaS automation platform built with Next.js, Supabase, and LangChain.js. It enables users to connect their accounts (Gmail, Instagram, etc.), configure automations, and run AI-powered agents on their own data securely and at scale.

### Tech Stack
- **Frontend/Backend**: Next.js 15.x (App Router, API routes) with TypeScript
- **UI Framework**: Tailwind CSS + shadcn/ui components
- **Database**: Supabase (PostgreSQL with RLS)
- **AI/Automation**: LangChain.js (OpenAI, tool integrations)
- **Authentication**: Supabase Auth (email/password, Google, Facebook OAuth)
- **Deployment**: Vercel (frontend/serverless) + Supabase Cloud (database)
- **Icons**: Lucide React
- **Styling**: next-themes for dark/light mode

---

## 🤖 Agentic Automation Architecture

### Agent Pattern

Each automation agent is a TypeScript class, instantiated per user, with all logic and credentials scoped to that user. Agents use LangChain.js for LLM-powered workflows, tool usage, and memory.

```typescript
// Example agent interface
abstract class BaseAgent {
  constructor(public userId: string, public config: any) {}
  abstract async execute(input?: any): Promise<any>;
  async saveLog(result: any) {/* ... */}
}

class GmailAgent extends BaseAgent {
  async execute(input?: any) {
    // 1. Load user credentials from Supabase
    // 2. Use LangChain to orchestrate Gmail API + LLM
    // 3. Save results/logs
    return { status: 'success', details: 'Replied to 5 emails.' };
  }
}
```

### Multi-User Isolation
- All agent logic, credentials, and data are strictly scoped by user ID.
- Each agent instance runs independently, triggered by user action or schedule.
- Supabase RLS ensures data isolation at the database level.

### Agent Execution Flow
1. User configures agent in dashboard (UI writes config to Supabase)
2. User triggers automation (manual or scheduled)
3. API route/serverless function loads config & credentials, instantiates agent
4. Agent runs business logic (LangChain, API calls, etc.)
5. Results/logs saved to Supabase, UI updates in real time

### Scheduling & Background Jobs
- Use Supabase Edge Functions or Vercel serverless for scheduled/background automations
- For heavy workloads, consider a Node.js worker with a queue (e.g., Upstash, BullMQ)

---

## � User Flow & Lifecycle

1. User signs up (email/password, Google, or Facebook OAuth)
2. User connects external accounts (Gmail, Instagram, etc.)
3. User configures and enables automations (per agent)
4. Agents run on demand or on schedule, processing user data
5. User views real-time status, logs, and analytics in dashboard

---

## 🎨 UI/UX Architecture

- **Dashboard**: Central hub for agent management, status, and analytics
- **AutomationController**: Start/stop/configure agents, view progress
- **Real-time updates**: Supabase subscriptions for instant feedback
- **Responsive design**: Mobile-first, dark/light mode

---

## 🔐 Security & Best Practices

- Supabase Auth for authentication (multi-provider)
- Row Level Security (RLS) on all tables
- All credentials encrypted at rest
- OAuth tokens stored securely, never exposed to client
- Input validation (Zod/Yup) and error handling throughout
- Rate limiting and audit logging for sensitive endpoints

---

## � Deployment & Scaling

- Vercel for frontend and API/serverless routes
- Supabase for database, auth, and real-time
- Edge/serverless functions for background jobs
- Queue/worker system for heavy or scheduled automations (future)

---

## 🧭 Future Roadmap

### Short Term
- Add Google and Facebook OAuth (Supabase Auth)
- Implement core agent automations (Gmail, Instagram, Inventory)
- Real-time user data display and analytics
- Robust logging and error handling

### Medium Term
- Add more agent types (Slack, Twitter, WhatsApp, etc.)
- User-configurable automation workflows (drag-and-drop or YAML/JSON)
- Plugin system for custom user automations
- Advanced scheduling and triggers (webhooks, events)

### Long Term
- Marketplace for user/community-contributed agents
- AI-powered workflow suggestions and optimization
- Multi-tenant scaling (dedicated workers, sharding, etc.)
- Enterprise features: SSO, audit logs, advanced analytics

---

## � Quick Start Guide

1. Clone repo & install dependencies
2. Configure environment variables (Supabase, OpenAI, OAuth)
3. Set up Supabase database (run schema SQL)
4. Start dev server: `npm run dev`
5. Deploy to Vercel for production

---

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [LangChain.js Docs](https://js.langchain.com/docs/)
- [shadcn/ui Docs](https://ui.shadcn.com/)
- [OpenAI API](https://platform.openai.com/docs/api-reference)

---

**Last Updated**: August 16, 2025
**Maintainer**: AgenticPilot Development Team
