import { aiCheckMarkdown } from '@/data/machineReadable'

export const dynamic = 'force-static'

export function GET(): Response {
  return new Response(aiCheckMarkdown(), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } })
}
