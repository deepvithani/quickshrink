import { Link, NavLink } from "react-router-dom";

const Header = () => (
  <header className="sticky top-0 z-30 w-full bg-gradient-to-r from-cyan-700 via-cyan-800 to-slate-900 shadow-[0_8px_16px_rgba(0,0,0,0.35)] border-b border-slate-900/60">
    <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">
      <Link to="/" className="flex items-center gap-3">
        <span className="text-3xl font-black tracking-[0.18em] text-white">QUICKSHRINK</span>
      </Link>

      <nav className="hidden items-center gap-6 text-sm sm:flex">
        {["Plans", "Features", "Domains", "Resources"].map((item) => (
          <button
            key={item}
            type="button"
            className="rounded px-2 py-1 font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <NavLink
          to="/login"
          className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Log In
        </NavLink>
        <NavLink
          to="/signup"
          className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#0b3c50] transition hover:shadow-md"
        >
          Sign Up
        </NavLink>
      </div>
    </div>
  </header>
);

export default Header;

