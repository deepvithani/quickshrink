const Loader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-950 to-black">
    <div className="relative flex flex-col items-center gap-5 text-slate-100">
      <div className="absolute -left-10 -top-12 h-40 w-40 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="absolute -right-10 -bottom-14 h-52 w-52 rounded-full bg-sky-500/20 blur-3xl" />
      <div className="relative z-10 flex flex-col items-center gap-3">
        <p className="text-3xl font-black tracking-[0.2em] text-white drop-shadow-lg sm:text-4xl">
          QUICKSHRINK
        </p>
        <div className="flex items-center justify-center gap-3 text-4xl sm:text-5xl">
          <span className="animate-pulse text-brand-200">⟮</span>
          <span className="h-7 w-7 animate-spin rounded-full border-4 border-slate-800 border-t-brand-400" />
          <span className="animate-pulse text-brand-200">⟯</span>
        </div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400 sm:text-sm">
          Crafting your experience
        </p>
      </div>
    </div>
  </div>
);

export default Loader;

