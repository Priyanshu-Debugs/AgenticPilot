import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createGmailClient } from '@/lib/gmail-oauth';

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

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const maxResults = parseInt(searchParams.get('maxResults') || '10');
    const query = searchParams.get('q') || 'is:unread';
    const labelIds = searchParams.get('labelIds')?.split(',') || undefined;

    // Create Gmail client
    const gmail = await createGmailClient(user.id);

    // List messages
    const messagesResponse = await gmail.users.messages.list({
      userId: 'me',
      maxResults,
      q: query,
      labelIds,
    });

    const messages = messagesResponse.data.messages || [];

    // Get detailed message data
    const detailedMessages = await Promise.all(
      messages.slice(0, 10).map(async (message) => {
        try {
          const messageDetail = await gmail.users.messages.get({
            userId: 'me',
            id: message.id!,
            format: 'full',
          });

          const msg = messageDetail.data;
          const headers = msg.payload?.headers || [];
          
          // Extract common headers
          const getHeader = (name: string) => 
            headers.find(h => h.name?.toLowerCase() === name.toLowerCase())?.value || '';

          // Extract email body
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
                // Recursive search for nested parts
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
            historyId: msg.historyId,
            internalDate: msg.internalDate,
            subject: getHeader('Subject'),
            from: getHeader('From'),
            to: getHeader('To'),
            date: getHeader('Date'),
            body: getEmailBody(msg.payload).substring(0, 1000), // Limit body length
            isUnread: msg.labelIds?.includes('UNREAD') || false,
          };
        } catch (error) {
          console.error(`Failed to get message ${message.id}:`, error);
          return null;
        }
      })
    );

    // Filter out null results
    const validMessages = detailedMessages.filter(msg => msg !== null);

    return NextResponse.json({
      messages: validMessages,
      resultSizeEstimate: messagesResponse.data.resultSizeEstimate,
      nextPageToken: messagesResponse.data.nextPageToken,
    });

  } catch (error) {
    console.error('Gmail read error:', error);
    return NextResponse.json(
      { error: 'Failed to read emails' },
      { status: 500 }
    );
  }
}
