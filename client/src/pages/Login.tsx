import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { apiFetch } from '../lib/api';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';

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
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-5 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-1 mb-6 text-slate-500">Sign in to continue to ProjectForge.</p>

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
                className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition"
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
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 pr-14 text-sm outline-none focus:border-blue-500 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 cursor-pointer"
                >
                  {showPassword ? 'Hide' : 'Show'}
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
              disabled={loading}
              className={`h-12 w-full rounded-xl text-white font-semibold transition cursor-pointer ${
                loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99]'
              }`}
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div className="my-4 flex items-center gap-3 text-[11px] font-bold tracking-widest text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            OR CONTINUE WITH
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              className="h-11 rounded-xl cursor-pointer border border-slate-200 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 transition px-6 py-2"
            >
              <FaGithub />
              GitHub
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <Link
              to="/signup"
              className="font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              Create account
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
