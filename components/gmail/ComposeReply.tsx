"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
    Send,
    Loader2,
    Sparkles,
    X,
    Wand2
} from 'lucide-react'
import type { GmailMessage } from '@/lib/gmail/types'

const TONES = [
    { id: 'professional', label: 'Professional' },
    { id: 'friendly', label: 'Friendly' },
    { id: 'formal', label: 'Formal' },
    { id: 'casual', label: 'Casual' },
]

interface ComposeReplyProps {
    email: GmailMessage | null
    initialBody?: string
    onSend: (data: { to: string; subject: string; message: string }) => Promise<void>
    onGenerateAI: (tone: string) => Promise<string>
    onClose: () => void
    sending?: boolean
}

export function ComposeReply({
    email,
    initialBody = '',
    onSend,
    onGenerateAI,
    onClose,
    sending = false,
}: ComposeReplyProps) {
    const [to, setTo] = useState(email?.from || '')
    const [subject, setSubject] = useState(
        email?.subject?.startsWith('Re:') ? email.subject : `Re: ${email?.subject || ''}`
    )
    const [message, setMessage] = useState(initialBody)
    const [selectedTone, setSelectedTone] = useState('professional')
    const [generating, setGenerating] = useState(false)

    const handleGenerateAI = async () => {
        setGenerating(true)
        try {
            const reply = await onGenerateAI(selectedTone)
            setMessage(reply)
        } finally {
            setGenerating(false)
        }
    }

    const handleSend = async () => {
        if (!to || !subject || !message) return
        await onSend({ to, subject, message })
    }

    if (!email) return null

    return (
        <Card className="border-2 border-primary/20">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Send className="h-5 w-5 text-primary" />
                        Compose Reply
                    </CardTitle>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* To field */}
                <div>
                    <label className="text-sm font-medium mb-1 block">To</label>
                    <Input
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        placeholder="recipient@example.com"
                    />
                </div>

                {/* Subject field */}
                <div>
                    <label className="text-sm font-medium mb-1 block">Subject</label>
                    <Input
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Email subject"
                    />
                </div>

                {/* AI Generation */}
                <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">AI Generate Reply</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {TONES.map((tone) => (
                            <Badge
                                key={tone.id}
                                variant={selectedTone === tone.id ? 'default' : 'outline'}
                                className="cursor-pointer"
                                onClick={() => setSelectedTone(tone.id)}
                            >
                                {tone.label}
                            </Badge>
                        ))}
                    </div>
                    <Button
                        onClick={handleGenerateAI}
                        disabled={generating}
                        variant="secondary"
                        size="sm"
                        className="gap-2"
                    >
                        {generating ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Wand2 className="h-4 w-4" />
                        )}
                        Generate {selectedTone} reply
                    </Button>
                </div>

                {/* Message body */}
                <div>
                    <label className="text-sm font-medium mb-1 block">Message</label>
                    <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your reply here..."
                        rows={8}
                        className="resize-none"
                    />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSend}
                        disabled={sending || !message.trim()}
                        className="gap-2"
                    >
                        {sending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                        Send Reply
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
