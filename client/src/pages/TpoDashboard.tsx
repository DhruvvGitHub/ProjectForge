import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  FiUsers,
  FiAward,
  FiCheckCircle,
  FiExternalLink,
  FiSearch,
  FiFilter,
  FiLoader,
  FiDownload,
  FiActivity,
} from 'react-icons/fi'
import { FaGraduationCap } from 'react-icons/fa'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { apiFetch } from '@/lib/api'

interface TpoDashboardData {
  university: { id: number; name: string; state: string; district: string }
  stats: {
    totalSubmissions: number
    completedAudits: number
    uniqueStudents: number
    averageScore: number
    badgeDistribution: {
      GOLD: number
      SILVER: number
      BRONZE: number
      NEEDS_WORK: number
    }
  }
  submissions: Array<{
    id: number
    repoUrl: string
    status: string
    score: number | null
    badge: 'GOLD' | 'SILVER' | 'BRONZE' | 'NEEDS_WORK' | null
    createdAt: string
    student: {
      id: number
      name: string
      email: string
      graduationYear: number | null
    }
  }>
}

const badgeColorMap: Record<string, string> = {
  GOLD: 'bg-amber-100 text-amber-800 border-amber-300',
  SILVER: 'bg-slate-100 text-slate-800 border-slate-300',
  BRONZE: 'bg-orange-100 text-orange-800 border-orange-300',
  NEEDS_WORK: 'bg-rose-100 text-rose-800 border-rose-300',
}

const TpoDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBadge, setFilterBadge] = useState<string>('ALL')
  const [filterGradYear, setFilterGradYear] = useState<string>('ALL')

  const { data, isLoading, error } = useQuery<TpoDashboardData>({
    queryKey: ['tpo-dashboard'],
    queryFn: async () => {
      const res = await apiFetch('/api/submissions/tpo/dashboard')
      if (!res.ok) throw new Error('Failed to fetch TPO analytics')
      return res.json()
    },
  })

  const stats = data?.stats
  const submissions = data?.submissions || []

  // Extract unique graduation years for filter
  const gradYears = Array.from(
    new Set(submissions.map((s) => s.student.graduationYear).filter(Boolean))
  ).sort() as number[]

  const filtered = submissions.filter((s) => {
    const matchesSearch =
      s.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.repoUrl.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesBadge = filterBadge === 'ALL' || s.badge === filterBadge
    const matchesGradYear =
      filterGradYear === 'ALL' || String(s.student.graduationYear) === filterGradYear

    return matchesSearch && matchesBadge && matchesGradYear
  })

  // Export filtered CSV for placement drives
  const handleExportCSV = () => {
    const headers = ['Student Name', 'Email', 'Class Year', 'Repo URL', 'Score', 'Badge', 'Status']
    const rows = filtered.map((s) => [
      `"${s.student.name}"`,
      `"${s.student.email}"`,
      `"${s.student.graduationYear || 'N/A'}"`,
      `"${s.repoUrl}"`,
      s.score ?? 'N/A',
      s.badge || 'N/A',
      s.status,
    ])
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `ProjectForge_TPO_${data?.university.name || 'Campus'}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge className="gap-1.5 text-xs font-semibold">
              <FaGraduationCap className="h-3.5 w-3.5 text-blue-600" />
              OFFICIAL TPO PORTAL
            </Badge>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              {data?.university.name || 'University'} Placement Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Audit results, candidate interview readiness, and repository quality across student batches.
            </p>
          </div>

          <Button
            onClick={handleExportCSV}
            variant="outline"
            disabled={filtered.length === 0}
            className="gap-2 shadow-xs"
          >
            <FiDownload className="h-4 w-4" /> Export CSV for Recruiters
          </Button>
        </div>

        {/* Loading / Error States */}
        {isLoading ? (
          <div className="flex h-72 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <FiLoader className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-sm font-medium text-slate-500">Loading university audit stats...</p>
            </div>
          </div>
        ) : error ? (
          <Card className="mt-8 p-10 text-center">
            <h3 className="text-base font-bold text-slate-900">Access Restricted</h3>
            <p className="mt-1 text-xs text-slate-500">
              Only verified Training & Placement Officers can view this dashboard.
            </p>
          </Card>
        ) : (
          <>
            {/* KPI Cards Grid */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="p-5">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Audited Students
                  </span>
                  <FiUsers className="h-5 w-5 text-blue-600" />
                </div>
                <p className="mt-2 text-3xl font-black text-slate-900">
                  {stats?.uniqueStudents || 0}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Across {stats?.totalSubmissions || 0} total repo runs
                </p>
              </Card>

              <Card className="p-5">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Campus Readiness Avg
                  </span>
                  <FiActivity className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900">
                    {stats?.averageScore || 0}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">/ 100</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Based on {stats?.completedAudits || 0} verified repos
                </p>
              </Card>

              <Card className="p-5">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Gold Verified Repos
                  </span>
                  <FiAward className="h-5 w-5 text-amber-500" />
                </div>
                <p className="mt-2 text-3xl font-black text-slate-900">
                  {stats?.badgeDistribution.GOLD || 0}
                </p>
                <p className="mt-1 text-xs text-slate-500">Placement-ready tier</p>
              </Card>

              <Card className="p-5">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Action Needed
                  </span>
                  <FiCheckCircle className="h-5 w-5 text-rose-500" />
                </div>
                <p className="mt-2 text-3xl font-black text-slate-900">
                  {stats?.badgeDistribution.NEEDS_WORK || 0}
                </p>
                <p className="mt-1 text-xs text-slate-500">Below placement baseline</p>
              </Card>
            </div>

            {/* Filter and Search Bar */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter by student name, email, or repository..."
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex items-center gap-2">
                <FiFilter className="h-4 w-4 text-slate-400" />
                <select
                  value={filterBadge}
                  onChange={(e) => setFilterBadge(e.target.value)}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none transition focus:border-blue-500"
                >
                  <option value="ALL">All Badges</option>
                  <option value="GOLD">Gold</option>
                  <option value="SILVER">Silver</option>
                  <option value="BRONZE">Bronze</option>
                  <option value="NEEDS_WORK">Needs Work</option>
                </select>

                <select
                  value={filterGradYear}
                  onChange={(e) => setFilterGradYear(e.target.value)}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none transition focus:border-blue-500"
                >
                  <option value="ALL">All Batches</option>
                  {gradYears.map((yr) => (
                    <option key={yr} value={String(yr)}>
                      Class of '{String(yr).slice(-2)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Candidate Projects Table */}
            <Card className="mt-4 overflow-hidden border border-slate-200 shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                    <tr>
                      <th className="px-5 py-3.5">Candidate</th>
                      <th className="px-5 py-3.5">Batch</th>
                      <th className="px-5 py-3.5">Repository</th>
                      <th className="px-5 py-3.5">Badge</th>
                      <th className="px-5 py-3.5">Score</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-5 py-8 text-center text-xs text-slate-400">
                          No candidate submissions match your query.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((item) => {
                        const repoBasename = item.repoUrl.replace(
                          /^https?:\/\/(www\.)?github\.com\//i,
                          ''
                        )
                        return (
                          <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-5 py-4">
                              <p className="font-bold text-slate-900">{item.student.name}</p>
                              <p className="text-xs text-slate-400 font-mono">
                                {item.student.email}
                              </p>
                            </td>

                            <td className="px-5 py-4 text-xs font-medium text-slate-600">
                              {item.student.graduationYear
                                ? `Class of '${String(item.student.graduationYear).slice(-2)}`
                                : '—'}
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex items-center gap-1.5 font-mono text-xs text-slate-700">
                                <span className="truncate max-w-[200px]">{repoBasename}</span>
                                <a
                                  href={item.repoUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-slate-400 hover:text-blue-600"
                                >
                                  <FiExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              {item.badge ? (
                                <span
                                  className={`rounded-lg border px-2 py-0.5 text-xs font-bold ${
                                    badgeColorMap[item.badge] || ''
                                  }`}
                                >
                                  {item.badge}
                                </span>
                              ) : (
                                <Badge variant="outline" className="text-[10px]">
                                  {item.status}
                                </Badge>
                              )}
                            </td>

                            <td className="px-5 py-4">
                              {item.score !== null ? (
                                <span className="font-bold text-slate-900">{item.score}/100</span>
                              ) : (
                                <span className="text-xs text-slate-400">—</span>
                              )}
                            </td>

                            <td className="px-5 py-4 text-right">
                              <Link
                                to={`/report/${item.id}`}
                                className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-600 hover:text-white transition-colors"
                              >
                                View Report
                              </Link>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default TpoDashboard
