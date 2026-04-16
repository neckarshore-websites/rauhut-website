import Link from "next/link";

/*
 * LangToggle — stateless, SSR-friendly.
 * Renders a small "DE · EN" nav. The current language is rendered as a
 * plain <span> (not a link, to avoid self-links), the other language as
 * a Next.js <Link>. `aria-current="page"` marks the active language for
 * assistive tech.
 */
export default function LangToggle({ current }: { current: "de" | "en" }) {
  const isDe = current === "de";
  return (
    <nav
      aria-label="Language"
      className="flex items-center gap-2 text-sm"
    >
      {isDe ? (
        <span aria-current="page" className="font-semibold text-text">
          DE
        </span>
      ) : (
        <Link
          href="/"
          hrefLang="de"
          className="text-text-muted no-underline hover:text-text"
        >
          DE
        </Link>
      )}
      <span aria-hidden="true" className="text-text-subtle">
        ·
      </span>
      {!isDe ? (
        <span aria-current="page" className="font-semibold text-text">
          EN
        </span>
      ) : (
        <Link
          href="/en"
          hrefLang="en"
          className="text-text-muted no-underline hover:text-text"
        >
          EN
        </Link>
      )}
    </nav>
  );
}
