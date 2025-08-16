import { createGmailClient } from '@/lib/gmail-oauth';

// Helper functions for Gmail operations

export interface GmailMessage {
  id: string;
  threadId: string;
  labelIds?: string[];
  snippet?: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  body: string;
  isUnread: boolean;
  internalDate: string;
}

export interface EmailTemplate {
  id: string;
  type: 'review' | 'inquiry' | 'other';
  template: string;
  isActive: boolean;
}

export interface BusinessInfo {
  businessName?: string;
  about?: string;
  faq?: Array<{ q: string; a: string }>;
}

// Get formatted email messages
export async function getFormattedEmails(
  userId: string,
  options: {
    maxResults?: number;
    query?: string;
    labelIds?: string[];
  } = {}
): Promise<GmailMessage[]> {
  const gmail = await createGmailClient(userId);
  const { maxResults = 10, query = 'is:unread', labelIds } = options;

  const messagesResponse = await gmail.users.messages.list({
    userId: 'me',
    maxResults,
    q: query,
    labelIds,
  });

  const messages = messagesResponse.data.messages || [];

  const formattedMessages = await Promise.all(
    messages.map(async (message) => {
      const messageDetail = await gmail.users.messages.get({
        userId: 'me',
        id: message.id!,
        format: 'full',
      });

      return formatGmailMessage(messageDetail.data);
    })
  );

  return formattedMessages.filter(Boolean) as GmailMessage[];
}

// Format Gmail message object
export function formatGmailMessage(msg: any): GmailMessage | null {
  try {
    const headers = msg.payload?.headers || [];
    
    const getHeader = (name: string) => 
      headers.find((h: any) => h.name?.toLowerCase() === name.toLowerCase())?.value || '';

    const getEmailBody = (payload: any): string => {
      if (payload.body?.data) {
        return Buffer.from(payload.body.data, 'base64').toString('utf-8');
      }
      
      if (payload.parts) {
        for (const part of payload.parts) {
          if (part.mimeType === 'text/plain' || part.mimeType === 'text/html') {
            if (part.body?.data) {
              return Buffer.from(part.body.data, 'base64').toString('utf-8');
            }
          }
          const nestedBody = getEmailBody(part);
          if (nestedBody) return nestedBody;
        }
      }
      
      return '';
    };

    return {
      id: msg.id,
      threadId: msg.threadId,
      labelIds: msg.labelIds,
      snippet: msg.snippet,
      internalDate: msg.internalDate,
      subject: getHeader('Subject'),
      from: getHeader('From'),
      to: getHeader('To'),
      date: getHeader('Date'),
      body: getEmailBody(msg.payload).substring(0, 2000), // Limit body length
      isUnread: msg.labelIds?.includes('UNREAD') || false,
    };
  } catch (error) {
    console.error('Failed to format Gmail message:', error);
    return null;
  }
}

// Send a reply email
export async function sendReply(
  userId: string,
  options: {
    to: string;
    subject: string;
    body: string;
    inReplyTo?: string;
    cc?: string;
    bcc?: string;
  }
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const gmail = await createGmailClient(userId);

    const emailLines = [
      `To: ${options.to}`,
      `Subject: ${options.subject.startsWith('Re: ') ? options.subject : `Re: ${options.subject}`}`,
    ];

    if (options.cc) emailLines.push(`Cc: ${options.cc}`);
    if (options.bcc) emailLines.push(`Bcc: ${options.bcc}`);
    if (options.inReplyTo) emailLines.push(`In-Reply-To: ${options.inReplyTo}`);

    emailLines.push('Content-Type: text/plain; charset=utf-8');
    emailLines.push('');
    emailLines.push(options.body);

    const rawEmail = emailLines.join('\r\n');
    const encodedEmail = Buffer.from(rawEmail)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const sendResponse = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedEmail,
      },
    });

    return {
      success: true,
      messageId: sendResponse.data.id || undefined,
    };
  } catch (error) {
    console.error('Failed to send reply:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Classify email type (simple version - would be enhanced with AI)
export function classifyEmailType(subject: string, snippet: string): 'review' | 'inquiry' | 'other' {
  const text = (subject + ' ' + snippet).toLowerCase();
  
  const reviewKeywords = ['review', 'feedback', 'rating', 'testimonial', 'opinion', 'experience'];
  const inquiryKeywords = ['question', 'help', 'support', 'how', 'what', 'when', 'where', 'why', 'inquiry'];

  const hasReviewKeywords = reviewKeywords.some(keyword => text.includes(keyword));
  const hasInquiryKeywords = inquiryKeywords.some(keyword => text.includes(keyword));

  if (hasReviewKeywords) return 'review';
  if (hasInquiryKeywords) return 'inquiry';
  return 'other';
}

// Generate email reply using template (simple version - would be enhanced with LangChain/OpenAI)
export function generateEmailReply(
  emailType: 'review' | 'inquiry' | 'other',
  originalEmail: { subject: string; from: string; snippet: string },
  template: string,
  businessInfo: BusinessInfo
): { reply: string; confidence: number } {
  const businessName = businessInfo.businessName || 'Our Team';
  
  let reply = template;
  
  // Replace template variables
  reply = reply.replace(/\{business_name\}/g, businessName);
  reply = reply.replace(/\{subject\}/g, originalEmail.subject);
  reply = reply.replace(/\{sender_name\}/g, extractNameFromEmail(originalEmail.from));

  // Add type-specific content
  if (emailType === 'review') {
    reply += '\n\nThank you for taking the time to share your feedback with us. Your opinion helps us improve our services.';
  } else if (emailType === 'inquiry') {
    reply += '\n\nWe have received your inquiry and will provide a detailed response shortly. If this is urgent, please don\'t hesitate to call us directly.';
  }

  // Add signature
  reply += `\n\nBest regards,\n${businessName} Team`;

  // Simple confidence calculation (would be more sophisticated with AI)
  let confidence = 0.7; // Base confidence

  // Increase confidence based on template match
  if (template && template.length > 50) confidence += 0.1;
  
  // Increase confidence if business info is available
  if (businessInfo.about) confidence += 0.1;
  if (businessInfo.faq && businessInfo.faq.length > 0) confidence += 0.1;

  return {
    reply,
    confidence: Math.min(confidence, 1.0),
  };
}

// Extract name from email address
function extractNameFromEmail(email: string): string {
  // Try to extract name from "Name <email@domain.com>" format
  const match = email.match(/^([^<]+)<.*>$/);
  if (match) {
    return match[1].trim().replace(/"/g, '');
  }
  
  // Extract from email address before @
  const atIndex = email.indexOf('@');
  if (atIndex > 0) {
    return email.substring(0, atIndex).replace(/[._]/g, ' ');
  }
  
  return 'there';
}

// Mark emails as read
export async function markEmailsAsRead(userId: string, messageIds: string[]): Promise<boolean> {
  try {
    const gmail = await createGmailClient(userId);

    await Promise.all(
      messageIds.map(messageId =>
        gmail.users.messages.modify({
          userId: 'me',
          id: messageId,
          requestBody: {
            removeLabelIds: ['UNREAD'],
          },
        })
      )
    );

    return true;
  } catch (error) {
    console.error('Failed to mark emails as read:', error);
    return false;
  }
}

// Get Gmail labels
export async function getGmailLabels(userId: string) {
  try {
    const gmail = await createGmailClient(userId);
    
    const labelsResponse = await gmail.users.labels.list({
      userId: 'me',
    });

    return labelsResponse.data.labels || [];
  } catch (error) {
    console.error('Failed to get Gmail labels:', error);
    return [];
  }
}
