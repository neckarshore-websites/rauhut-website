export default function ProjectTiles() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
      {/* Neckarshore AI — enthaelt OMNIXIS Documentor */}
      <a
        href="https://neckarshore.ai"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-full flex-col justify-between gap-6 overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A2540] to-[#0F172A] p-6 text-[#F1F5F9] no-underline ring-1 ring-transparent transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:no-underline hover:text-[#F1F5F9] hover:no-underline hover:ring-[#22D3EE]/30 hover:shadow-[0_10px_40px_-15px_rgba(34,211,238,0.25)]"
      >
        <div>
          <p className="text-[0.6875rem] font-medium uppercase tracking-widest text-[#22D3EE]">
            Meine Firma
          </p>
          <p className="mt-2 text-xl font-semibold tracking-tight">
            neckarshore<span className="text-[#22D3EE]">.ai</span>
          </p>
          <p className="mt-1.5 text-sm text-[#CBD5E1]">
            KI-beschleunigte Softwareentwicklung — inkl. OMNIXIS Documentor
          </p>
        </div>
        <span
          aria-hidden="true"
          className="text-xl text-[#22D3EE] transition-transform duration-150 group-hover:translate-x-1"
        >
          →
        </span>
      </a>

      {/* Obsidian Vault Autopilot — GitHub */}
      <a
        href="https://github.com/GmanFooFoo"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-full flex-col justify-between gap-6 overflow-hidden rounded-2xl bg-gradient-to-br from-[#2E1065] to-[#1E0D47] p-6 text-[#F5F3FF] no-underline ring-1 ring-transparent transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:no-underline hover:ring-[#A78BFA]/30 hover:shadow-[0_10px_40px_-15px_rgba(167,139,250,0.25)]"
      >
        <div>
          <p className="text-[0.6875rem] font-medium uppercase tracking-widest text-[#A78BFA]">
            Open Source
          </p>
          <p className="mt-2 text-xl font-semibold tracking-tight">
            Obsidian Vault Autopilot
          </p>
          <p className="mt-1.5 text-sm text-[#C4B5FD]">
            Plugin fuer automatisiertes Wissensmanagement — GitHub
          </p>
        </div>
        <span
          aria-hidden="true"
          className="text-xl text-[#A78BFA] transition-transform duration-150 group-hover:translate-x-1"
        >
          →
        </span>
      </a>
    </div>
  );
}
