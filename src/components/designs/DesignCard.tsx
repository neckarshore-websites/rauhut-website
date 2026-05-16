import { Design } from "@/app/designs/data";

interface DesignCardProps {
  design: Design;
}

/**
 * A flip card showing design metadata on the front and a scaled
 * iframe preview on the back. CSS-only flip (no JS needed here).
 * The parent DesignsGallery sets --pscale via ResizeObserver.
 */
export default function DesignCard({ design }: DesignCardProps) {
  return (
    <div
      className="card-wrapper group relative"
      style={{ perspective: "1000px", height: "260px" }}
    >
      <a
        href={`/designs/rauhut-${design.slug}.html`}
        aria-label={`Open ${design.name} design`}
        className="
          absolute inset-0 block
          [transform-style:preserve-3d]
          transition-transform duration-500 ease-out
          group-hover:[transform:rotateY(180deg)]
          focus-within:[transform:rotateY(180deg)]
          no-underline
        "
      >
        {/* ── FRONT ─────────────────────────────────────────────── */}
        <div
          className="
            absolute inset-0
            [backface-visibility:hidden]
            bg-bg-muted border border-border rounded-lg overflow-hidden
            flex flex-col
          "
        >
          {/* Accent strip */}
          <div
            className="h-[3px] flex-shrink-0"
            style={{ background: design.accentColor }}
          />

          <div className="flex flex-1 flex-col gap-2 p-4 overflow-hidden">
            {/* Index */}
            <span className="font-mono text-xs text-text-subtle leading-none">
              {String(design.index).padStart(2, "0")}
            </span>

            {/* Name */}
            <span className="font-semibold text-[0.875rem] leading-snug text-text">
              {design.name}
            </span>

            {/* Style description */}
            <span className="text-[0.75rem] text-text-muted leading-snug line-clamp-2">
              {design.style}
            </span>

            {/* Swatches */}
            <div className="mt-auto flex flex-wrap gap-1.5">
              {design.swatches.map((s) => (
                <span
                  key={s}
                  className="h-5 w-5 flex-shrink-0"
                  style={{ background: s }}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── BACK (iframe preview) ─────────────────────────────── */}
        <div
          className="
            preview-wrap
            absolute inset-0
            [backface-visibility:hidden]
            [transform:rotateY(180deg)]
            overflow-hidden rounded-lg bg-black
          "
        >
          <iframe
            src={`/designs/rauhut-${design.slug}.html`}
            loading="lazy"
            tabIndex={-1}
            title={`${design.name} preview`}
            aria-hidden="true"
            style={{
              width: "1200px",
              height: "900px",
              border: "none",
              pointerEvents: "none",
              transformOrigin: "0 0",
              transform: "scale(var(--pscale, 0.22))",
            }}
          />
          {/* Bottom label */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
            <span className="font-mono text-xs text-white/80">
              {design.name}
            </span>
            <span className="font-mono text-xs text-white/60">
              ↗ öffnen
            </span>
          </div>
        </div>
      </a>
    </div>
  );
}
