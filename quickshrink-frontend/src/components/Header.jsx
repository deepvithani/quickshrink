import { Link, NavLink, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-gradient-to-r from-cyan-700 via-cyan-800 to-slate-900 shadow-[0_8px_16px_rgba(0,0,0,0.35)] border-b border-slate-900/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="text-3xl font-black tracking-[0.18em] text-white">QUICKSHRINK</span>
        </Link>

        {/* <nav className="hidden items-center gap-6 text-sm sm:flex">
          {["Plans", "Features", "Domains", "Resources"].map((item) => (
            <button
              key={item}
              type="button"
              className="rounded px-2 py-1 font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              {item}
            </button>
          ))}
        </nav> */}

        <div className="flex items-center gap-3">

          {/* HOME – ALWAYS VISIBLE */}
          <NavLink
            to="/"
            className=
            "rounded-lg px-4 py-2 text-sm font-semibold transition"

          >
            Home
          </NavLink>

          {!token ? (
            <>
              <NavLink
                to="/login"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Login
              </NavLink>

              <NavLink
                to="/signup"
                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
              >
                Sign Up
              </NavLink>
            </>
          ) : (
            <>


              <NavLink
                to="/dashboard"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Dashboard
              </NavLink>
              <span className="text-sm  px-4 py-2 font-semibold text-white/80">
                Hi, {user?.name}
              </span>

              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Logout
              </button>
            </>
          )}
        </div>


      </div>
    </header>
  );
}
export default Header;

