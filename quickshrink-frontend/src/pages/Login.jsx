import { Link } from "react-router-dom";
import AuthField from "../components/AuthField";
import SocialRow from "../components/SocialRow";
import loginbg from "../assets/loginback.jpg";

const Login = () => (
  <div className="relative min-h-[calc(100vh-64px)] bg-slate-100 shadow-2xl">
    <div className="absolute right-4 top-4 z-10">
      <Link
        to="/"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-slate-100 shadow hover:bg-slate-800"
        aria-label="Close"
      >
        ✕
      </Link>
    </div>
    <div className="grid min-h-[calc(100vh-64px)] gap-0 border-t border-slate-200 bg-white lg:grid-cols-[1.05fr_0.95fr]">
      <div className="flex flex-col px-8 pb-12 pt-6 sm:px-12 sm:pt-10">
        <div className="mb-6 space-y-1">
          <h1 className="text-4xl font-black text-slate-800">Log In</h1>
          <p className="text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="font-semibold text-[#0077a8] underline-offset-2 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>

        <form className="space-y-4">
          <AuthField id="login-email" label="Email" placeholder="Enter Email Address" />
          <AuthField id="login-password" label="Password" type="password" placeholder="Enter Password" rightIcon="👁" />

          <div className="flex items-center justify-between text-sm text-slate-600">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" className="rounded border-slate-400 text-brand-500" />
              <span>Keep me logged in</span>
            </label>
            <button type="button" className="font-semibold text-[#0077a8] hover:underline">
              Forgot password?
            </button>
          </div>

          <button
            type="button"
            className="flex w-full items-center justify-center rounded bg-slate-400 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-500"
          >
            Log In
          </button>
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

export default Login;

