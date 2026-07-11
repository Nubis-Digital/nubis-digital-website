'use client';

/**
 * Contact section — lead capture form, hardened for real-world input.
 *
 * Client-side validation mirrors the server caps in /api/lead; on failure the
 * first invalid field is focused and its message is wired to the input via
 * aria-describedby. Submits are single-flight (button disabled) and bounded by
 * a request timeout so a hung network never strands the user in "Sending…".
 * Success is announced and focused for screen-reader / keyboard users. A hidden
 * honeypot drops naive bots. User input is preserved across every error path.
 */
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { content } from '@/data/content';
import { Icon } from '@/components/icons';

interface FormValues {
  name: string;
  email: string;
  company: string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const EMPTY: FormValues = { name: '', email: '', company: '', message: '' };

// Mirror the server-side caps in /api/lead so the client fails fast and the
// inputs can't exceed what the API will accept.
const LIMITS = { name: 120, email: 254, company: 200, message: 5000 } as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REQUEST_TIMEOUT_MS = 15000;

// Focus order for jumping to the first invalid field.
const FIELD_ORDER: (keyof FormValues)[] = ['name', 'email', 'message'];

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const message = values.message.trim();

  if (!name) errors.name = 'Please enter your name.';
  else if (name.length > LIMITS.name) errors.name = `Please keep your name under ${LIMITS.name} characters.`;

  if (!email) errors.email = 'Please enter your email.';
  else if (!EMAIL_RE.test(email)) errors.email = 'Please enter a valid email address.';

  if (!message) errors.message = 'Please tell us about your project.';
  else if (message.length > LIMITS.message) errors.message = `Please keep your message under ${LIMITS.message} characters.`;

  return errors;
}

export default function ContactSection() {
  const c = content.contact;
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // Honeypot — real users never see or tab to it; only bots fill it.
  const trapRef = useRef('');
  const successRef = useRef<HTMLDivElement>(null);

  // Move focus to the success panel so AT / keyboard users land on the outcome.
  useEffect(() => {
    if (sent) successRef.current?.focus();
  }, [sent]);

  function update<K extends keyof FormValues>(key: K, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  function focusFirstError(errs: FormErrors) {
    const first = FIELD_ORDER.find((k) => errs[k]);
    if (first) document.getElementById(`contact-${first}`)?.focus();
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);

    // Honeypot tripped → silently accept without sending (don't tip off bots).
    if (trapRef.current) {
      setSent(true);
      return;
    }

    const nextErrors = validate(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      focusFirstError(nextErrors);
      return;
    }

    setSubmitting(true);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          company: values.company.trim(),
          message: values.message.trim(),
        }),
      });

      const data: { ok?: boolean; error?: string } = await res
        .json()
        .catch(() => ({}));

      if (!res.ok || !data.ok) {
        setSubmitError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setSent(true);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setSubmitError(
          'That took too long to send. Please check your connection and try again.',
        );
      } else {
        setSubmitError(
          'Unable to reach the server. Please check your connection and try again.',
        );
      }
    } finally {
      clearTimeout(timeout);
      setSubmitting(false);
    }
  }

  return (
    <section className="section reveal" id="contact">
      <div className="contact contact-inner">
        <h2>{c.headline}</h2>
        <p className="sub">{c.subheadline}</p>

        {!sent && (
          <p className="contact-reassure">
            <span className="contact-reassure-dot" aria-hidden="true" />
            {c.reassure}
          </p>
        )}

        {sent ? (
          <div
            className="contact-success"
            ref={successRef}
            role="status"
            aria-live="polite"
            tabIndex={-1}
          >
            <div className="d" aria-hidden="true"></div>
            <h3>{c.successTitle}</h3>
            <p>{c.successBody}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {/* Honeypot: off-screen, not focusable, ignored by humans. */}
            <div className="honeypot" aria-hidden="true">
              <label htmlFor="contact-website">Leave this field empty</label>
              <input
                id="contact-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                onChange={(e) => {
                  trapRef.current = e.target.value;
                }}
              />
            </div>

            <div className="form-grid two" style={{ marginBottom: 24 }}>
              <div>
                <label className="field-label" htmlFor="contact-name">
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  className="field"
                  placeholder="Your name"
                  value={values.name}
                  maxLength={LIMITS.name}
                  autoComplete="name"
                  onChange={(e) => update('name', e.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'contact-name-error' : undefined}
                />
                {errors.name && (
                  <p className="field-error" id="contact-name-error">
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <label className="field-label" htmlFor="contact-email">
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  className="field"
                  placeholder="you@company.com"
                  value={values.email}
                  maxLength={LIMITS.email}
                  autoComplete="email"
                  inputMode="email"
                  onChange={(e) => update('email', e.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'contact-email-error' : undefined}
                />
                {errors.email && (
                  <p className="field-error" id="contact-email-error">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label className="field-label" htmlFor="contact-company">
                Company <span style={{ textTransform: 'none' }}>(optional)</span>
              </label>
              <input
                id="contact-company"
                name="company"
                className="field"
                placeholder="Your company"
                value={values.company}
                maxLength={LIMITS.company}
                autoComplete="organization"
                onChange={(e) => update('company', e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label className="field-label" htmlFor="contact-message">
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                className="field"
                placeholder="Tell us about your project..."
                value={values.message}
                maxLength={LIMITS.message}
                onChange={(e) => update('message', e.target.value)}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? 'contact-message-error' : undefined}
              />
              {errors.message && (
                <p className="field-error" id="contact-message-error">
                  {errors.message}
                </p>
              )}
            </div>

            {submitError && (
              <p className="field-error" style={{ marginBottom: 16 }} role="alert">
                {submitError}
              </p>
            )}

            <button className="btn-primary" type="submit" disabled={submitting}>
              {submitting ? 'Sending…' : 'Send Message'}{' '}
              <Icon name="arrow-right" size={16} />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
