export default function NeckarshoreBanner() {
  return (
    <a
      href="https://neckarshore.ai"
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A2540] to-[#0F172A] text-[#F1F5F9] no-underline transition-[filter] duration-150 hover:brightness-110 hover:no-underline"
    >
      <div className="flex items-center justify-between gap-6 p-6 sm:p-8">
        <div>
          <p className="text-[0.6875rem] font-medium uppercase tracking-widest text-[#22D3EE]">
            Meine Firma
          </p>
          <p className="mt-2 font-semibold tracking-tight text-2xl sm:text-3xl">
            neckarshore<span className="text-[#22D3EE]">.ai</span>
          </p>
          <p className="mt-1.5 text-sm text-[#CBD5E1] sm:text-[0.9375rem]">
            KI-beschleunigte Softwareentwicklung — made in Stuttgart
          </p>
        </div>
        <span
          aria-hidden="true"
          className="shrink-0 text-2xl text-[#22D3EE] transition-transform duration-150 group-hover:translate-x-1"
        >
          →
        </span>
      </div>
    </a>
  );
}
