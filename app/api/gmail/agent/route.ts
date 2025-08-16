import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createGmailClient } from '@/lib/gmail-oauth';
import { z } from 'zod';

// Validation schema for agent configuration
const agentConfigSchema = z.object({
  action: z.enum(['start', 'stop', 'configure', 'run']),
  settings: z.object({
    autoReplyEnabled: z.boolean().default(false),
    checkInterval: z.number().min(1).max(60).default(5), // minutes
    maxEmailsPerRun: z.number().min(1).max(50).default(10),
    confidenceThreshold: z.number().min(0).max(1).default(0.8),
    onlyUnread: z.boolean().default(true),
  }).optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Get current user
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = agentConfigSchema.parse(body);

    switch (validatedData.action) {
      case 'configure':
        // Update Gmail settings
        const { error: updateError } = await supabase
          .from('gmail_settings')
          .upsert({
            user_id: user.id,
            auto_reply_enabled: validatedData.settings?.autoReplyEnabled || false,
            check_interval: validatedData.settings?.checkInterval || 5,
            updated_at: new Date().toISOString(),
          });

        if (updateError) {
          throw new Error(`Failed to update settings: ${updateError.message}`);
        }

        return NextResponse.json({
          success: true,
          message: 'Gmail agent configured successfully',
        });

      case 'start':
        // Enable Gmail automation
        const { error: startError } = await supabase
          .from('gmail_settings')
          .upsert({
            user_id: user.id,
            is_enabled: true,
            updated_at: new Date().toISOString(),
          });

        if (startError) {
          throw new Error(`Failed to start agent: ${startError.message}`);
        }

        return NextResponse.json({
          success: true,
          message: 'Gmail agent started successfully',
        });

      case 'stop':
        // Disable Gmail automation
        const { error: stopError } = await supabase
          .from('gmail_settings')
          .update({
            is_enabled: false,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);

        if (stopError) {
          throw new Error(`Failed to stop agent: ${stopError.message}`);
        }

        return NextResponse.json({
          success: true,
          message: 'Gmail agent stopped successfully',
        });

      case 'run':
        // Run Gmail automation immediately
        const result = await runGmailAgent(user.id, validatedData.settings);
        return NextResponse.json(result);

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Gmail agent error:', error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Gmail agent operation failed' },
      { status: 500 }
    );
  }
}

// Function to run the Gmail agent
async function runGmailAgent(userId: string, settings?: any) {
  try {
    // Create Gmail client
    const gmail = await createGmailClient(userId);
    
    // Create Supabase client
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );

    const maxEmails = settings?.maxEmailsPerRun || 10;
    const onlyUnread = settings?.onlyUnread !== false;
    const confidenceThreshold = settings?.confidenceThreshold || 0.8;

    // Get unread emails
    const query = onlyUnread ? 'is:unread' : 'in:inbox';
    const messagesResponse = await gmail.users.messages.list({
      userId: 'me',
      maxResults: maxEmails,
      q: query,
    });

    const messages = messagesResponse.data.messages || [];
    let processedCount = 0;
    let repliedCount = 0;
    let escalatedCount = 0;

    // Get user's business info and templates
    const { data: businessInfo } = await supabase
      .from('business_info')
      .select('*')
      .eq('user_id', userId)
      .single();

    const { data: templates } = await supabase
      .from('gmail_templates')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);

    // Process each message
    for (const message of messages.slice(0, maxEmails)) {
      try {
        // Get full message details
        const messageDetail = await gmail.users.messages.get({
          userId: 'me',
          id: message.id!,
          format: 'full',
        });

        const msg = messageDetail.data;
        const headers = msg.payload?.headers || [];
        
        const getHeader = (name: string) => 
          headers.find(h => h.name?.toLowerCase() === name.toLowerCase())?.value || '';

        const subject = getHeader('Subject');
        const from = getHeader('From');

        // Simple classification logic (this would be enhanced with AI/LangChain in real implementation)
        const emailType = classifyEmail(subject, msg.snippet || '');
        
        // Get appropriate template
        const template = templates?.find(t => t.type === emailType);
        
        if (template && businessInfo) {
          // Generate reply (simplified - would use LangChain/OpenAI in real implementation)
          const reply = generateReply(emailType, subject, msg.snippet || '', template.template, businessInfo);
          
          // Mock confidence score (would come from AI in real implementation)
          const confidence = Math.random() * 0.4 + 0.6; // Random between 0.6-1.0

          if (confidence >= confidenceThreshold) {
            // Send reply
            const replyEmail = buildReplyEmail(from, subject, reply, message.id!);
            
            await gmail.users.messages.send({
              userId: 'me',
              requestBody: {
                raw: replyEmail,
              },
            });

            // Mark as read
            await gmail.users.messages.modify({
              userId: 'me',
              id: message.id!,
              requestBody: {
                removeLabelIds: ['UNREAD'],
              },
            });

            repliedCount++;

            // Log the action
            await supabase.from('gmail_logs').insert({
              user_id: userId,
              email_id: message.id,
              email_subject: subject,
              email_from: from,
              email_type: emailType,
              action: 'auto_reply',
              reply_text: reply,
              confidence: confidence,
            });
          } else {
            // Escalate for human review
            escalatedCount++;
            
            await supabase.from('gmail_logs').insert({
              user_id: userId,
              email_id: message.id,
              email_subject: subject,
              email_from: from,
              email_type: emailType,
              action: 'escalated',
              reply_text: reply,
              confidence: confidence,
            });
          }
        }

        processedCount++;
      } catch (error) {
        console.error(`Failed to process message ${message.id}:`, error);
      }
    }

    return {
      success: true,
      message: 'Gmail agent completed successfully',
      results: {
        processed: processedCount,
        replied: repliedCount,
        escalated: escalatedCount,
        total: messages.length,
      },
    };

  } catch (error) {
    console.error('Gmail agent run error:', error);
    throw error;
  }
}

// Simple email classification (would be enhanced with AI)
function classifyEmail(subject: string, snippet: string): string {
  const text = (subject + ' ' + snippet).toLowerCase();
  
  if (text.includes('review') || text.includes('feedback') || text.includes('rating')) {
    return 'review';
  }
  
  if (text.includes('question') || text.includes('help') || text.includes('support') || text.includes('how')) {
    return 'inquiry';
  }
  
  return 'other';
}

// Simple reply generation (would be enhanced with LangChain/OpenAI)
function generateReply(type: string, subject: string, snippet: string, template: string, businessInfo: any): string {
  const businessName = businessInfo.business_name || 'Our Team';
  
  let reply = template;
  reply = reply.replace('{business_name}', businessName);
  reply = reply.replace('{subject}', subject);
  
  if (type === 'review') {
    reply += '\n\nThank you for taking the time to share your feedback with us!';
  } else if (type === 'inquiry') {
    reply += '\n\nWe have received your inquiry and will provide a detailed response shortly.';
  }
  
  reply += `\n\nBest regards,\n${businessName}`;
  
  return reply;
}

// Build reply email in RFC 2822 format
function buildReplyEmail(to: string, originalSubject: string, body: string, inReplyTo: string): string {
  const subject = originalSubject.startsWith('Re: ') ? originalSubject : `Re: ${originalSubject}`;
  
  const emailLines = [
    `To: ${to}`,
    `Subject: ${subject}`,
    `In-Reply-To: ${inReplyTo}`,
    'Content-Type: text/plain; charset=utf-8',
    '',
    body,
  ];

  return Buffer.from(emailLines.join('\r\n'))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
