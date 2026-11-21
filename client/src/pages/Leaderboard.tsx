import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  FiAward,
  FiExternalLink,
  FiFilter,
  FiLoader,
  FiSearch,
} from 'react-icons/fi'
import { FaGraduationCap } from 'react-icons/fa'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { apiFetch } from '@/lib/api'

interface LeaderboardEntry {
  rank: number
  submissionId: number
  studentName: string
  studentId: number
  graduationYear: number | null
  repoUrl: string
  score: number
  badge: 'GOLD' | 'SILVER' | 'BRONZE' | 'NEEDS_WORK'
  createdAt: string
}

interface LeaderboardResponse {
  university: { id: number; name: string }
  leaderboard: LeaderboardEntry[]
}

const badgeColorMap: Record<string, string> = {
  GOLD: 'bg-amber-100 text-amber-800 border-amber-300',
  SILVER: 'bg-slate-100 text-slate-800 border-slate-300',
  BRONZE: 'bg-orange-100 text-orange-800 border-orange-300',
  NEEDS_WORK: 'bg-rose-100 text-rose-800 border-rose-300',
}

const Leaderboard = () => {
  const [search, setSearch] = useState('')
  const [selectedBadge, setSelectedBadge] = useState<string>('ALL')

  const { data, isLoading } = useQuery<LeaderboardResponse>({
    queryKey: ['university-leaderboard'],
    queryFn: async () => {
      const res = await apiFetch('/api/submissions/leaderboard')
      if (!res.ok) throw new Error('Failed to load university leaderboard')
      return res.json()
    },
  })

  const universityName = data?.university?.name || 'Your University'
  const entries = data?.leaderboard || []

  const filteredEntries = entries.filter((item) => {
    const matchesSearch =
      item.studentName.toLowerCase().includes(search.toLowerCase()) ||
      item.repoUrl.toLowerCase().includes(search.toLowerCase())
    const matchesBadge = selectedBadge === 'ALL' || item.badge === selectedBadge
    return matchesSearch && matchesBadge
  })

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <Badge className="gap-1.5 text-xs font-semibold">
            <FaGraduationCap className="h-3.5 w-3.5 text-blue-600" />
            CAMPUS PLACEMENT RANKING
          </Badge>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            {universityName} Leaderboard
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
            Ranked by deterministic code architecture, security hygiene, and engineering test coverage.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name or repository..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex items-center gap-2">
            <FiFilter className="h-4 w-4 text-slate-400" />
            <select
              value={selectedBadge}
              onChange={(e) => setSelectedBadge(e.target.value)}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none transition focus:border-blue-500"
            >
              <option value="ALL">All Badges</option>
              <option value="GOLD">Gold</option>
              <option value="SILVER">Silver</option>
              <option value="BRONZE">Bronze</option>
              <option value="NEEDS_WORK">Needs Work</option>
            </select>
          </div>
        </div>

        {/* Leaderboard Table / Cards */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <FiLoader className="h-7 w-7 animate-spin text-blue-600" />
              <p className="text-sm font-medium text-slate-500">Loading campus leaderboard...</p>
            </div>
          </div>
        ) : filteredEntries.length === 0 ? (
          <Card className="mt-6 p-10 text-center">
            <h3 className="text-base font-bold text-slate-900">No Candidates Found</h3>
            <p className="mt-1 text-xs text-slate-500">
              No project audits match your filters or no students have completed an audit yet.
            </p>
          </Card>
        ) : (
          <div className="mt-6 space-y-3">
            {filteredEntries.map((entry) => {
              const repoBasename = entry.repoUrl.replace(/^https?:\/\/(www\.)?github\.com\//i, '')
              const isTopThree = entry.rank <= 3

              return (
                <Card
                  key={entry.submissionId}
                  className={`flex flex-col justify-between gap-4 p-4 transition-all hover:shadow-md sm:flex-row sm:items-center ${
                    isTopThree ? 'border-blue-200 bg-blue-50/20' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank Circle */}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-black text-sm ${
                        entry.rank === 1
                          ? 'bg-amber-400 text-amber-950 shadow-sm'
                          : entry.rank === 2
                          ? 'bg-slate-300 text-slate-900'
                          : entry.rank === 3
                          ? 'bg-orange-300 text-orange-950'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      #{entry.rank}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900">{entry.studentName}</h4>
                        {entry.graduationYear && (
                          <span className="text-[11px] font-medium text-slate-400">
                            Class of '{String(entry.graduationYear).slice(-2)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="font-mono text-slate-600 truncate max-w-xs">{repoBasename}</span>
                        <a
                          href={entry.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-blue-600"
                        >
                          <FiExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t pt-3 sm:border-0 sm:pt-0">
                    <span
                      className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${
                        badgeColorMap[entry.badge] || ''
                      }`}
                    >
                      <span className="inline-flex items-center gap-1">
                        <FiAward className="h-3 w-3" /> {entry.badge}
                      </span>
                    </span>

                    <div className="flex items-center gap-1 font-black text-slate-900">
                      <span className="text-xl">{entry.score}</span>
                      <span className="text-xs font-normal text-slate-400">/ 100</span>
                    </div>

                    <Link
                      to={`/report/${entry.submissionId}`}
                      className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-600 hover:text-white transition-colors"
                    >
                      Report
                    </Link>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Leaderboard
