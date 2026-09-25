import { useState } from 'react'
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Login = () => {
  const [role, setRole] = useState<'student' | 'admin'>('student')
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-5">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
        <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="mt-1 mb-6 text-slate-500">Sign in to continue to ProjectForge.</p>

        <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`h-10 rounded-lg text-sm font-semibold ${
              role === 'student' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`h-10 rounded-lg text-sm font-semibold ${
              role === 'admin' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            TPO / Admin
          </button>
        </div>

        <p className="mt-4 mb-5 flex items-center gap-2 text-sm font-semibold text-blue-600">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          Logging in as {role === 'student' ? 'Student' : 'TPO / Admin'}
        </p>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <label className="block text-sm font-semibold text-slate-800">
            Email address
            <input
              type="email"
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
            className="h-12 w-full rounded-xl bg-slate-900 text-white font-semibold cursor-pointer"
          >
            Sign In →
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-[11px] font-bold tracking-widest text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          OR CONTINUE WITH
          <span className="h-px flex-1 bg-slate-200" />
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
          <button type="button" className="font-semibold text-blue-600 cursor-pointer">
            <Link to="/signup">Create account</Link>
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login
