import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { apiFetch } from '../lib/api';

const Login = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data?.user) {
        setUser(data.user);
        if (data.user.role === 'TPO') {
          navigate('/tpo-dashboard');
        } else {
          navigate('/dashboard');
        }
        return;
      } else {
        setError(data?.error || 'Invalid credentials');
      }
    } catch {
      setError('Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600 font-medium">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSignIn}>
          <label className="block text-sm font-semibold text-slate-800">
            Email address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm outline-none focus:border-blue-300"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-800">
            Password
            <div className="relative mt-1.5">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 pr-14 text-sm outline-none focus:border-blue-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          <div className="flex justify-end">
            <button type="button" className="text-sm font-semibold text-blue-600">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-xl bg-slate-900 text-white font-semibold cursor-pointer disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

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

        <div className="grid grid-cols-2 gap-3">
          <button type="button" className="h-11 rounded-xl cursor-pointer border border-slate-200 text-sm font-semibold flex items-center justify-center gap-2 ">
            <FcGoogle />
            Google
          </button>
          <button type="button" className="h-11 rounded-xl cursor-pointer border border-slate-200 text-sm font-semibold flex items-center justify-center gap-2">
            <FaGithub />
            GitHub
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-semibold text-blue-600 cursor-pointer hover:underline">
            Create account
          </Link>
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
