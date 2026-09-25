import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'

const Footer = () => {
  return (
          <footer className="border-t border-slate-200 bg-white py-12 text-sm text-slate-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
            {/* Brand Col */}
            <div className="col-span-2">
              <div className="flex items-center gap-2.5">
                <img src={logo} alt="ProjectForge" className="h-7 w-7 object-contain" />
                <span className="text-lg font-bold text-slate-900">
                  Project<span className="text-blue-600">Forge</span>
                </span>
              </div>
              <p className="mt-3 max-w-sm text-xs leading-relaxed text-slate-500">
                Automated student project evaluation platform turning raw GitHub repositories into
                verified placement-ready proof.
              </p>
              <p className="mt-4 text-xs text-slate-400">
                © {new Date().getFullYear()} ProjectForge. All rights reserved.
              </p>
            </div>

            {/* Links 1 */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Product
              </span>
              <ul className="mt-3 space-y-2 text-xs">
                <li>
                  <a href="#features" className="hover:text-blue-600">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-blue-600">
                    How it Works
                  </a>
                </li>
                <li>
                  <a href="#dimensions" className="hover:text-blue-600">
                    Rubric
                  </a>
                </li>
                <li>
                  <Link to="/analyse" className="hover:text-blue-600">
                    Analyze Repo
                  </Link>
                </li>
              </ul>
            </div>

            {/* Links 2 */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Solutions
              </span>
              <ul className="mt-3 space-y-2 text-xs">
                <li>
                  <a href="#how-it-works" className="hover:text-blue-600">
                    For Students
                  </a>
                </li>
                <li>
                  <a href="#colleges" className="hover:text-blue-600">
                    For Colleges & TPOs
                  </a>
                </li>
                <li>
                  <Link to="/login" className="hover:text-blue-600">
                    Recruiter View
                  </Link>
                </li>
                <li>
                  <a href="#features" className="hover:text-blue-600">
                    Batch Scoring
                  </a>
                </li>
              </ul>
            </div>

            {/* Links 3 */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Account
              </span>
              <ul className="mt-3 space-y-2 text-xs">
                <li>
                  <Link to="/login" className="hover:text-blue-600">
                    Student Login
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-blue-600">
                    TPO / Admin Login
                  </Link>
                </li>
                <li>
                  <Link to="/analyse" className="hover:text-blue-600">
                    Quick Audit
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
  )
}

export default Footer