const QrResult = ({ qrSvg }) => {
  const qrBoxStyle = { width: 220, height: 220 };

  return (
    <div className="rounded-3xl border border-slate-800/80 bg-slate-950/60 p-5 shadow-soft sm:p-6">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
          QR code result
        </p>
        <span className="rounded-full bg-slate-900/80 px-2.5 py-1 text-[0.65rem] text-slate-500 ring-1 ring-slate-800">
          No database write
        </span>
      </div>

      {qrSvg ? (
        <div className="space-y-3 rounded-2xl border border-slate-800/80 bg-slate-950/80 p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
              QR Code
            </p>
            <p className="text-[0.7rem] text-slate-500">Download or scan directly for your campaign.</p>
          </div>
          <div className="flex justify-center">
            <div
              className="bg-white p-4 rounded"
              style={qrBoxStyle}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-3 text-sm text-slate-500">
          <p className="text-[0.82rem] text-slate-300">
            Paste a destination URL on the QR tab and click{" "}
            <span className="font-medium text-brand-300">Get your QR Code</span> to see it here.
          </p>
        </div>
      )}
    </div>
  );
};

export default QrResult;

