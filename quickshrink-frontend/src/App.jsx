import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Loader from "./components/Loader";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Links from "./pages/Links";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const [showLoader, setShowLoader] = useState(true);
  const location = useLocation();

  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 1100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950/90 text-slate-100">
      {showLoader && <Loader />}

      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(6,182,212,0.15),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(56,189,248,0.12),transparent_35%),radial-gradient(circle_at_20%_80%,rgba(14,165,233,0.08),transparent_30%)]" />

      {!isAuthPage && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/links" element={<Links />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
