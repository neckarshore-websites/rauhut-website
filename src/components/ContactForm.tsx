"use client";

import { useActionState } from "react";
import { sendContact } from "@/app/actions/inquiry";
import { CONTACT_INITIAL_STATE } from "@/app/actions/inquiry-state";
import { Turnstile } from "@/components/Turnstile";

/**
 * Contact form for the rauhut.com landing page (#kontakt section).
 *
 * A direct-message complement to the ContactCards (E-Mail / LinkedIn /
 * GitHub). Wraps the `sendContact` Server Action via useActionState; spam
 * protection = hidden honeypot + Cloudflare Turnstile (dormant until the
 * env vars are set). Styled with the site's design tokens to match the
 * minimal-material look of the rest of the page.
 */

const labelClass =
  "mb-1.5 block text-xs font-medium uppercase tracking-widest text-text-subtle";
const fieldClass =
  "w-full rounded-lg border border-border-strong bg-bg-muted px-4 py-3 text-[0.9375rem] text-text placeholder:text-text-subtle";
const errorClass = "mt-1.5 text-sm text-brand-amber";

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(
    sendContact,
    CONTACT_INITIAL_STATE,
  );

  if (state.status === "success") {
    return (
      <div className="rounded-xl border border-border bg-bg-muted p-6">
        <p className="text-[0.9375rem] text-text">
          Danke für Ihre Nachricht — ich melde mich zeitnah zurück.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
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
        <label htmlFor="contact-website">Website (bitte leer lassen)</label>
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
          E-Mail
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
          Nachricht
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
        className="self-start rounded-lg bg-accent-hover px-6 py-3 text-[0.9375rem] font-medium text-bg transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Wird gesendet …" : "Nachricht senden"}
      </button>
    </form>
  );
}
