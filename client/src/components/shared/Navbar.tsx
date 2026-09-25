import React from 'react'
import { FiArrowRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'

const Navbar = () => {
  return (
          <header className="border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} alt="ProjectForge" className="h-8 w-8 object-contain" />
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Project<span className="text-blue-600">Forge</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#features" className="transition-colors hover:text-blue-600">
              Features
            </a>
            <a href="#how-it-works" className="transition-colors hover:text-blue-600">
              How it Works
            </a>
            <a href="#dimensions" className="transition-colors hover:text-blue-600">
              Rubric
            </a>
            <a href="#colleges" className="transition-colors hover:text-blue-600">
              For Colleges
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Sign In
            </Link>
            <Link
              to="/analyse"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-500/25 transition hover:bg-blue-700"
            >
              Analyze Repo
              <FiArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>
  )
}

export default Navbar