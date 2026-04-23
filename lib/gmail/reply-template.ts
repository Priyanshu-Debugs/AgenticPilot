const DEFAULT_GREETING = 'Hello,'
const DEFAULT_SIGN_OFF = 'Thank You,\nAgenticPilot Team.'

const SALUTATION_LINE_REGEX = /^(hello|hi|dear)\b[\s\S]*$/i
const CLOSING_LINE_REGEX = /^(thanks?|thank\s*you|sincerely|regards|best\s*regards|kind\s*regards|warm\s*regards|yours\s*sincerely)\s*[!,.]?$/i
const SIGNATURE_LINE_REGEX = /^agenticpilot(\s+team|\s+ai\s+platform)?\.?$/i

function extractDisplayName(recipient: string): string {
    if (!recipient) return ''

    const angleMatch = recipient.match(/^(.*?)\s*<[^>]+>$/)
    const rawName = (angleMatch?.[1] || '').trim().replace(/^"|"$/g, '')

    if (rawName) return rawName

    const emailMatch = recipient.match(/<?([^<>\s]+@[^<>\s]+)>?/)?.[1]
    if (!emailMatch) return ''

    const localPart = emailMatch.split('@')[0] || ''
    return localPart
        .replace(/[._-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
}

function normalizeBody(body: string): string {
    return body.replace(/\r\n/g, '\n').trim()
}

function isBlank(line: string): boolean {
    return line.trim().length === 0
}

function stripLeadingSalutations(text: string): string {
    const lines = text.split('\n')

    while (lines.length > 0 && SALUTATION_LINE_REGEX.test(lines[0].trim())) {
        lines.shift()
        while (lines.length > 0 && isBlank(lines[0])) {
            lines.shift()
        }
    }

    return lines.join('\n').trim()
}

function stripTrailingClosings(text: string): string {
    const lines = text.split('\n')

    while (lines.length > 0 && isBlank(lines[lines.length - 1])) {
        lines.pop()
    }

    while (lines.length > 0) {
        const lastLine = lines[lines.length - 1].trim()

        if (isBlank(lastLine) || CLOSING_LINE_REGEX.test(lastLine) || SIGNATURE_LINE_REGEX.test(lastLine)) {
            lines.pop()
            while (lines.length > 0 && isBlank(lines[lines.length - 1])) {
                lines.pop()
            }
            continue
        }

        break
    }

    return lines.join('\n').trim()
}

export function formatReplyWithTemplate(message: string, recipient: string): string {
    const body = normalizeBody(message)
    const recipientName = extractDisplayName(recipient)
    const greeting = recipientName ? `Hello ${recipientName},` : DEFAULT_GREETING

    const withoutSalutation = stripLeadingSalutations(body)
    const withoutClosings = stripTrailingClosings(withoutSalutation)

    return `${greeting}\n\n${withoutClosings}\n\n${DEFAULT_SIGN_OFF}`
}