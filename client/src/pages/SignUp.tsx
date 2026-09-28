import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    FiUser,
    FiCheckCircle,
    FiCheck,
    FiEye,
    FiEyeOff,
    FiSearch,
    FiLock,
    FiChevronDown,
    FiArrowRight,
} from 'react-icons/fi'
import logo from '../assets/logo.png'
import { useAuthStore } from '../store/authStore'
import { apiFetch } from '../lib/api'

interface UniversityItem {
    id: number
    name: string
    state: string
    district: string
}

const SignUp = () => {
    const currentYear = new Date().getFullYear()
    const gradYears = Array.from({ length: 6 }, (_, i) => currentYear - 1 + i)
    const setUser = useAuthStore((state) => state.setUser)

    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [university, setUniversity] = useState('')
    const [selectedUniversity, setSelectedUniversity] = useState<UniversityItem | null>(null)
    const [universitiesList, setUniversitiesList] = useState<UniversityItem[]>([])
    const [isSearchingUni, setIsSearchingUni] = useState(false)
    const [showUniDropdown, setShowUniDropdown] = useState(false)
    const uniDropdownRef = useRef<HTMLDivElement>(null)

    const [department, setDepartment] = useState('')
    const [gradYear, setGradYear] = useState('')
    const [agreedToTerms, setAgreedToTerms] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    // Fetch university suggestions when user types >= 2 letters
    useEffect(() => {
        const query = university.trim()
        if (query.length < 2) {
            setUniversitiesList([])
            setShowUniDropdown(false)
            return
        }

        // Avoid re-searching if this exact university is already selected
        if (selectedUniversity && selectedUniversity.name === university) {
            return
        }

        const timer = setTimeout(async () => {
            setIsSearchingUni(true)
            try {
                const res = await apiFetch(`/api/universities?q=${encodeURIComponent(query)}`)
                if (res.ok) {
                    const data = await res.json()
                    setUniversitiesList(data)
                    setShowUniDropdown(true)
                }
            } catch (err) {
                console.error("Error fetching universities:", err)
            } finally {
                setIsSearchingUni(false)
            }
        }, 200)

        return () => clearTimeout(timer)
    }, [university, selectedUniversity])

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (uniDropdownRef.current && !uniDropdownRef.current.contains(e.target as Node)) {
                setShowUniDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!passwordsMatch) {
            setError('Passwords do not match')
            return
        }
        if (!selectedUniversity) {
            setError('Please select a university from the suggestion list to proceed.')
            return
        }
        setError('')
        setLoading(true)
        try {
            const res = await apiFetch('/api/auth/signup', {
                method: 'POST',
                body: JSON.stringify({
                    fullName,
                    email,
                    password,
                    universityId: selectedUniversity.id,
                    university: selectedUniversity.name,
                    department,
                    graduationYear: gradYear ? Number(gradYear) : undefined,
                }),
            })
            const data = await res.json()
            if (res.ok && data?.user) {
                setUser(data.user)
                if (data.user.role === 'TPO') {
                    navigate('/tpo-dashboard')
                } else {
                    navigate('/dashboard')
                }
                return
            } else {
                setError(data?.error || 'Signup failed')
            }
        } catch {
            setError('Unable to connect to server')
        } finally {
            setLoading(false)
        }
    }

    const isAcademicEmail =
        email.includes('.edu') ||
        email.includes('.ac.') ||
        email.includes('stanford') ||
        email.includes('iit') ||
        email.includes('mit')
    const passwordsMatch = password.length > 0 && password === confirmPassword

    return (
        <div className="min-h-screen bg-[#f8fafc] py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
            {/* Brand Header */}
            <Link to="/" className="mb-6 flex items-center gap-2.5">
                <img src={logo} alt="ProjectForge" className="h-8 w-8 object-contain" />
                <span className="text-xl font-bold tracking-tight text-slate-900">
                    Project<span className="text-blue-600">Forge</span>
                </span>
            </Link>

            {/* Main Card */}
            <div className="w-full max-w-xl rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-xl shadow-slate-200/60">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                        Create your ProjectForge account
                    </h1>
                    <p className="mt-1.5 text-sm text-slate-500">
                        Start evaluating your projects today.
                    </p>
                </div>

                {error && (
                    <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600 font-medium">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-5" onSubmit={handleSignUp}>
                    {/* Full Name */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700">
                            Full Name <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative mt-1.5">
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Alex Rivera"
                                required
                                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 pr-10 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                            <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                <FiUser className="h-4 w-4" />
                            </div>
                        </div>
                    </div>

                    {/* College / Personal Email */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700">
                            College / Personal Email <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative mt-1.5">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="alex.rivera@cs.stanford.edu"
                                required
                                className="h-11 w-full rounded-xl border border-emerald-500 bg-white px-3.5 pr-10 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                            />
                            <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-600">
                                <FiCheckCircle className="h-4 w-4" />
                            </div>
                        </div>
                        {isAcademicEmail && (
                            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                                <FiCheckCircle className="h-3.5 w-3.5 shrink-0" />
                                Eligible academic domain detected
                            </p>
                        )}
                    </div>

                    {/* Password & Confirm Password Row */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Password */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700">
                                Password <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative mt-1.5">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder=""
                                    required
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 pr-10 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                                >
                                    {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700">
                                Confirm Password <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative mt-1.5">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder=""
                                    required
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 pr-10 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((v) => !v)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                                >
                                    {showConfirmPassword ? (
                                        <FiEyeOff className="h-4 w-4" />
                                    ) : (
                                        <FiEye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>

                            {/* Passwords Match indicator */}
                            <div className="mt-2.5">
                                {passwordsMatch && (
                                    <p className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
                                        <FiCheck className="h-3.5 w-3.5 stroke-[2.5]" />
                                        Passwords match perfectly
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* University */}
                    <div ref={uniDropdownRef} className="relative">
                        <div className="flex items-center justify-between">
                            <label className="block text-xs font-semibold text-slate-700">
                                University <span className="text-rose-500">*</span>
                            </label>
                            {selectedUniversity && (
                                <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                                    <FiCheck className="h-3 w-3 stroke-[3]" /> Selected
                                </span>
                            )}
                        </div>
                        <div className="relative mt-1.5 flex items-center">
                            <div className="pointer-events-none absolute left-3.5 text-slate-400">
                                <FiSearch className="h-4 w-4" />
                            </div>
                            <input
                                type="text"
                                value={university}
                                onChange={(e) => {
                                    setUniversity(e.target.value)
                                    if (selectedUniversity && selectedUniversity.name !== e.target.value) {
                                        setSelectedUniversity(null)
                                    }
                                }}
                                onFocus={() => {
                                    if (university.trim().length >= 2 && universitiesList.length > 0) {
                                        setShowUniDropdown(true)
                                    }
                                }}
                                placeholder="Type at least 2 letters (e.g. Delhi, IIT, Tech)..."
                                required
                                className={`h-11 w-full rounded-xl border bg-white pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition ${
                                    selectedUniversity
                                        ? 'border-emerald-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'
                                        : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                }`}
                            />
                            {isSearchingUni && (
                                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 animate-pulse">
                                    Searching...
                                </div>
                            )}
                        </div>

                        {/* Suggestions Dropdown */}
                        {showUniDropdown && (
                            <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                                {universitiesList.length > 0 ? (
                                    universitiesList.map((item) => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedUniversity(item)
                                                setUniversity(item.name)
                                                setShowUniDropdown(false)
                                            }}
                                            className="w-full px-3.5 py-2.5 text-left text-sm hover:bg-blue-50 transition cursor-pointer flex flex-col border-b border-slate-100 last:border-b-0"
                                        >
                                            <span className="font-medium text-slate-800">{item.name}</span>
                                            {(item.district || item.state) && (
                                                <span className="text-xs text-slate-500">
                                                    {[item.district, item.state].filter(Boolean).join(', ')}
                                                </span>
                                            )}
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-3.5 py-3 text-xs text-slate-500 text-center">
                                        No universities found matching "{university}"
                                    </div>
                                )}
                            </div>
                        )}
                        {!selectedUniversity && university.trim().length >= 2 && !showUniDropdown && universitiesList.length === 0 && (
                            <p className="mt-1 text-[11px] text-amber-600">
                                No matching university found. You must select an official university from the list to sign up.
                            </p>
                        )}
                    </div>

                    {/* Department & Graduation Year */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Department */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700">
                                Department <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative mt-1.5">
                                <select
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                    required
                                    className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 pr-10 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer"
                                >
                                    <option value="" disabled>Select department</option>
                                    <option value="Computer Science">Computer Science</option>
                                    <option value="Computer Applications">Computer Applications</option>
                                    <option value="Information Technology">Information Technology</option>
                                    <option value="Electrical & Electronics">Electrical & Electronics</option>
                                    <option value="Data Science & AI">Data Science & AI</option>
                                    <option value="Software Engineering">Software Engineering</option>
                                </select>
                                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                    <FiChevronDown className="h-4 w-4" />
                                </div>
                            </div>
                        </div>

                        {/* Graduation Year */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700">
                                Graduation Year <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative mt-1.5">
                                <select
                                    value={gradYear}
                                    onChange={(e) => setGradYear(e.target.value)}
                                    required
                                    className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 pr-10 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer"
                                >
                                    <option value="" disabled>Select graduation year</option>
                                    {gradYears.map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                    <FiChevronDown className="h-4 w-4" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Terms and Conditions Checkbox */}
                    <div className="pt-1">
                        <label className="flex items-start gap-2.5 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                            <span className="text-xs text-slate-600">
                                I agree to the{' '}
                                <a href="#terms" className="font-medium text-blue-600 hover:underline">
                                    Terms of Service
                                </a>{' '}
                                and{' '}
                                <a href="#privacy" className="font-medium text-blue-600 hover:underline">
                                    Privacy Policy
                                </a>
                                .
                            </span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={!agreedToTerms || loading}
                            className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition ${
                                agreedToTerms && !loading
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 hover:bg-blue-700 active:scale-[0.99] cursor-pointer'
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                            <FiArrowRight className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Already have an account link */}
                    <div className="text-center text-xs text-slate-500">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-blue-600 hover:underline">
                            Sign in
                        </Link>
                    </div>

                    {/* Institutional Security Badge */}
                    <div className="border-t border-slate-100 pt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400">
                        <FiLock className="h-3.5 w-3.5" />
                        <span>Encrypted with 256-bit institutional security standards</span>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SignUp