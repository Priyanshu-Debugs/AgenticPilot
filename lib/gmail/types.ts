// Gmail TypeScript Types
// Clean, well-defined types for the Gmail automation system

export interface GmailToken {
    access_token: string
    refresh_token: string
    expires_at: string  // timestamptz format
    token_type: string
    scope: string
}

export interface GmailMessage {
    id: string
    threadId: string
    from: string
    to: string
    subject: string
    snippet: string
    body: string
    date: string
    isUnread: boolean
    labels: string[]
}

export interface EmailAnalysis {
    type: 'inquiry' | 'support' | 'complaint' | 'feedback' | 'spam' | 'other'
    sentiment: 'positive' | 'neutral' | 'negative'
    urgency: 'low' | 'medium' | 'high'
    confidence: number
    suggestedReply: string
    summary: string
    keywords: string[]
}

export interface GmailSettings {
    userId: string
    isConnected: boolean
    autoReplyEnabled: boolean
    confidenceThreshold: number
    defaultTone: 'professional' | 'friendly' | 'formal' | 'casual'
    maxEmailsPerRun: number
    workingHoursOnly: boolean
    workingHoursStart: number
    workingHoursEnd: number
}

export interface EmailTemplate {
    id: string
    name: string
    subject: string
    body: string
    type: string
    tone: string
    isActive: boolean
    usageCount: number
}

export interface GmailLog {
    id: string
    userId: string
    emailId: string
    emailSubject: string
    emailFrom: string
    action: 'analyzed' | 'replied' | 'skipped' | 'error'
    replyText?: string
    confidence: number
    responseTimeMs: number
    success: boolean
    errorMessage?: string
    createdAt: string
}

export interface GmailStats {
    totalProcessed: number
    totalReplied: number
    avgResponseTime: number
    successRate: number
}
