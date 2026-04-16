"use client";

/*
 * ThemeToggle — stateless, DOM-driven.
 * The active theme lives in <html data-theme="..."> (set by anti-flash
 * script in /public/theme-init.js before paint). We do NOT mirror it
 * into React state — that would be setState-in-effect (React 19 rule
 * violation) and force a client re-render for no reason.
 *
 * Instead, both icons are rendered always, and globals.css hides the
 * inactive one via [data-theme] CSS selectors. Clicking toggles the
 * attribute + localStorage.
 */
export default function ThemeToggle() {
  const toggle = () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* no-op: storage may be disabled */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Theme wechseln (Dark / Light)"
      title="Theme wechseln"
      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-[color:var(--color-bg-muted)] hover:text-text focus-visible:bg-[color:var(--color-bg-muted)]"
    >
      {/* Sun — visible in dark mode, hidden in light (see globals.css) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="theme-icon theme-icon-sun h-[18px] w-[18px]"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      {/* Moon — visible in light mode, hidden in dark (see globals.css) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="theme-icon theme-icon-moon h-[18px] w-[18px]"
        aria-hidden="true"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  );
}
