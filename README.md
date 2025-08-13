# AgenticPilot - AI Automation Dashboard

A modern, responsive dashboard for managing AI automation workflows including Gmail auto-reply, Instagram scheduling, and inventory management.

## 🚀 Features

- **Gmail Automation**: Automatic email responses and filtering
- **Instagram Management**: Post scheduling and engagement analytics  
- **Inventory Tracking**: Stock monitoring and alert systems
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Dark/Light Theme**: System theme detection and manual toggle
- **Real-time Updates**: Live status monitoring for all automations

## 🛠️ Tech Stack

- **Framework**: Next.js 15.2.4 with React 19
- **Styling**: Tailwind CSS 4.1.9 with shadcn/ui components
- **Icons**: Lucide React
- **TypeScript**: Full type safety
- **Theme**: next-themes for dark/light mode

## 📁 Project Structure

```
AgenticPilot/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles and theme variables
│   ├── layout.tsx               # Root layout with theme provider
│   ├── page.tsx                 # Landing page
│   ├── auth/                    # Authentication pages
│   │   ├── signin/page.tsx      # Sign in form
│   │   └── signup/page.tsx      # Sign up form
│   └── dashboard/               # Dashboard pages
│       ├── layout.tsx           # Dashboard layout with sidebar/navbar
│       ├── page.tsx             # Main dashboard overview
│       ├── gmail/page.tsx       # Gmail automation interface
│       ├── instagram/page.tsx   # Instagram automation interface
│       └── inventory/page.tsx   # Inventory management interface
├── components/                   # Reusable components
│   ├── ui/                      # shadcn/ui base components
│   ├── shared/                  # Custom shared components
│   │   ├── DashboardNavbar.tsx  # Fixed navigation bar
│   │   └── DashboardSidebar.tsx # Responsive sidebar navigation
│   ├── mode-toggle.tsx          # Theme toggle component
│   └── theme-provider.tsx       # Theme context provider
├── lib/                         # Utility functions
│   └── utils.ts                 # Class merging utilities
└── styles/                      # Additional stylesheets
    └── globals.css              # Legacy styles (may be redundant)
```

## 🎨 Component Architecture

### Layout Components

- **DashboardLayout**: Main layout wrapper with responsive sidebar and navbar
- **DashboardNavbar**: Fixed top navigation with user menu and notifications
- **DashboardSidebar**: Collapsible side navigation with route highlighting

### Page Components

- **Dashboard**: Overview page with automation status and quick stats
- **Gmail**: Email automation management and templates
- **Instagram**: Social media scheduling and analytics
- **Inventory**: Stock monitoring and management tools

### Design System

- **Colors**: Gray-based with blue accent (customizable via CSS variables)
- **Typography**: Responsive text sizing (sm:text-lg lg:text-xl pattern)
- **Spacing**: Mobile-first padding/margins (p-3 sm:p-4 md:p-6 lg:p-8)
- **Components**: shadcn/ui for consistent design language

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📱 Responsive Design

- **Mobile**: Sidebar slides in/out, compact navbar
- **Tablet**: Expanded sidebar, medium padding
- **Desktop**: Fixed sidebar, full navbar with all features

## 🎯 Key Features Implementation

### Fixed Navigation
- Navbar stays visible during scroll
- Sidebar with smooth slide animations
- Mobile-first responsive design

### Theme Support
- Automatic dark/light mode detection
- Manual theme toggle in navbar
- CSS variables for easy customization

### Overflow Protection
- Horizontal scroll prevention
- Responsive table containers
- Mobile-optimized content sizing

### Performance
- Next.js 15 with React 19
- Optimized bundle splitting
- Efficient re-rendering patterns

## 🚀 Deployment

The project is configured for deployment on Vercel with automatic builds from the main branch.

## 📝 Code Quality

- TypeScript for type safety
- ESLint for code quality
- Consistent component patterns
- Comprehensive inline documentation
