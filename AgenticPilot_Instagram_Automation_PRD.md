# AgenticPilot — Instagram Automation PRD
**Document Type:** Product Requirements Document  
**Version:** 1.0  
**Date:** April 2026  
**Product:** AgenticPilot — Instagram Automation Module  

---

## Table of Contents

1. [Overview](#1-overview)
2. [Goals & Success Metrics](#2-goals--success-metrics)
3. [Tech Stack](#3-tech-stack)
4. [Environment Variables (.env)](#4-environment-variables-env)
5. [System Architecture](#5-system-architecture)
6. [Feature 1 — Human-in-the-Loop Post](#6-feature-1--human-in-the-loop-post)
7. [Feature 2 — Fully Automated Auto Post](#7-feature-2--fully-automated-auto-post)
8. [LangGraph Agent Design](#8-langgraph-agent-design)
9. [Instagram API Integration](#9-instagram-api-integration)
10. [Image Generation Pipeline](#10-image-generation-pipeline)
11. [Trend Discovery Pipeline](#11-trend-discovery-pipeline)
12. [Database Schema](#12-database-schema)
13. [Backend API Endpoints](#13-backend-api-endpoints)
14. [Frontend UI Requirements](#14-frontend-ui-requirements)
15. [Scheduling & Queue System](#15-scheduling--queue-system)
16. [Error Handling & Edge Cases](#16-error-handling--edge-cases)
17. [Security Requirements](#17-security-requirements)
18. [Meta App Review Requirements](#18-meta-app-review-requirements)
19. [Development Phases](#19-development-phases)

---

## 1. Overview

AgenticPilot's Instagram Automation module allows users of the platform to either **review and approve AI-generated posts before publishing** (Mode 1) or **fully delegate content creation and publishing to an AI agent** (Mode 2). The system uses LangGraph for agent orchestration, the Meta Instagram Graph API for publishing, and Claude/OpenAI for content generation.

### Modes at a Glance

| Mode | Human Involvement | Flow |
|---|---|---|
| **Mode 1 — Assisted Post** | Required (review + approve) | AI generates → Human reviews/edits → Human clicks Post → Agent publishes |
| **Mode 2 — Auto Post** | Zero | Agent finds trend → generates content → publishes automatically on schedule |

---

## 2. Goals & Success Metrics

### Goals
- Allow any AgenticPilot user to connect their Instagram Business account via OAuth
- Generate professional, on-brand Instagram posts using AI
- Support single image, carousel, and caption-only posts
- Enable fully automated recurring post schedules
- Provide post history, analytics preview, and queue management

### Success Metrics
| Metric | Target |
|---|---|
| OAuth connect success rate | > 95% |
| Post publish success rate | > 98% |
| Average content generation time (Mode 1) | < 30 seconds |
| Auto post schedule reliability | > 99.5% |
| User approval rate of AI-generated content | > 70% |

---

## 3. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React / Next.js |
| Backend | FastAPI (Python) |
| Agent Orchestration | LangGraph 0.2+ |
| LLM | Claude claude-opus-4-5 (Anthropic) |
| Image Generation | DALL·E 3 (OpenAI) |
| Trend Discovery | Tavily Search API |
| Image Hosting | AWS S3 (public bucket) |
| Task Queue | Celery + Redis |
| Scheduler | APScheduler or Celery Beat |
| Database | PostgreSQL |
| Cache | Redis |
| Instagram API | Meta Instagram Graph API v19.0 |

---

## 4. Environment Variables (.env)

Create a `.env` file in your project root. **Never commit this file to Git.**

```env
# ─────────────────────────────────────────────
# META / FACEBOOK / INSTAGRAM
# ─────────────────────────────────────────────
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
INSTAGRAM_REDIRECT_URI=https://yourdomain.com/auth/instagram/callback

# ─────────────────────────────────────────────
# ANTHROPIC (Claude LLM)
# ─────────────────────────────────────────────
ANTHROPIC_API_KEY=

# ─────────────────────────────────────────────
# OPENAI (DALL·E Image Generation)
# ─────────────────────────────────────────────
OPENAI_API_KEY=

# ─────────────────────────────────────────────
# TAVILY (Trend Discovery / Web Search)
# ─────────────────────────────────────────────
TAVILY_API_KEY=

# ─────────────────────────────────────────────
# AWS S3 (Image Hosting — must be public)
# ─────────────────────────────────────────────
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-south-1
S3_BUCKET_NAME=agenticpilot-media

# ─────────────────────────────────────────────
# DATABASE
# ─────────────────────────────────────────────
DATABASE_URL=postgresql://user:password@localhost:5432/agenticpilot

# ─────────────────────────────────────────────
# REDIS (Celery Queue + Cache)
# ─────────────────────────────────────────────
REDIS_URL=redis://localhost:6379/0

# ─────────────────────────────────────────────
# APP
# ─────────────────────────────────────────────
SECRET_KEY=your_jwt_secret_key_here
ENVIRONMENT=development
```

> **Note:** Fill in your keys and share the `.env` file securely. The system will not run without all keys populated.

---

## 5. System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                 AgenticPilot Frontend                    │
│         (React/Next.js — Dashboard + Post Editor)        │
└──────────────────┬──────────────────┬───────────────────┘
                   │                  │
          Mode 1 Request        Mode 2 Config
                   │                  │
                   ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│                  FastAPI Backend                         │
│         /api/post/*          /api/autopost/*             │
└──────────────────┬──────────────────┬───────────────────┘
                   │                  │
                   ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│               LangGraph Agents (Python)                  │
│                                                          │
│   ┌──────────────────┐     ┌───────────────────────┐    │
│   │  Human-in-Loop   │     │   Auto Agent Graph    │    │
│   │  Graph           │     │                       │    │
│   │  • gen_caption   │     │  • discover_trends    │    │
│   │  • gen_image     │     │  • craft_strategy     │    │
│   │  • gen_hashtags  │     │  • generate_content   │    │
│   │  • INTERRUPT ◀───┤     │  • find_best_time     │    │
│   │  • human_review  │     │  • publish            │    │
│   │  • publish       │     │                       │    │
│   └──────────────────┘     └───────────────────────┘    │
└──────────────────┬──────────────────┬───────────────────┘
                   │                  │
        ┌──────────┴──────┐  ┌────────┴──────────┐
        ▼                 ▼  ▼                   ▼
  Anthropic API      OpenAI API           Tavily API
  (Claude LLM)     (DALL·E Images)    (Trend Discovery)
                         │
                         ▼
                      AWS S3
                  (Public Image URL)
                         │
                         ▼
         ┌───────────────────────────────┐
         │  Meta Instagram Graph API     │
         │  v19.0                        │
         │  POST /media (container)      │
         │  POST /media_publish          │
         └───────────────────────────────┘
```

---

## 6. Feature 1 — Human-in-the-Loop Post

### User Flow

```
User fills form (topic, tone, post type)
        ↓
Clicks "Generate Post"
        ↓
LangGraph agent runs:
  [generate_caption] → [generate_image] → [generate_hashtags]
        ↓
Agent PAUSES — sends preview to frontend
        ↓
User sees: Image preview | Caption editor | Hashtag editor
        ↓
User edits (optional) → Clicks "Approve & Post"
        ↓
Agent resumes → Publishes to Instagram
        ↓
Success screen with post link
```

### Input Form Fields

| Field | Type | Options | Required |
|---|---|---|---|
| Topic / Niche | Text input | Free text | ✅ |
| Tone | Dropdown | Professional, Casual, Inspirational, Humorous, Educational | ✅ |
| Post Type | Radio | Single Image, Carousel (2-10 images) | ✅ |
| Extra Instructions | Textarea | Free text | ❌ |
| Target Audience | Text | Free text | ❌ |

### Review Screen Components

- **Image Preview Panel** — Shows generated image with option to regenerate
- **Caption Editor** — Editable textarea with character counter (max 2,200)
- **Hashtag Manager** — Tag pills with add/remove, max 30 hashtags
- **Post Type Badge** — Shows Single / Carousel
- **Approve Button** — Green CTA — triggers publishing
- **Regenerate Button** — Re-runs AI generation from scratch
- **Reject/Cancel Button** — Discards draft

### State Management (LangGraph Thread)

```python
class HumanLoopState(TypedDict):
    user_id: str
    topic: str
    tone: str
    post_type: str             # "single" | "carousel"
    extra_instructions: str
    generated_caption: str
    generated_image_urls: list[str]
    generated_hashtags: list[str]
    image_prompt_used: str
    human_approved: bool
    human_edits: dict          # {caption, hashtags, image_index}
    post_id: str
    post_url: str
    status: str                # generating | awaiting_review | publishing | published | rejected | failed
    error_message: str
    created_at: str
```

---

## 7. Feature 2 — Fully Automated Auto Post

### User Configuration (One-Time Setup)

| Setting | Type | Description |
|---|---|---|
| Topic Category | Dropdown | e.g., Fitness, Tech, Food, Fashion, Business, Motivation |
| Post Frequency | Radio | Once/day, 3x/week, Once/week, Custom |
| Posting Days | Multi-select | Mon, Tue, Wed, Thu, Fri, Sat, Sun |
| Posting Time | Dropdown | Specific time OR "Best Time" (AI-determined) |
| Post Type | Radio | Single Image, Carousel |
| Brand Voice | Textarea | Description of tone/style/brand |
| Blacklist Keywords | Tags input | Words/topics to avoid |
| Auto-approve | Toggle | ON = zero human touch |

### Agent Execution Flow

```
APScheduler triggers job at configured time
        ↓
[discover_trends] — Tavily searches for trending topics
        ↓
[analyze_trend] — Claude picks best trend for the niche
        ↓
[craft_strategy] — Claude decides angle, hook, visual style
        ↓
[generate_content] — Claude writes caption + hashtags
        ↓
[generate_image] — DALL·E creates image, uploads to S3
        ↓
[find_best_time] — (if "Best Time" selected) check audience insights
        ↓
[publish] — Instagram Graph API publishes the post
        ↓
[log_result] — Save post record, send notification to user
```

### Auto Post State

```python
class AutoPostState(TypedDict):
    user_id: str
    topic_category: str
    brand_voice: str
    blacklist_keywords: list[str]
    discovered_trend: str
    trend_source_url: str
    post_angle: str
    caption: str
    hashtags: list[str]
    image_prompt: str
    image_url: str
    scheduled_time: str
    post_id: str
    post_url: str
    status: str
    error_message: str
    retry_count: int
```

---

## 8. LangGraph Agent Design

### 8.1 Human-in-Loop Graph

```python
# Key nodes and their responsibilities

generate_caption_node:
  - Input: topic, tone, extra_instructions
  - LLM: Claude claude-opus-4-5
  - Output: generated_caption (with emojis, CTA, under 200 words)

generate_image_node:
  - Input: topic, tone, caption context
  - LLM: Claude (to craft DALL·E prompt)
  - Image Gen: DALL·E 3 (1024x1024)
  - Upload: AWS S3 → returns public URL
  - Output: generated_image_urls

generate_hashtags_node:
  - Input: topic, caption
  - LLM: Claude claude-opus-4-5
  - Output: 25-30 relevant hashtags (mix of large, medium, niche)

human_review_node:
  - INTERRUPT POINT — graph pauses here
  - Frontend polls /api/post/{thread_id}/preview
  - User approves/edits/rejects via UI
  - Graph resumes via /api/post/{thread_id}/approve

apply_edits_node:
  - Merges human_edits into state
  - Formats final caption = caption + "\n\n" + hashtags

publish_node:
  - Calls Instagram Graph API (2-step: create container → publish)
  - Saves post_id and post_url
  - Updates status = "published"
```

### 8.2 Auto Agent Graph

```python
discover_trends_node:
  - Tavily search: "trending {topic_category} content Instagram {current_month}"
  - Returns top 5 results
  - Claude selects best trend

craft_strategy_node:
  - Claude analyses trend
  - Returns: hook_angle, visual_style, caption_structure as JSON

generate_content_node:
  - Claude generates caption + 30 hashtags + DALL·E image prompt
  - DALL·E generates image
  - S3 upload → public URL

find_best_time_node:
  - Calls Instagram Insights API for audience_online_followers data
  - Finds peak engagement window
  - Returns ISO datetime for posting

scheduled_publish_node:
  - Waits until scheduled time (Celery delay)
  - Calls Instagram publish API
  - Logs result

log_result_node:
  - Saves to DB: post content, metrics, timestamp, status
  - Sends in-app notification / email to user
```

### 8.3 Checkpointing

- Use `LangGraph MemorySaver` for development
- Use `LangGraph PostgresSaver` for production (persists thread state in DB)
- Thread ID = UUID generated per post attempt
- Config: `{"configurable": {"thread_id": thread_id}}`

---

## 9. Instagram API Integration

### 9.1 OAuth Flow

**Step 1 — Redirect user to Meta login:**
```
GET https://www.facebook.com/v19.0/dialog/oauth
  ?client_id={FACEBOOK_APP_ID}
  &redirect_uri={INSTAGRAM_REDIRECT_URI}
  &scope=instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement,pages_manage_posts
  &state={user_id}
  &response_type=code
```

**Step 2 — Exchange code for short-lived token:**
```
GET https://graph.facebook.com/v19.0/oauth/access_token
  ?client_id={FACEBOOK_APP_ID}
  &client_secret={FACEBOOK_APP_SECRET}
  &redirect_uri={INSTAGRAM_REDIRECT_URI}
  &code={code_from_callback}
```

**Step 3 — Exchange for long-lived token (60 days):**
```
GET https://graph.facebook.com/v19.0/oauth/access_token
  ?grant_type=fb_exchange_token
  &client_id={FACEBOOK_APP_ID}
  &client_secret={FACEBOOK_APP_SECRET}
  &fb_exchange_token={short_lived_token}
```

**Step 4 — Get Instagram Business Account ID:**
```
GET /me/accounts → get page_id + page_access_token
GET /{page_id}?fields=instagram_business_account → get ig_account_id
```

Store in DB: `user_id`, `access_token`, `ig_account_id`, `token_expires_at`

### 9.2 Token Refresh

- Tokens last 60 days
- Run a cron job every 45 days to refresh tokens
- Endpoint: `GET /oauth/access_token?grant_type=fb_exchange_token&...`
- Alert user if refresh fails (re-auth required)

### 9.3 Publishing — Single Image Post

```
Step 1: Create container
POST /{ig_account_id}/media
  Body: image_url, caption, access_token

Step 2: Wait 3-5 seconds

Step 3: Publish
POST /{ig_account_id}/media_publish
  Body: creation_id={container_id}, access_token
```

### 9.4 Publishing — Carousel Post

```
Step 1: Create child containers (one per image)
POST /{ig_account_id}/media
  Body: image_url, is_carousel_item=true, access_token

Step 2: Create carousel container
POST /{ig_account_id}/media
  Body: media_type=CAROUSEL, children={ids}, caption, access_token

Step 3: Publish carousel
POST /{ig_account_id}/media_publish
  Body: creation_id={carousel_container_id}, access_token
```

### 9.5 API Rate Limits

| Limit | Value |
|---|---|
| Max posts per day | 25 per Instagram account |
| Max carousel images | 10 per post |
| Caption max length | 2,200 characters |
| Hashtags max | 30 per post |
| API calls per hour | 200 (Graph API standard) |

---

## 10. Image Generation Pipeline

### Flow

```
LLM generates image prompt
      ↓
DALL·E 3 API call (1024x1024, HD quality)
      ↓
Download image bytes
      ↓
Optimize/resize if needed (Pillow)
      ↓
Upload to S3 bucket (public-read ACL)
      ↓
Return public S3 URL
      ↓
Pass to Instagram API as image_url
```

### Image Specs for Instagram

| Post Type | Recommended Size | Aspect Ratio |
|---|---|---|
| Square Feed | 1080x1080 | 1:1 |
| Portrait Feed | 1080x1350 | 4:5 |
| Landscape Feed | 1080x566 | 1.91:1 |
| Story | 1080x1920 | 9:16 |

> **DALL·E Output:** 1024x1024 — resize to 1080x1080 using Pillow before upload.

### S3 Bucket Policy (must be public)

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::agenticpilot-media/*"
  }]
}
```

---

## 11. Trend Discovery Pipeline

### Tools Used

- **Tavily API** — Real-time web search for trending content
- **Claude** — Filters and ranks trends by engagement potential

### Search Queries by Category

| Category | Tavily Search Query |
|---|---|
| Fitness | `trending fitness workout tips Instagram {month} {year}` |
| Tech | `viral technology news social media {month} {year}` |
| Food | `trending food recipes viral Instagram {month} {year}` |
| Business | `entrepreneur motivation trending LinkedIn Instagram {month} {year}` |
| Fashion | `fashion trends Instagram viral {season} {year}` |
| Motivation | `motivational quotes trending Instagram {month} {year}` |

### Trend Scoring Criteria (Claude prompt)

Claude evaluates each trend on:
1. **Recency** — Is it happening now?
2. **Visual potential** — Can it make a compelling image?
3. **Engagement likelihood** — Will it resonate with the niche audience?
4. **Brand safety** — Does it avoid controversy?
5. **Uniqueness** — Not overposted yet

---

## 12. Database Schema

### Table: `users`
```sql
id              UUID PRIMARY KEY
email           VARCHAR UNIQUE NOT NULL
name            VARCHAR
created_at      TIMESTAMP
plan            VARCHAR   -- free | pro | business
```

### Table: `instagram_connections`
```sql
id                  UUID PRIMARY KEY
user_id             UUID REFERENCES users(id)
ig_account_id       VARCHAR NOT NULL
page_id             VARCHAR
access_token        TEXT NOT NULL  -- encrypted at rest
token_expires_at    TIMESTAMP
username            VARCHAR
profile_picture     VARCHAR
connected_at        TIMESTAMP
is_active           BOOLEAN DEFAULT TRUE
```

### Table: `posts`
```sql
id                  UUID PRIMARY KEY
user_id             UUID REFERENCES users(id)
ig_account_id       VARCHAR
mode                VARCHAR   -- assisted | auto
thread_id           VARCHAR   -- LangGraph thread ID
topic               VARCHAR
caption             TEXT
hashtags            TEXT[]
image_urls          TEXT[]
image_prompts       TEXT[]
trend_discovered    VARCHAR
status              VARCHAR   -- draft | awaiting_review | publishing | published | failed
ig_post_id          VARCHAR   -- returned by Instagram after publish
ig_post_url         VARCHAR
error_message       TEXT
scheduled_for       TIMESTAMP
published_at        TIMESTAMP
created_at          TIMESTAMP
```

### Table: `auto_post_configs`
```sql
id                  UUID PRIMARY KEY
user_id             UUID REFERENCES users(id)
ig_account_id       VARCHAR
topic_category      VARCHAR
brand_voice         TEXT
blacklist_keywords  TEXT[]
frequency           VARCHAR   -- daily | 3x_week | weekly | custom
posting_days        VARCHAR[] -- ["mon", "wed", "fri"]
posting_time        VARCHAR   -- "09:00" or "best_time"
post_type           VARCHAR   -- single | carousel
is_active           BOOLEAN DEFAULT TRUE
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

### Table: `post_analytics`
```sql
id              UUID PRIMARY KEY
post_id         UUID REFERENCES posts(id)
impressions     INTEGER
reach           INTEGER
likes           INTEGER
comments        INTEGER
saves           INTEGER
shares          INTEGER
fetched_at      TIMESTAMP
```

---

## 13. Backend API Endpoints

### Auth & Connection

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/instagram/auth-url` | Returns Meta OAuth URL for user to connect |
| GET | `/auth/instagram/callback` | Handles OAuth redirect, stores token |
| DELETE | `/api/instagram/disconnect` | Revokes token, removes connection |
| GET | `/api/instagram/status` | Returns connection status for current user |

### Mode 1 — Assisted Post

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/post/generate` | Start generation — returns `thread_id` |
| GET | `/api/post/{thread_id}/preview` | Poll for generated content |
| POST | `/api/post/{thread_id}/approve` | Approve (with optional edits) |
| POST | `/api/post/{thread_id}/reject` | Reject and discard |
| POST | `/api/post/{thread_id}/regenerate` | Re-run AI generation |
| GET | `/api/post/history` | List all posts for user |

### Mode 2 — Auto Post

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/autopost/config` | Save/update auto-post configuration |
| GET | `/api/autopost/config` | Get current config |
| POST | `/api/autopost/enable` | Enable auto-posting |
| POST | `/api/autopost/disable` | Pause auto-posting |
| POST | `/api/autopost/run-now` | Trigger an immediate auto post |
| GET | `/api/autopost/queue` | View upcoming scheduled posts |
| DELETE | `/api/autopost/queue/{job_id}` | Cancel a scheduled post |

### Analytics

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/analytics/posts` | Post performance overview |
| GET | `/api/analytics/posts/{post_id}` | Single post metrics |
| POST | `/api/analytics/sync` | Trigger Instagram insights fetch |

---

## 14. Frontend UI Requirements

### Pages & Components

#### `/dashboard/instagram`
- Instagram connection card (Connect / Disconnect)
- Quick stats: Posts this month, Avg engagement, Next scheduled post
- Recent posts grid

#### `/dashboard/instagram/create`
- **Step 1 — Input Form:** Topic, Tone, Post Type, Extra instructions
- **Step 2 — Generating:** Animated loader showing agent steps in real-time
- **Step 3 — Review Panel:**
  - Left: Image preview with "Regenerate Image" button
  - Right: Caption textarea (editable), Hashtag pills (editable), Post type badge
  - Bottom: Approve button, Regenerate All button, Cancel button
- **Step 4 — Success:** Post published confirmation with Instagram link

#### `/dashboard/instagram/auto-post`
- Auto Post toggle (Enable/Disable)
- Configuration form (Category, Frequency, Time, Brand Voice)
- Upcoming posts queue table
- Post history with status badges

#### `/dashboard/instagram/analytics`
- Posts performance table
- Engagement chart (line graph over time)
- Top performing posts grid

### Key UX Rules

- Show real-time agent progress during generation (SSE or WebSocket)
- Caption editor must show live character count
- Hashtag input must prevent adding more than 30 tags
- Show loading state during Instagram API publish call
- Handle errors gracefully — show retry option on API failure
- Mobile responsive — users may approve posts on mobile

---

## 15. Scheduling & Queue System

### Tools: Celery + Redis + APScheduler

```
User saves auto-post config
        ↓
APScheduler creates recurring job (cron trigger)
        ↓
At scheduled time → Celery task is dispatched
        ↓
Celery worker runs the LangGraph auto agent
        ↓
On success → log to DB, notify user
On failure → retry up to 3 times with exponential backoff
On 3rd failure → notify user, pause auto-post
```

### Celery Task Structure

```python
@celery_app.task(bind=True, max_retries=3)
def run_auto_post_task(self, user_id: str, config_id: str):
    try:
        result = auto_graph.invoke(build_state_from_config(config_id))
        log_post_success(result)
    except Exception as e:
        self.retry(exc=e, countdown=60 * (2 ** self.request.retries))
```

### Daily Limits Guard

Before every publish attempt, check:
```python
posts_today = count_posts_today(ig_account_id)
if posts_today >= 24:  # leave 1 buffer below Meta's 25/day limit
    raise DailyLimitReachedException()
```

---

## 16. Error Handling & Edge Cases

| Scenario | Handling |
|---|---|
| Instagram token expired | Auto-refresh; if fails, notify user to reconnect |
| Image URL not accessible by Meta | Re-upload to S3 and retry |
| DALL·E API down | Fall back to Stability AI or notify user |
| Meta API 429 (rate limit) | Exponential backoff retry |
| Post container creation failed | Retry up to 3 times, then fail gracefully |
| Trend discovery returns no results | Fall back to user's last successful topic |
| Caption > 2,200 chars | Auto-truncate at last complete sentence before limit |
| > 30 hashtags generated | Auto-trim to top 30 by relevance score |
| User disconnects Instagram mid-job | Cancel job, clean up S3 files, notify user |
| Celery worker crash | Job re-queued automatically via Celery retry |

---

## 17. Security Requirements

- All Instagram access tokens must be **encrypted at rest** in the database (AES-256)
- OAuth `state` parameter must equal the internal `user_id` to prevent CSRF
- S3 image URLs should use time-limited pre-signed URLs for internal use; only make public the final upload
- All API endpoints must be protected by JWT authentication
- Rate limit AgenticPilot's own API: max 10 post generation requests per user per hour
- Input sanitisation on all user-provided text (topic, brand voice, caption edits)
- Never log access tokens in application logs

---

## 18. Meta App Review Requirements

Before going live to all users, Meta requires App Review for the permissions used.

### Permissions to Submit for Review

| Permission | Type | Review Required |
|---|---|---|
| `instagram_basic` | Standard | No (available in dev mode) |
| `instagram_content_publish` | Advanced | **Yes** |
| `pages_show_list` | Standard | No |
| `pages_read_engagement` | Standard | No |
| `pages_manage_posts` | Advanced | **Yes** |

### What Meta Requires in the Review Submission

1. **Screen recording** demonstrating your app publishing a post to Instagram
2. **Written description** of exactly how `instagram_content_publish` is used
3. **Privacy Policy URL** — must be live and reachable
4. **Business Verification** — Meta Business account must be verified
5. **Test user credentials** — provide a test Instagram account for Meta reviewers

### While Awaiting App Review (Dev Mode)

- You can test with up to **5 manually added Instagram test accounts**
- Add test users via: Meta Developer Dashboard → Your App → Roles → Test Users
- Test accounts must **accept** the tester invite from their Instagram app

---

## 19. Development Phases

### Phase 1 — Foundation (Week 1-2)
- [ ] Set up Meta Developer App with correct use cases
- [ ] Implement OAuth flow (connect/disconnect Instagram)
- [ ] Store and encrypt tokens in DB
- [ ] Build Instagram publisher class (single image)
- [ ] Test manual publish via Python script
- [ ] Set up S3 bucket with public policy
- [ ] Set up `.env` with all keys

### Phase 2 — Mode 1 Agent (Week 3-4)
- [ ] Build LangGraph human-in-loop graph
- [ ] Integrate Claude for caption + hashtag generation
- [ ] Integrate DALL·E 3 for image generation
- [ ] Implement LangGraph interrupt at human_review node
- [ ] Build FastAPI endpoints for generate / preview / approve
- [ ] Build frontend Review Panel UI
- [ ] End-to-end test: Generate → Review → Post

### Phase 3 — Mode 2 Agent (Week 5-6)
- [ ] Build LangGraph auto agent graph
- [ ] Integrate Tavily for trend discovery
- [ ] Add Claude trend analysis and strategy nodes
- [ ] Set up Celery + Redis task queue
- [ ] Build APScheduler recurring job system
- [ ] Build frontend Auto Post config UI
- [ ] Test scheduled auto post end-to-end

### Phase 4 — Analytics & Polish (Week 7)
- [ ] Build Instagram Insights sync (fetch post metrics)
- [ ] Build analytics dashboard
- [ ] Add token refresh cron job
- [ ] Add daily post limit guard
- [ ] Error notifications to users
- [ ] Mobile-responsive UI pass

### Phase 5 — Meta App Review (Week 8)
- [ ] Record demo video for Meta review
- [ ] Write privacy policy
- [ ] Submit App Review for `instagram_content_publish`
- [ ] Test with 5 test user accounts
- [ ] Fix any issues from review feedback

---

*Document maintained by AgenticPilot Engineering.*  
*Update this PRD as requirements evolve.*
