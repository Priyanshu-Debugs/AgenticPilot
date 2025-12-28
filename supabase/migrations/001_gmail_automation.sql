-- AgenticPilot Gmail Automation Database Schema
-- Run this in your Supabase SQL Editor

-- Gmail tokens table (stores OAuth tokens)
CREATE TABLE IF NOT EXISTS gmail_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expiry_date BIGINT NOT NULL,
  token_type TEXT DEFAULT 'Bearer',
  scope TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gmail logs table (tracks all email processing)
CREATE TABLE IF NOT EXISTS gmail_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  email_id TEXT,
  email_subject TEXT,
  email_from TEXT,
  email_type TEXT,
  action TEXT NOT NULL,
  reply_text TEXT,
  confidence DECIMAL(3,2),
  confidence_score DECIMAL(3,2),
  success BOOLEAN DEFAULT true,
  response_time_ms INTEGER,
  details TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gmail settings table
CREATE TABLE IF NOT EXISTS gmail_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  is_enabled BOOLEAN DEFAULT false,
  auto_reply_enabled BOOLEAN DEFAULT false,
  check_interval INTEGER DEFAULT 15,
  max_emails_per_run INTEGER DEFAULT 10,
  confidence_threshold DECIMAL(3,2) DEFAULT 0.70,
  default_tone TEXT DEFAULT 'professional',
  filter_unread_only BOOLEAN DEFAULT true,
  working_hours_only BOOLEAN DEFAULT false,
  working_hours_start INTEGER DEFAULT 9,
  working_hours_end INTEGER DEFAULT 18,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gmail templates table
CREATE TABLE IF NOT EXISTS gmail_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subject TEXT,
  template TEXT NOT NULL,
  type TEXT DEFAULT 'inquiry',
  tone TEXT DEFAULT 'professional',
  is_active BOOLEAN DEFAULT true,
  responses_sent INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Business info table
CREATE TABLE IF NOT EXISTS business_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  business_name TEXT,
  industry TEXT,
  description TEXT,
  faq JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User settings table (for general app settings)
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE gmail_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE gmail_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE gmail_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for gmail_logs
DROP POLICY IF EXISTS "Users can view own gmail_logs" ON gmail_logs;
DROP POLICY IF EXISTS "Users can insert own gmail_logs" ON gmail_logs;
CREATE POLICY "Users can view own gmail_logs" ON gmail_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own gmail_logs" ON gmail_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for gmail_settings
DROP POLICY IF EXISTS "Users can manage own gmail_settings" ON gmail_settings;
CREATE POLICY "Users can manage own gmail_settings" ON gmail_settings FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for gmail_templates  
DROP POLICY IF EXISTS "Users can manage own gmail_templates" ON gmail_templates;
CREATE POLICY "Users can manage own gmail_templates" ON gmail_templates FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for business_info
DROP POLICY IF EXISTS "Users can manage own business_info" ON business_info;
CREATE POLICY "Users can manage own business_info" ON business_info FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for user_settings
DROP POLICY IF EXISTS "Users can manage own user_settings" ON user_settings;
CREATE POLICY "Users can manage own user_settings" ON user_settings FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for notifications
DROP POLICY IF EXISTS "Users can manage own notifications" ON notifications;
CREATE POLICY "Users can manage own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_gmail_logs_user_id ON gmail_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_gmail_logs_created_at ON gmail_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gmail_templates_user_id ON gmail_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
