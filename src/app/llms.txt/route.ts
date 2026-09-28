import { llmsTxt } from '@/data/machineReadable'

export const dynamic = 'force-static'

export function GET(): Response {
  return new Response(llmsTxt(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
