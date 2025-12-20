// header.jsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FiLink,
  FiGrid,
  FiBarChart2,
  FiFileText,
  FiTag,
  FiSmartphone,
  FiBriefcase,
  FiBookOpen,
  FiHelpCircle,
  FiUsers,
  FiLayers,
} from "react-icons/fi";

const megaMenuData = {
  Platform: {
    sections: [
      {
        title: "PRODUCTS",
        items: [
          { title: "URL Shortener", desc: "Customize, share and track links", icon: FiLink },
          { title: "QR Code Generator", desc: "Dynamic QR solutions", icon: FiGrid },
          { title: "Analytics", desc: "Track & analyze performance", icon: FiBarChart2 },
          { title: "Pages", desc: "No-code landing pages", icon: FiFileText },
        ],
      },
      {
        title: "FEATURES",
        items: [
          { title: "Branded Links", desc: "Your brand, your URL", icon: FiTag },
          { title: "Mobile Links", desc: "SMS-friendly links", icon: FiSmartphone },
        ],
      },
    ],
  },

  Solutions: {
    sections: [
      {
        title: "BY INDUSTRY",
        items: [
          { title: "Retail", icon: FiBriefcase },
          { title: "Technology", icon: FiLayers },
          { title: "Healthcare", icon: FiUsers },
          { title: "Education", icon: FiBookOpen },
        ],
      },
      {
        title: "BY BUSINESS",
        items: [
          { title: "Small Business", icon: FiBriefcase },
          { title: "Enterprise", icon: FiLayers },
        ],
      },
    ],
  },

  Resources: {
    sections: [
      {
        title: "LEARN MORE",
        items: [
          { title: "Blog", icon: FiBookOpen },
          { title: "Guides & eBooks", icon: FiBookOpen },
        ],
      },
      {
        title: "SUPPORT",
        items: [
          { title: "Help Center", icon: FiHelpCircle },
          { title: "Developers", icon: FiLayers },
        ],
      },
    ],
  },
};

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [openMenu, setOpenMenu] = useState(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-cyan-700 via-cyan-800 to-slate-900 shadow-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* LOGO */}
        <Link to="/" className="text-2xl font-black tracking-widest text-white">
          QUICKSHRINK
        </Link>

        {/* CENTER NAV */}
        <nav className="relative hidden md:flex items-center gap-10 text-sm font-semibold text-white">
          {Object.keys(megaMenuData).map((menu) => (
            <div
              key={menu}
              onMouseEnter={() => setOpenMenu(menu)}
              onMouseLeave={() => setOpenMenu(null)}
              className="relative"
            >
              <span className="cursor-pointer hover:text-cyan-300">
                {menu}
              </span>

              {openMenu === menu && (
                <div className="absolute left-1/2 top-full -translate-x-1/2">

                  {/* 🔥 Invisible hover bridge */}
                  <div className="h-4 w-full"></div>

                  {/* Mega Menu */}
                  <div className="w-[420px] rounded-xl bg-white p-6 text-slate-800 shadow-2xl">
                    <div className="flex flex-col gap-10">
                      {megaMenuData[menu].sections.map((section, idx) => (
                        <div key={idx}>
                          <p className="mb-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                            {section.title}
                          </p>

                          <div className="grid grid-cols-2 gap-3">
                            {section.items.map((item, i) => {
                              const Icon = item.icon;

                              return (
                                <div
                                  key={i}
                                  className="flex items-start gap-3 rounded-lg p-3 cursor-pointer hover:bg-slate-100 transition"
                                >
                                  <Icon className="mt-1 text-lg text-cyan-700" />
                                  <div>
                                    <p className="font-semibold text-sm">
                                      {item.title}
                                    </p>
                                    {item.desc && (
                                      <p className="text-xs text-slate-600">
                                        {item.desc}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}


            </div>
          ))}

          <NavLink to="/pricing" className="hover:text-cyan-300">
            Pricing
          </NavLink>
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          {!token ? (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `
    rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200
    ${isActive ? "bg-white text-slate-900 shadow-md" : "text-white hover:bg-white hover:text-slate-900"}
    `
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900"
              >
                Sign Up
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/dashboard" className="text-white">
                Dashboard
              </NavLink>
              <span className="text-white/80 text-sm">
                Hi, {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
