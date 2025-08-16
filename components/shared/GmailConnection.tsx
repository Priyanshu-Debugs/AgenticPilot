'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function GmailConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for OAuth callback results
  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');

    if (success === 'connected') {
      setIsConnected(true);
      // Clean up URL
      router.replace('/dashboard/gmail');
    } else if (error) {
      console.error('Gmail OAuth error:', error);
      // Handle different error types
      const errorMessages = {
        'oauth_failed': 'OAuth authorization failed',
        'missing_params': 'Missing required parameters',
        'unauthorized': 'User session invalid',
        'callback_failed': 'Failed to process OAuth callback'
      };
      const message = errorMessages[error as keyof typeof errorMessages] || 'Unknown error occurred';
      alert(`Gmail connection failed: ${message}`);
      // Clean up URL
      router.replace('/dashboard/gmail');
    }
  }, [searchParams, router]);

  // Check Gmail connection status on component mount
  useEffect(() => {
    checkGmailStatus();
  }, []);

  const checkGmailStatus = async () => {
    try {
      const response = await fetch('/api/auth/gmail/status');
      if (response.ok) {
        const data = await response.json();
        setIsConnected(data.connected);
      }
    } catch (error) {
      console.error('Failed to check Gmail status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectGmail = async () => {
    setIsConnecting(true);
    try {
      const response = await fetch('/api/auth/gmail', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to Google OAuth
        window.location.href = data.authUrl;
      } else {
        throw new Error('Failed to initiate Gmail connection');
      }
    } catch (error) {
      console.error('Gmail connection error:', error);
      alert('Failed to connect Gmail. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectGmail = async () => {
    if (!confirm('Are you sure you want to disconnect Gmail? This will stop all Gmail automations.')) {
      return;
    }

    setIsDisconnecting(true);
    try {
      const response = await fetch('/api/auth/gmail/status', {
        method: 'DELETE',
      });

      if (response.ok) {
        setIsConnected(false);
        alert('Gmail disconnected successfully');
      } else {
        throw new Error('Failed to disconnect Gmail');
      }
    } catch (error) {
      console.error('Gmail disconnection error:', error);
      alert('Failed to disconnect Gmail. Please try again.');
    } finally {
      setIsDisconnecting(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="min-h-[280px]">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Mail className="h-6 w-6 text-blue-600" />
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                Gmail Connection
                <div className="h-6 w-20 bg-muted animate-pulse rounded-full"></div>
              </CardTitle>
              <CardDescription>
                <div className="h-4 w-80 bg-muted animate-pulse rounded mt-1"></div>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Checking Gmail connection...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="min-h-[280px]">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Mail className="h-6 w-6 text-blue-600" />
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              Gmail Connection
              {isConnected ? (
                <Badge variant="default" className="bg-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <XCircle className="h-3 w-3 mr-1" />
                  Not Connected
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {isConnected
                ? 'Your Gmail account is connected and ready for automation'
                : 'Connect your Gmail account to enable email automation features'
              }
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p className="mb-2">Gmail automation features:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Smart auto-replies for reviews and inquiries</li>
              <li>Email categorization and labeling</li>
              <li>Automated follow-up emails</li>
              <li>Email analytics and insights</li>
            </ul>
          </div>
          
          <div className="pt-4">
            {isConnected ? (
              <Button 
                onClick={disconnectGmail}
                disabled={isDisconnecting}
                variant="destructive"
              >
                {isDisconnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Disconnecting...
                  </>
                ) : (
                  'Disconnect Gmail'
                )}
              </Button>
            ) : (
              <Button 
                onClick={connectGmail}
                disabled={isConnecting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Connecting...
                  </>
                ) : (
                  'Connect Gmail Account'
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
