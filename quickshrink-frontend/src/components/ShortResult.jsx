const ShortResult = ({ shortUrl, onCopy }) => (
  <div className="rounded-3xl border border-slate-800/80 bg-slate-950/60 p-5 shadow-soft sm:p-6">
    <div className="mb-3 flex items-center justify-between gap-2">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
        Short link result
      </p>
      <span className="rounded-full bg-slate-900/80 px-2.5 py-1 text-[0.65rem] text-slate-500 ring-1 ring-slate-800">
        Redirect handled by backend
      </span>
    </div>

    {shortUrl ? (
      <div className="space-y-4">
        <button
          type="button"
          onClick={onCopy}
          className="group flex w-full items-center justify-between rounded-2xl border border-brand-500/40 bg-slate-950/70 px-4 py-3 text-left text-sm text-slate-100 shadow-inner hover:border-brand-400/60"
        >
          <div className="min-w-0">
            <p className="truncate font-medium">{shortUrl}</p>
            <p className="mt-1 text-[0.7rem] text-slate-500">
              Click to copy and share anywhere you want.
            </p>
          </div>
          <span className="ml-3 flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-brand-500/90 text-slate-950 shadow-md group-active:scale-95">
            ⧉
          </span>
        </button>
      </div>
    ) : (
      <div className="space-y-3 text-sm text-slate-500">
        <p className="text-[0.82rem] text-slate-300">
          Your shortened link will appear here after you paste a URL and click{" "}
          <span className="font-medium text-brand-300">Get your link</span>.
        </p>
      </div>
    )}
  </div>
);

export default ShortResult;

