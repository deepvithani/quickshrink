const ShortenForm = ({
  longUrl,
  onChange,
  onSubmit,
  isSubmitting,
  error,
}) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="space-y-2">
      <label
        htmlFor="long-url"
        className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-400"
      >
        Paste your long link
      </label>
      <div className="relative">
        <input
          id="long-url"
          type="url"
          required
          value={longUrl}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://example.com/my-long-url"
          className="block w-full rounded-2xl border border-slate-800/90 bg-slate-900/50 px-4 py-3.5 text-sm text-slate-100 shadow-inner outline-none ring-2 ring-transparent transition focus:border-brand-500/60 focus:ring-brand-500/30"
        />
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <span className="rounded-full bg-slate-900/80 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-slate-400 ring-1 ring-slate-800">
            Required
          </span>
        </div>
      </div>
    </div>

    <button
      type="submit"
      disabled={isSubmitting}
      className="inline-flex items-center justify-center rounded-2xl bg-brand-500 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_18px_40px_rgba(8,145,178,0.45)] transition hover:bg-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-400 disabled:shadow-none"
    >
      {isSubmitting ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900/40 border-t-slate-950" />
          <span>Getting your short link…</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-2">
          <span>Get your link for free</span>
        </span>
      )}
    </button>

    {error && (
      <div className="mt-2 rounded-2xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-xs text-red-200">
        {error}
      </div>
    )}
  </form>
);

export default ShortenForm;

