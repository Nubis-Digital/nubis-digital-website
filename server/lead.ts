/**
 * Lead endpoint (Resend). Not part of the static GitHub Pages build — deploy it
 * as an edge function (e.g. a Cloudflare Worker) and point the form at it with
 * NEXT_PUBLIC_LEAD_ENDPOINT.
 */
export const runtime = 'edge';

const RESEND_URL = 'https://api.resend.com/emails';

const NAME_MIN = 1;
const NAME_MAX = 120;
const MESSAGE_MIN = 1;
const MESSAGE_MAX = 5000;
const COMPANY_MAX = 200;

// Pragmatic, boundary-anchored email check — fail fast on obvious garbage.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface LeadRequestBody {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  message?: unknown;
}

function jsonError(error: string, status: number): Response {
  return Response.json({ ok: false, error }, { status });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildHtml(name: string, email: string, company: string, message: string): string {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeCompany = company ? escapeHtml(company) : '—';
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

  return `<div style="font-family:system-ui,sans-serif;line-height:1.5;color:#1a1a1a">
  <h2 style="margin:0 0 16px">New lead from nubis.digital</h2>
  <p style="margin:0 0 8px"><strong>Name:</strong> ${safeName}</p>
  <p style="margin:0 0 8px"><strong>Email:</strong> ${safeEmail}</p>
  <p style="margin:0 0 8px"><strong>Company:</strong> ${safeCompany}</p>
  <p style="margin:16px 0 8px"><strong>Message:</strong></p>
  <p style="margin:0;padding:12px 16px;background:#f4f1ea;border-radius:8px">${safeMessage}</p>
</div>`;
}

export async function POST(request: Request): Promise<Response> {
  let body: LeadRequestBody;
  try {
    body = (await request.json()) as LeadRequestBody;
  } catch {
    return jsonError('Invalid JSON body', 400);
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const company = typeof body.company === 'string' ? body.company.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (name.length < NAME_MIN || name.length > NAME_MAX) {
    return jsonError(`name must be between ${NAME_MIN} and ${NAME_MAX} characters`, 400);
  }
  if (!EMAIL_RE.test(email)) {
    return jsonError('A valid email address is required', 400);
  }
  if (company.length > COMPANY_MAX) {
    return jsonError(`company must be at most ${COMPANY_MAX} characters`, 400);
  }
  if (message.length < MESSAGE_MIN || message.length > MESSAGE_MAX) {
    return jsonError(`message must be between ${MESSAGE_MIN} and ${MESSAGE_MAX} characters`, 400);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return jsonError(
      'Something went wrong on our end and we couldn’t send your message. Please try again in a moment.',
      500,
    );
  }

  const fromEmail = process.env.LEAD_FROM_EMAIL;
  const toEmail = process.env.LEAD_TO_EMAIL;
  if (!fromEmail || !toEmail) {
    return jsonError(
      'Something went wrong on our end and we couldn’t send your message. Please try again in a moment.',
      500,
    );
  }

  try {
    const res = await fetch(RESEND_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject: `New lead: ${name}`,
        html: buildHtml(name, email, company, message),
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error(`[api/lead] Resend failed (${res.status}):`, detail.slice(0, 500));
      return jsonError('Could not deliver your message right now. Please try again shortly.', 502);
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error('[api/lead] Resend request threw:', err);
    return jsonError('Could not deliver your message right now. Please try again shortly.', 502);
  }
}
