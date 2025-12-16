import { Link } from "react-router-dom";
import AuthField from "../components/AuthField";
import PasswordField from "../components/PasswordField";
import SocialRow from "../components/SocialRow";
import loginbg from "../assets/loginback.jpg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("")

  const handleSignup = async () => {
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      navigate("/login");
    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-100 shadow-2xl">
      <div className="absolute right-4 top-4 z-10">
        <Link
          to="/"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-slate-100 shadow hover:bg-slate-800"
          aria-label="Close"
        >
          ✕
        </Link>
      </div>
      <div className="grid min-h-screen gap-0 bg-white lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col px-8 pb-12 pt-6 sm:px-12 sm:pt-10">
          <div className="mb-6 space-y-1">
            <h1 className="text-4xl font-black text-slate-800">Sign Up</h1>
            <p className="text-sm text-slate-600">
              Already a user?{" "}
              <Link to="/login" className="font-semibold text-[#0077a8] underline-offset-2 hover:underline">
                Log In
              </Link>
            </p>
          </div>

          <form className="space-y-4">
            <AuthField
              label="Name"
              placeholder="Enter Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <AuthField
              label="Email"
              placeholder="Enter Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordField
               id="password"
               label="Password"
               placeholder="Create password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
            />

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="h-1.5 flex-1 rounded bg-gradient-to-r from-slate-300 via-amber-300 to-green-400" />
                <span>Security</span>
                <span className="text-slate-500">ⓘ</span>
              </div>
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center rounded bg-slate-400 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-500"
              onClick={handleSignup}
            >
              Sign Up
            </button>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <p className="text-[12px] leading-relaxed text-slate-500">
              By Signing Up, you agree to our Terms of Service, Privacy Policy, and Use of Cookies.
            </p>
          </form>

          <div className="my-6 flex items-center gap-4 text-sm font-semibold text-slate-500">
            <div className="h-px flex-1 bg-slate-300" />
            <span>or</span>
            <div className="h-px flex-1 bg-slate-300" />
          </div>

          <SocialRow />
        </div>

        <div
          className="relative h-full w-full"
          style={{
            backgroundImage: `url(${loginbg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>
    </div>
  );
}

export default Signup;

