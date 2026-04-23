type BuildReplyEmailMimeOptions = {
    to: string
    subject: string
    body: string
    inReplyTo?: string
}

function normalizeNewlines(value: string): string {
    return value.replace(/\r\n/g, '\n').trim()
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}

function buildHtmlBody(textBody: string): string {
    const blocks = normalizeNewlines(textBody)
        .split(/\n{2,}/)
        .map(block => block.trim())
        .filter(Boolean)

    const paragraphs = blocks
        .map(block => {
            const htmlText = escapeHtml(block).replace(/\n/g, '<br>')
            return `<p style="margin: 0 0 16px 0;">${htmlText}</p>`
        })
        .join('')

    return `<div style="font-family: Arial, Helvetica, sans-serif; font-size: 15px; line-height: 1.6; color: #1f2937;">${paragraphs}</div>`
}

export function buildReplyEmailMime(options: BuildReplyEmailMimeOptions): string {
    const { to, subject, body, inReplyTo } = options
    const textBody = normalizeNewlines(body)
    const htmlBody = buildHtmlBody(textBody)
    const boundary = `agenticpilot_${Date.now()}_${Math.random().toString(36).slice(2)}`

    const emailLines = [
        `To: ${to}`,
        `Subject: ${subject}`,
        'MIME-Version: 1.0',
        `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ]

    if (inReplyTo) {
        emailLines.push(`In-Reply-To: ${inReplyTo}`)
        emailLines.push(`References: ${inReplyTo}`)
    }

    emailLines.push('', `--${boundary}`)
    emailLines.push('Content-Type: text/plain; charset=utf-8')
    emailLines.push('Content-Transfer-Encoding: 8bit')
    emailLines.push('', textBody)

    emailLines.push(`--${boundary}`)
    emailLines.push('Content-Type: text/html; charset=utf-8')
    emailLines.push('Content-Transfer-Encoding: 8bit')
    emailLines.push('', htmlBody)

    emailLines.push(`--${boundary}--`)

    return emailLines.join('\r\n')
}
