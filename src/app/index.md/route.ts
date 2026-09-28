import { homeMarkdown } from '@/data/machineReadable'

export const dynamic = 'force-static'

export function GET(): Response {
  return new Response(homeMarkdown(), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } })
}
