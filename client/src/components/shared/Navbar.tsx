import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { apiFetch } from '@/lib/api'
import {
  FiArrowRight,
  FiChevronDown,
  FiLogOut,
  FiFolder,
  FiCheckCircle,
  FiSettings,
} from 'react-icons/fi'
import { FaGraduationCap } from 'react-icons/fa'
import logo from '../../assets/logo.png'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export interface UserProfile {
  name: string
  email: string
  role?: string
  university?: string
  department?: string
  gradYear?: string
  readinessScore?: number
  projectsCount?: number
  avatarUrl?: string
}

interface NavbarProps {
  isLoggedIn?: boolean
  user?: UserProfile
  onLogout?: () => void
}

const defaultDemoUser: UserProfile = {
  name: 'Aarav Sharma',
  email: 'aarav.sharma@iitb.ac.in',
  role: 'Student',
  university: 'IIT Bombay',
  department: 'Computer Science & Engg',
  gradYear: '2026',
  readinessScore: 87,
  projectsCount: 4,
}

const Navbar = ({
  isLoggedIn: propIsLoggedIn,
  user: propUser,
  onLogout,
}: NavbarProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const authUser = useAuthStore((state) => state.user)
  const clearUser = useAuthStore((state) => state.clearUser)

  // Initialize user state from props or demo default
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    if (propUser) return propUser
    if (propIsLoggedIn !== undefined) {
      return propIsLoggedIn ? defaultDemoUser : null
    }
    // Default demo session for immediate UI preview
    return defaultDemoUser
  })

  // Sync current user from props or auth store
  useEffect(() => {
    if (propUser !== undefined) {
      setCurrentUser(propUser)
      return
    }
    if (propIsLoggedIn !== undefined) {
      setCurrentUser(propIsLoggedIn ? defaultDemoUser : null)
      return
    }
    if (authUser) {
      setCurrentUser({
        name: authUser.name,
        email: '',
        role: authUser.role === 'STUDENT' ? 'Student' : 'TPO',
        university: authUser.university?.name || '',
      })
    } else {
      setCurrentUser(null)
    }
  }, [propIsLoggedIn, propUser, authUser])

  // Click-outside listener to close the profile card
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsProfileOpen(false)
      }
    }

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isProfileOpen])

  const handleLogout = async () => {
    try {
      await apiFetch('/api/auth/logout', {
        method: 'POST',
      })
    } catch {
      // Ignore
    }
    clearUser()
    setCurrentUser(null)
    setIsProfileOpen(false)
    if (onLogout) {
      onLogout()
    }
    navigate('/login')
  }

  // Get initials for avatar fallback (e.g., "AS" for "Aarav Sharma")
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logo} alt="ProjectForge" className="h-8 w-8 object-contain" />
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Project<span className="text-blue-600">Forge</span>
          </span>
        </Link>

        {/* Navigation Links */}
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

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            /* ── User Profile Trigger & Shadcn Dropdown Card ── */
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className={`flex items-center gap-2.5 rounded-full border border-slate-200/80 bg-white py-1.5 pl-1.5 pr-3 shadow-xs transition-all hover:border-slate-300 hover:bg-slate-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  isProfileOpen ? 'ring-2 ring-blue-500/20 border-blue-300 bg-slate-50' : ''
                }`}
                aria-expanded={isProfileOpen}
                aria-haspopup="true"
              >
                {/* Avatar with active green status dot */}
                <div className="relative">
                  <Avatar className="h-8 w-8 ring-1 ring-slate-200">
                    <AvatarFallback className="bg-blue-600 font-bold text-white text-xs">
                      {getInitials(currentUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                </div>

                <div className="hidden text-left sm:block">
                  <span className="block text-xs font-semibold text-slate-800 leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="block text-[10px] text-slate-400 font-medium">
                    {currentUser.role || 'Student'}
                  </span>
                </div>

                <FiChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                    isProfileOpen ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>

              {/* ── Shadcn User Profile Card ── */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-88 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                  <Card className="rounded-2xl border-slate-200/90 bg-white p-5 shadow-2xl shadow-slate-300/60">
                    {/* Card Header: Avatar + User Info */}
                    <div className="flex items-start gap-3.5 pb-4 border-b border-slate-100">
                      <Avatar className="h-12 w-12 ring-2 ring-blue-100 shrink-0">
                        <AvatarFallback className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-sm font-bold text-white">
                          {getInitials(currentUser.name)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="truncate text-sm font-bold text-slate-900">
                            {currentUser.name}
                          </h4>
                          <Badge variant="success" className="text-[10px] px-2 py-0.5 shrink-0">
                            Active
                          </Badge>
                        </div>
                        <p className="truncate text-xs text-slate-500 font-mono mt-0.5">
                          {currentUser.email}
                        </p>
                        <Badge
                          variant="secondary"
                          className="mt-1.5 text-[10px] bg-slate-100 text-slate-700 font-medium border-slate-200"
                        >
                          {currentUser.role || 'Student'}
                        </Badge>
                      </div>
                    </div>

                    {/* Academic / Institutional Details */}
                    {currentUser.university && (
                      <div className="my-3.5 rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs">
                        <div className="flex items-center gap-2 font-semibold text-slate-800">
                          <FaGraduationCap className="h-4 w-4 text-blue-600 shrink-0" />
                          <span className="truncate">{currentUser.university}</span>
                        </div>
                        {currentUser.department && (
                          <p className="mt-1 text-[11px] text-slate-500 pl-6">
                            {currentUser.department} {currentUser.gradYear && `• Class of '${currentUser.gradYear.slice(-2)}`}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Mini Readiness & Project Statistics */}
                    <div className="grid grid-cols-2 gap-2 my-3 text-center">
                      <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-2.5">
                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          Readiness Score
                        </span>
                        <div className="mt-0.5 flex items-center justify-center gap-1 font-bold text-slate-900">
                          <FiCheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                          <span>{currentUser.readinessScore || 87}</span>
                          <span className="text-[10px] text-slate-400 font-normal">/ 100</span>
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-2.5">
                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          Audited Projects
                        </span>
                        <span className="mt-0.5 block font-bold text-slate-900">
                          {currentUser.projectsCount || 4} Verified
                        </span>
                      </div>
                    </div>

                    {/* Navigation Actions */}
                    <div className="space-y-1 pt-2 border-t border-slate-100">
                      <Link
                        to="/analysedprojects"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-blue-600"
                      >
                        <div className="flex items-center gap-2.5">
                          <FiFolder className="h-4 w-4 text-slate-400" />
                          <span>My Evaluated Projects</span>
                        </div>
                        <FiArrowRight className="h-3.5 w-3.5 text-slate-400" />
                      </Link>

                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-blue-600"
                      >
                        <div className="flex items-center gap-2.5">
                          <FiSettings className="h-4 w-4 text-slate-400" />
                          <span>Account & Preferences</span>
                        </div>
                        <FiArrowRight className="h-3.5 w-3.5 text-slate-400" />
                      </Link>
                    </div>

                    {/* Logout Button */}
                    <div className="mt-3 pt-2 border-t border-slate-100">
                      <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full justify-center gap-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 cursor-pointer h-9 rounded-xl"
                      >
                        <FiLogOut className="h-3.5 w-3.5" />
                        Log Out of ProjectForge
                      </Button>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          ) : (
            /* ── Sign In Option (when logged out) ── */
            <Link
              to="/login"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Sign In
            </Link>
          )}

          {/* Analyze Repo Action */}
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