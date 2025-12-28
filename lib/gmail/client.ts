// Gmail API Client
// Clean wrapper for Gmail API operations

import { google, gmail_v1 } from 'googleapis'
import { createOAuth2Client, refreshTokenIfNeeded } from './oauth'
import type { GmailMessage } from './types'

// Create authenticated Gmail client
export async function getGmailClient(userId: string): Promise<gmail_v1.Gmail> {
    const tokens = await refreshTokenIfNeeded(userId)

    const oauth2Client = createOAuth2Client()
    oauth2Client.setCredentials({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
    })

    return google.gmail({ version: 'v1', auth: oauth2Client })
}

// Fetch emails from inbox
export async function fetchEmails(
    userId: string,
    options: {
        maxResults?: number
        query?: string
        unreadOnly?: boolean
    } = {}
): Promise<GmailMessage[]> {
    const gmail = await getGmailClient(userId)

    const { maxResults = 20, query = '', unreadOnly = false } = options

    let q = query
    if (unreadOnly) {
        q = q ? `${q} is:unread` : 'is:unread'
    }

    // List messages
    const listResponse = await gmail.users.messages.list({
        userId: 'me',
        maxResults,
        q: q || undefined,
    })

    const messages = listResponse.data.messages || []

    // Fetch full details for each message
    const detailedMessages = await Promise.all(
        messages.map(async (msg) => {
            try {
                const detail = await gmail.users.messages.get({
                    userId: 'me',
                    id: msg.id!,
                    format: 'full',
                })
                return parseMessage(detail.data)
            } catch (error) {
                console.error(`Error fetching message ${msg.id}:`, error)
                return null
            }
        })
    )

    return detailedMessages.filter((msg): msg is GmailMessage => msg !== null)
}

// Parse Gmail API message to our format
function parseMessage(msg: gmail_v1.Schema$Message): GmailMessage {
    const headers = msg.payload?.headers || []

    const getHeader = (name: string): string => {
        const header = headers.find(h => h.name?.toLowerCase() === name.toLowerCase())
        return header?.value || ''
    }

    // Extract body from message
    const body = extractBody(msg.payload)

    return {
        id: msg.id || '',
        threadId: msg.threadId || '',
        from: getHeader('From'),
        to: getHeader('To'),
        subject: getHeader('Subject'),
        snippet: msg.snippet || '',
        body,
        date: getHeader('Date'),
        isUnread: msg.labelIds?.includes('UNREAD') || false,
        labels: msg.labelIds || [],
    }
}

// Extract email body from payload
function extractBody(payload: gmail_v1.Schema$MessagePart | undefined): string {
    if (!payload) return ''

    // Direct body
    if (payload.body?.data) {
        return Buffer.from(payload.body.data, 'base64').toString('utf-8')
    }

    // Multipart message
    if (payload.parts) {
        for (const part of payload.parts) {
            // Prefer plain text
            if (part.mimeType === 'text/plain' && part.body?.data) {
                return Buffer.from(part.body.data, 'base64').toString('utf-8')
            }
            // Fallback to HTML
            if (part.mimeType === 'text/html' && part.body?.data) {
                return Buffer.from(part.body.data, 'base64').toString('utf-8')
            }
            // Recursive search
            const nested = extractBody(part)
            if (nested) return nested
        }
    }

    return ''
}

// Send email reply
export async function sendReply(
    userId: string,
    options: {
        to: string
        subject: string
        body: string
        inReplyTo?: string
        threadId?: string
    }
): Promise<string> {
    const gmail = await getGmailClient(userId)

    const { to, subject, body, inReplyTo, threadId } = options

    // Build email in RFC 2822 format
    const emailLines = [
        `To: ${to}`,
        `Subject: ${subject}`,
        'Content-Type: text/plain; charset=utf-8',
    ]

    if (inReplyTo) {
        emailLines.push(`In-Reply-To: ${inReplyTo}`)
        emailLines.push(`References: ${inReplyTo}`)
    }

    emailLines.push('', body)

    const rawEmail = Buffer.from(emailLines.join('\r\n'))
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')

    const response = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
            raw: rawEmail,
            threadId: threadId || undefined,
        },
    })

    return response.data.id || ''
}

// Mark email as read
export async function markAsRead(userId: string, messageId: string): Promise<void> {
    const gmail = await getGmailClient(userId)

    await gmail.users.messages.modify({
        userId: 'me',
        id: messageId,
        requestBody: {
            removeLabelIds: ['UNREAD'],
        },
    })
}

// Get single email by ID
export async function getEmail(userId: string, messageId: string): Promise<GmailMessage | null> {
    const gmail = await getGmailClient(userId)

    try {
        const response = await gmail.users.messages.get({
            userId: 'me',
            id: messageId,
            format: 'full',
        })
        return parseMessage(response.data)
    } catch (error) {
        console.error(`Error fetching email ${messageId}:`, error)
        return null
    }
}
