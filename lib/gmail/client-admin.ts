// Gmail API Client (Admin / Cron version)
// Uses admin OAuth functions — no cookies needed

import { google, gmail_v1 } from 'googleapis'
import { createOAuth2Client } from './oauth'
import { refreshTokenIfNeededAdmin } from './oauth-admin'
import type { GmailMessage } from './types'

// Create authenticated Gmail client (admin version)
export async function getGmailClientAdmin(userId: string): Promise<gmail_v1.Gmail> {
    const tokens = await refreshTokenIfNeededAdmin(userId)

    const oauth2Client = createOAuth2Client()
    oauth2Client.setCredentials({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
    })

    return google.gmail({ version: 'v1', auth: oauth2Client })
}

// Fetch emails from inbox (admin version)
export async function fetchEmailsAdmin(
    userId: string,
    options: {
        maxResults?: number
        query?: string
        unreadOnly?: boolean
    } = {}
): Promise<GmailMessage[]> {
    const gmail = await getGmailClientAdmin(userId)

    const { maxResults = 20, query = '', unreadOnly = false } = options

    let q = query
    if (unreadOnly) {
        q = q ? `${q} is:unread` : 'is:unread'
    }

    const listResponse = await gmail.users.messages.list({
        userId: 'me',
        maxResults,
        q: q || undefined,
    })

    const messages = listResponse.data.messages || []

    const emailPromises = messages.map(async (msg) => {
        const detail = await gmail.users.messages.get({
            userId: 'me',
            id: msg.id!,
            format: 'metadata',
            metadataHeaders: ['From', 'To', 'Subject', 'Date'],
        })

        const headers = detail.data.payload?.headers || []
        const getHeader = (name: string) =>
            headers.find(h => h.name?.toLowerCase() === name.toLowerCase())?.value || ''

        return {
            id: msg.id!,
            threadId: detail.data.threadId || '',
            from: getHeader('From'),
            to: getHeader('To'),
            subject: getHeader('Subject'),
            date: getHeader('Date'),
            snippet: detail.data.snippet || '',
            body: detail.data.snippet || '', // Use snippet for analysis
            isUnread: detail.data.labelIds?.includes('UNREAD') || false,
        } as GmailMessage
    })

    return Promise.all(emailPromises)
}

// Get single email details (admin version)
export async function getEmailAdmin(userId: string, emailId: string): Promise<GmailMessage | null> {
    const gmail = await getGmailClientAdmin(userId)

    try {
        const detail = await gmail.users.messages.get({
            userId: 'me',
            id: emailId,
            format: 'full',
        })

        const headers = detail.data.payload?.headers || []
        const getHeader = (name: string) =>
            headers.find(h => h.name?.toLowerCase() === name.toLowerCase())?.value || ''

        // Extract body
        let body = ''
        const payload = detail.data.payload
        if (payload?.body?.data) {
            body = Buffer.from(payload.body.data, 'base64').toString('utf-8')
        } else if (payload?.parts) {
            const textPart = payload.parts.find(p => p.mimeType === 'text/plain')
            if (textPart?.body?.data) {
                body = Buffer.from(textPart.body.data, 'base64').toString('utf-8')
            }
        }

        return {
            id: emailId,
            threadId: detail.data.threadId || '',
            from: getHeader('From'),
            to: getHeader('To'),
            subject: getHeader('Subject'),
            date: getHeader('Date'),
            snippet: detail.data.snippet || '',
            body: body || detail.data.snippet || '',
            isUnread: detail.data.labelIds?.includes('UNREAD') || false,
        } as GmailMessage
    } catch {
        return null
    }
}

// Send reply (admin version)
export async function sendReplyAdmin(
    userId: string,
    options: {
        to: string
        subject: string
        body: string
        inReplyTo?: string
        threadId?: string
    }
): Promise<string> {
    const gmail = await getGmailClientAdmin(userId)

    const { to, subject, body, inReplyTo, threadId } = options

    const rawEmail = [
        `To: ${to}`,
        `Subject: ${subject}`,
        `Content-Type: text/plain; charset=utf-8`,
        inReplyTo ? `In-Reply-To: ${inReplyTo}` : '',
        inReplyTo ? `References: ${inReplyTo}` : '',
        '',
        body,
    ].filter(Boolean).join('\r\n')

    const encodedMessage = Buffer.from(rawEmail)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')

    const response = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
            raw: encodedMessage,
            threadId: threadId || undefined,
        },
    })

    return response.data.id || ''
}

// Mark email as read (admin version)
export async function markAsReadAdmin(userId: string, emailId: string): Promise<void> {
    const gmail = await getGmailClientAdmin(userId)

    await gmail.users.messages.modify({
        userId: 'me',
        id: emailId,
        requestBody: {
            removeLabelIds: ['UNREAD'],
        },
    })
}
