import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createGmailClient } from '@/lib/gmail-oauth';
import { z } from 'zod';

// Validation schema for modifying emails
const modifyEmailSchema = z.object({
  messageIds: z.array(z.string()).min(1, 'At least one message ID is required'),
  action: z.enum(['markAsRead', 'markAsUnread', 'addLabel', 'removeLabel', 'archive', 'trash', 'delete']),
  labelId: z.string().optional(), // Required for addLabel/removeLabel actions
});

export async function PATCH(req: NextRequest) {
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
    const validatedData = modifyEmailSchema.parse(body);

    // Validate labelId is provided for label actions
    if (['addLabel', 'removeLabel'].includes(validatedData.action) && !validatedData.labelId) {
      return NextResponse.json(
        { error: 'labelId is required for label actions' },
        { status: 400 }
      );
    }

    // Create Gmail client
    const gmail = await createGmailClient(user.id);

    const results = [];

    // Process each message
    for (const messageId of validatedData.messageIds) {
      try {
        let response;

        switch (validatedData.action) {
          case 'markAsRead':
            response = await gmail.users.messages.modify({
              userId: 'me',
              id: messageId,
              requestBody: {
                removeLabelIds: ['UNREAD'],
              },
            });
            break;

          case 'markAsUnread':
            response = await gmail.users.messages.modify({
              userId: 'me',
              id: messageId,
              requestBody: {
                addLabelIds: ['UNREAD'],
              },
            });
            break;

          case 'addLabel':
            response = await gmail.users.messages.modify({
              userId: 'me',
              id: messageId,
              requestBody: {
                addLabelIds: [validatedData.labelId!],
              },
            });
            break;

          case 'removeLabel':
            response = await gmail.users.messages.modify({
              userId: 'me',
              id: messageId,
              requestBody: {
                removeLabelIds: [validatedData.labelId!],
              },
            });
            break;

          case 'archive':
            response = await gmail.users.messages.modify({
              userId: 'me',
              id: messageId,
              requestBody: {
                removeLabelIds: ['INBOX'],
              },
            });
            break;

          case 'trash':
            response = await gmail.users.messages.trash({
              userId: 'me',
              id: messageId,
            });
            break;

          case 'delete':
            response = await gmail.users.messages.delete({
              userId: 'me',
              id: messageId,
            });
            break;

          default:
            throw new Error(`Unknown action: ${validatedData.action}`);
        }

        results.push({
          messageId,
          success: true,
          data: response?.data,
        });

        // Log the action
        await supabase.from('gmail_logs').insert({
          user_id: user.id,
          email_id: messageId,
          email_subject: `Modified: ${validatedData.action}`,
          email_type: 'modification',
          action: validatedData.action,
          reply_text: validatedData.labelId || null,
          confidence: 1.0,
        });

      } catch (error) {
        console.error(`Failed to modify message ${messageId}:`, error);
        results.push({
          messageId,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    return NextResponse.json({
      success: failureCount === 0,
      message: `Modified ${successCount} messages successfully${failureCount > 0 ? `, ${failureCount} failed` : ''}`,
      results,
      summary: {
        total: validatedData.messageIds.length,
        successful: successCount,
        failed: failureCount,
      },
    });

  } catch (error) {
    console.error('Gmail modify error:', error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to modify emails' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve available labels
export async function GET(req: NextRequest) {
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

    // Create Gmail client
    const gmail = await createGmailClient(user.id);

    // Get all labels
    const labelsResponse = await gmail.users.labels.list({
      userId: 'me',
    });

    const labels = labelsResponse.data.labels || [];

    // Categorize labels
    const systemLabels = labels.filter(label => label.type === 'system');
    const userLabels = labels.filter(label => label.type === 'user');

    return NextResponse.json({
      labels,
      systemLabels,
      userLabels,
      total: labels.length,
    });

  } catch (error) {
    console.error('Gmail labels error:', error);
    return NextResponse.json(
      { error: 'Failed to get labels' },
      { status: 500 }
    );
  }
}
