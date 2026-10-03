'use client'

import { useEffect } from 'react'

import { content } from '@/data/content'
import { aiCheckMarkdown, homeMarkdown, llmsTxt, umbracoMarkdown } from '@/data/machineReadable'

/**
 * WebMCP: exposes the site to an in-browser AI agent as callable tools
 * (https://github.com/webmachinelearning/webmcp). The API is still a draft —
 * current spec hangs it off `document.modelContext`, earlier previews off
 * `navigator.modelContext` — so both are feature-detected and a browser
 * without either is a silent no-op.
 *
 * Every tool is read-only except `draft_inquiry`, which only *fills* the
 * contact form: a person still reviews and presses send. Powerful AI, with
 * real people in control.
 */

interface ToolResult { content: Array<{ type: 'text'; text: string }> }

export interface WebMcpTool {
  name: string
  description: string
  inputSchema: { type: 'object'; properties: Record<string, unknown>; required?: string[] }
  annotations?: { readOnlyHint?: boolean }
  execute: (args: Record<string, unknown>) => Promise<ToolResult>
}

interface ModelContext {
  registerTool: (tool: WebMcpTool, options?: { signal?: AbortSignal }) => unknown
  unregisterTool?: (name: string) => void
}

const text = (value: string): ToolResult => ({ content: [{ type: 'text', text: value }] })

export const SECTIONS = { home: 'main', story: 'immersive-story', services: 'story-proposals', process: 'story-readiness', work: 'story-proof', contact: 'contact' } as const

const INQUIRY_FIELDS = { name: 120, email: 254, company: 200, message: 5000 } as const

/** Sets a React-controlled input so its onChange fires, as if typed. */
function fillField(id: string, value: string) {
  const field = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null
  if (!field) return false
  const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(field), 'value')?.set
  setter?.call(field, value)
  field.dispatchEvent(new Event('input', { bubbles: true }))
  return true
}

export function createWebMcpTools(): WebMcpTool[] {
  return [
    {
      name: 'get_business_overview',
      description: 'Who Nubis Digital is, what it does, and which pages to read. Start here.',
      inputSchema: { type: 'object', properties: {} },
      annotations: { readOnlyHint: true },
      execute: async () => text(llmsTxt()),
    },
    {
      name: 'get_page_content',
      description: 'The full text of a Nubis Digital page as Markdown: "home" (services, process, about), "ai-visibility-check" (the free check of what AI assistants say about a business) or "umbraco" (the platform Nubis builds on).',
      inputSchema: { type: 'object', properties: { page: { type: 'string', enum: ['home', 'ai-visibility-check', 'umbraco'] } }, required: ['page'] },
      annotations: { readOnlyHint: true },
      execute: async ({ page }) => text(page === 'umbraco' ? umbracoMarkdown() : page === 'ai-visibility-check' ? aiCheckMarkdown() : homeMarkdown()),
    },
    {
      name: 'list_services',
      description: 'The services Nubis Digital offers, each with a plain-language description.',
      inputSchema: { type: 'object', properties: {} },
      annotations: { readOnlyHint: true },
      execute: async () => text(JSON.stringify([...content.services.packages.map(({ title, description }) => ({ title, description })), { title: content.services.foundation.title, description: content.services.foundation.description }])),
    },
    {
      name: 'show_section',
      description: 'Scrolls the visitor to a section of the page.',
      inputSchema: { type: 'object', properties: { section: { type: 'string', enum: Object.keys(SECTIONS) } }, required: ['section'] },
      execute: async ({ section }) => {
        const id = SECTIONS[section as keyof typeof SECTIONS]
        const target = id && document.getElementById(id)
        if (!target) return text(`Section "${String(section)}" is not on this page. Open ${location.origin}/ first.`)
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return text(`Showing ${String(section)}.`)
      },
    },
    {
      name: 'draft_inquiry',
      description: 'Pre-fills the contact form for the visitor. Does NOT send it — the visitor reviews the message and presses send themselves.',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', maxLength: INQUIRY_FIELDS.name },
          email: { type: 'string', maxLength: INQUIRY_FIELDS.email },
          company: { type: 'string', maxLength: INQUIRY_FIELDS.company },
          message: { type: 'string', maxLength: INQUIRY_FIELDS.message, description: 'What the visitor needs help with.' },
        },
        required: ['message'],
      },
      execute: async (args) => {
        const form = document.getElementById('contact')
        if (!form) return text(`The contact form lives at ${location.origin}/#contact.`)
        const filled = (Object.keys(INQUIRY_FIELDS) as Array<keyof typeof INQUIRY_FIELDS>)
          .filter((key) => typeof args[key] === 'string' && fillField(`contact-${key}`, String(args[key]).slice(0, INQUIRY_FIELDS[key])))
        form.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return text(`Filled ${filled.join(', ') || 'nothing'}. The visitor must review and press send.`)
      },
    },
  ]
}

export function WebMcpTools() {
  useEffect(() => {
    const modelContext = ((document as unknown as { modelContext?: ModelContext }).modelContext
      ?? (navigator as unknown as { modelContext?: ModelContext }).modelContext)
    if (!modelContext?.registerTool) return

    const controller = new AbortController()
    const tools = createWebMcpTools()
    tools.forEach((tool) => {
      try {
        void Promise.resolve(modelContext.registerTool(tool, { signal: controller.signal })).catch(() => {})
      } catch {
        // Permission denied or duplicate name: the page works without it.
      }
    })

    return () => {
      controller.abort()
      tools.forEach((tool) => { try { modelContext.unregisterTool?.(tool.name) } catch { /* already gone */ } })
    }
  }, [])

  return null
}
