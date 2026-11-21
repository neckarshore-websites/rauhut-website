/**
 * Theme before first paint, inlined into <head> by src/app/layout.tsx.
 *
 * Order: the visitor's own choice via the switch (localStorage "theme"), otherwise
 * the device setting (prefers-color-scheme), otherwise dark. A device switch
 * while the page is open is followed unless the visitor chose.
 *
 * Inline on purpose: a next/script beforeInteractive file is loaded by the Next
 * runtime and runs only once its chunks arrive (measured 2026-11-21; the
 * pre-hydration tests in tests/e2e/system-theme.spec.ts block the chunks).
 *
 * Privacy: reads the device setting in the browser only, writes nothing, sends
 * nothing. Fixed text, no value from outside is put into it.
 */
export const THEME_INIT = `(function(){var r=document.documentElement,m=null;try{m=matchMedia("(prefers-color-scheme: light)")}catch(e){}function s(){try{var t=localStorage.getItem("theme");return t==="dark"||t==="light"?t:null}catch(e){return null}}function a(){r.setAttribute("data-theme",s()||(m&&m.matches?"light":"dark"))}a();if(m){var c=function(){if(!s())a()};if(m.addEventListener)m.addEventListener("change",c);else if(m.addListener)m.addListener(c)}})();`;
