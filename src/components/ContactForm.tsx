"use client";

import { useActionState } from "react";
import { sendContact } from "@/app/actions/inquiry";
import { CONTACT_INITIAL_STATE, type Lang } from "@/app/actions/inquiry-state";
import { Turnstile } from "@/components/Turnstile";

/**
 * Contact form for the rauhut.com landing page (#kontakt / #contact).
 *
 * A direct-message complement to the ContactCards (E-Mail / LinkedIn /
 * GitHub). Wraps the `sendContact` Server Action via useActionState; spam
 * protection = hidden honeypot + Cloudflare Turnstile (dormant until the
 * env vars are set). Styled with the site's design tokens to match the
 * minimal-material look of the rest of the page.
 *
 * P6-lead (2026-09-12): now renders on /en too (it was DE-only before —
 * EN's Contact section had no form at all). The hidden `lang` field tells
 * the Server Action which CONTACT_COPY record to answer errors in; "Name"
 * itself needs no translation so it stays a literal, not a COPY entry.
 */

const COPY: Record<
  Lang,
  {
    emailLabel: string;
    messageLabel: string;
    honeypotLabel: string;
    submitLabel: string;
    pendingLabel: string;
    successMessage: string;
  }
> = {
  de: {
    emailLabel: "E-Mail",
    messageLabel: "Nachricht",
    honeypotLabel: "Website (bitte leer lassen)",
    submitLabel: "Nachricht senden",
    pendingLabel: "Wird gesendet …",
    successMessage:
      "Danke für Ihre Nachricht — ich melde mich zeitnah zurück.",
  },
  en: {
    emailLabel: "Email",
    messageLabel: "Message",
    honeypotLabel: "Website (please leave blank)",
    submitLabel: "Send message",
    pendingLabel: "Sending …",
    successMessage: "Thank you for your message — I'll get back to you shortly.",
  },
};

const labelClass =
  "mb-1.5 block text-sm font-medium text-text";
const fieldClass =
  "w-full rounded-lg border border-border-strong bg-bg-muted px-4 py-3 text-base text-text placeholder:text-text-subtle";
const errorClass = "mt-1.5 text-sm text-brand-amber";

export default function ContactForm({ lang = "de" }: { lang?: Lang }) {
  const copy = COPY[lang];
  const [state, formAction, pending] = useActionState(
    sendContact,
    CONTACT_INITIAL_STATE,
  );

  if (state.status === "success") {
    return (
      <div className="rounded-xl border border-border bg-bg-muted p-6">
        <p className="text-base text-text">{copy.successMessage}</p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      <input type="hidden" name="lang" value={lang} />

      {/* Honeypot — off-screen, bots fill it, humans don't see it. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      >
        <label htmlFor="contact-website">{copy.honeypotLabel}</label>
        <input
          id="contact-website"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <label htmlFor="contact-name" className={labelClass}>
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          defaultValue={state.values?.name}
          aria-invalid={state.fieldErrors?.name ? true : undefined}
          className={fieldClass}
        />
        {state.fieldErrors?.name ? (
          <p className={errorClass}>{state.fieldErrors.name}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-email" className={labelClass}>
          {copy.emailLabel}
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          defaultValue={state.values?.email}
          aria-invalid={state.fieldErrors?.email ? true : undefined}
          className={fieldClass}
        />
        {state.fieldErrors?.email ? (
          <p className={errorClass}>{state.fieldErrors.email}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          {copy.messageLabel}
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          defaultValue={state.values?.message}
          aria-invalid={state.fieldErrors?.message ? true : undefined}
          className={`${fieldClass} resize-y`}
        />
        {state.fieldErrors?.message ? (
          <p className={errorClass}>{state.fieldErrors.message}</p>
        ) : null}
      </div>

      <Turnstile />

      {state.status === "error" && state.message ? (
        <p role="alert" className="text-sm text-brand-amber">
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-lg bg-accent-hover px-6 py-3 text-base font-medium text-bg transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? copy.pendingLabel : copy.submitLabel}
      </button>
    </form>
  );
}
