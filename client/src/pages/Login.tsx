import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import { useAuthStore } from '../store/authStore';

const Login = () => {
  const [role, setRole] = useState<"student" | "admin">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();


  // inside the component, at the top level:

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiBase}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          role: role === "admin" ? "TPO" : "STUDENT",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Invalid credentials");
      }

      setAuth(data.user);

      setSuccessMessage("Login successful! Redirecting...");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-5">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-1 mb-6 text-slate-500">
            Sign in to continue to ProjectForge.
          </p>

          <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => {
                setRole("student");
                setErrorMessage("");
              }}
              className={`h-10 rounded-lg text-sm font-semibold cursor-pointer ${role === "student"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500"
                }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => {
                setRole("admin");
                setErrorMessage("");
              }}
              className={`h-10 rounded-lg text-sm font-semibold cursor-pointer ${role === "admin"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500"
                }`}
            >
              TPO / Admin
            </button>
          </div>

          <p className="mt-4 mb-5 flex items-center gap-2 text-sm font-semibold text-blue-600">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            Logging in as {role === "student" ? "Student" : "TPO / Admin"}
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {errorMessage && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700">
                {successMessage}
              </div>
            )}

            <label className="block text-sm font-semibold text-slate-800">
              Email address
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition"
              />
            </label>

            <label className="block text-sm font-semibold text-slate-800">
              Password
              <div className="relative mt-1.5">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 pr-14 text-sm outline-none focus:border-blue-500 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 cursor-pointer"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`h-12 w-full rounded-xl text-white font-semibold transition cursor-pointer ${isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:scale-[0.99]"
                }`}
            >
              {isLoading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-[11px] font-bold tracking-widest text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            OR CONTINUE WITH
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="h-11 rounded-xl cursor-pointer border border-slate-200 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 transition"
            >
              <FcGoogle />
              Google
            </button>
            <button
              type="button"
              className="h-11 rounded-xl cursor-pointer border border-slate-200 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 transition"
            >
              <FaGithub />
              GitHub
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;