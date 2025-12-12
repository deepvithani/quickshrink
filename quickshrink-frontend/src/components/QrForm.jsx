const QrForm = ({
  qrUrl,
  onChange,
  onSubmit,
  isSubmitting,
  error,
}) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="space-y-2">
      <label className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
        Enter URL for QR Code
      </label>
      <input
        type="url"
        required
        value={qrUrl}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://example.com"
        className="block w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3.5 text-sm text-slate-100"
      />
    </div>

    {error && <p className="text-red-400 text-sm">{error}</p>}

    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full rounded-xl bg-brand-500 px-4 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-400"
    >
      {isSubmitting ? "Generating..." : "Generate QR"}
    </button>
  </form>
);

export default QrForm;

