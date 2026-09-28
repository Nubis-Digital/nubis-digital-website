import { securityTxt } from '@/data/machineReadable'

export const dynamic = 'force-static'

export function GET(): Response {
  return new Response(securityTxt(new Date()), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
