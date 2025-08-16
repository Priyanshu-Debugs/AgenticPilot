import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createGmailClient } from '@/lib/gmail-oauth';
import { z } from 'zod';

// Validation schema for sending emails
const sendEmailSchema = z.object({
  to: z.string().email('Invalid recipient email'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Email body is required'),
  cc: z.string().email().optional(),
  bcc: z.string().email().optional(),
  replyTo: z.string().email().optional(),
  inReplyTo: z.string().optional(), // Message ID this is replying to
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
    const validatedData = sendEmailSchema.parse(body);

    // Create Gmail client
    const gmail = await createGmailClient(user.id);

    // Build email message
    const emailLines = [
      `To: ${validatedData.to}`,
      `Subject: ${validatedData.subject}`,
    ];

    if (validatedData.cc) emailLines.push(`Cc: ${validatedData.cc}`);
    if (validatedData.bcc) emailLines.push(`Bcc: ${validatedData.bcc}`);
    if (validatedData.replyTo) emailLines.push(`Reply-To: ${validatedData.replyTo}`);
    if (validatedData.inReplyTo) emailLines.push(`In-Reply-To: ${validatedData.inReplyTo}`);

    emailLines.push('Content-Type: text/plain; charset=utf-8');
    emailLines.push(''); // Empty line before body
    emailLines.push(validatedData.body);

    const rawEmail = emailLines.join('\r\n');
    const encodedEmail = Buffer.from(rawEmail).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    // Send email
    const sendResponse = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedEmail,
      },
    });

    // Log the sent email
    await supabase.from('gmail_logs').insert({
      user_id: user.id,
      email_id: sendResponse.data.id,
      email_subject: validatedData.subject,
      email_type: 'outbound',
      action: 'sent',
      reply_text: validatedData.body,
      confidence: 1.0, // Manual send has full confidence
    });

    return NextResponse.json({
      success: true,
      messageId: sendResponse.data.id,
      message: 'Email sent successfully',
    });

  } catch (error) {
    console.error('Gmail send error:', error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
