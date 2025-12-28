"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, Link2, Loader2, CheckCircle2, XCircle } from 'lucide-react'

interface GmailConnectProps {
    isConnected: boolean
    onConnect: () => Promise<void>
    onDisconnect: () => Promise<void>
    loading?: boolean
}

export function GmailConnect({
    isConnected,
    onConnect,
    onDisconnect,
    loading = false
}: GmailConnectProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleConnect = async () => {
        setIsLoading(true)
        try {
            await onConnect()
        } finally {
            setIsLoading(false)
        }
    }

    const handleDisconnect = async () => {
        if (!confirm('Are you sure you want to disconnect Gmail?')) return
        setIsLoading(true)
        try {
            await onDisconnect()
        } finally {
            setIsLoading(false)
        }
    }

    const isProcessing = isLoading || loading

    return (
        <Card className="border-2 border-dashed">
            <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${isConnected ? 'bg-green-100 dark:bg-green-900/30' : 'bg-muted'}`}>
                        <Mail className={`h-6 w-6 ${isConnected ? 'text-green-600' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                        <h3 className="font-semibold">Gmail Connection</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {isConnected ? (
                                <>
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    <span className="text-green-600">Connected</span>
                                </>
                            ) : (
                                <>
                                    <XCircle className="h-4 w-4 text-red-500" />
                                    <span>Not connected</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {isConnected ? (
                    <Button
                        variant="destructive"
                        onClick={handleDisconnect}
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Disconnect
                    </Button>
                ) : (
                    <Button
                        onClick={handleConnect}
                        disabled={isProcessing}
                        className="gap-2"
                    >
                        {isProcessing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Link2 className="h-4 w-4" />
                        )}
                        Connect Gmail
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}
