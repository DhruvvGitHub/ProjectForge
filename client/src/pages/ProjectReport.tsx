import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  FiArrowLeft,
  FiAward,
  FiCheckCircle,
  FiAlertTriangle,
  FiCode,
  FiGitCommit,
  FiShield,
  FiHelpCircle,
  FiExternalLink,
  FiLoader,
} from 'react-icons/fi'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { apiFetch } from '@/lib/api'

const badgeColors: Record<string, { bg: string; text: string; border: string }> = {
  ELITE: { bg: 'bg-cyan-50', text: 'text-cyan-800', border: 'border-cyan-300' },
  GOLD: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-300' },
  SILVER: { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300' },
  BRONZE: { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-300' },
  NEEDS_WORK: { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-300' },
}

const ProjectReport = () => {
  const { id } = useParams<{ id: string }>()

  const { data, isLoading, error } = useQuery({
    queryKey: ['report', id],
    queryFn: async () => {
      const res = await apiFetch(`/api/submissions/${id}`)
      if (!res.ok) throw new Error('Failed to load submission report')
      return res.json()
    },
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafbfc]">
        <Navbar />
        <div className="flex h-96 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <FiLoader className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-sm font-medium text-slate-500">Loading evaluation report...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !data?.submission) {
    return (
      <div className="min-h-screen bg-[#fafbfc]">
        <Navbar />
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <h2 className="text-xl font-bold text-slate-900">Report Not Found</h2>
          <p className="mt-2 text-sm text-slate-500">
            Could not retrieve evaluation details for submission #{id}.
          </p>
          <Button asChild className="mt-6">
            <Link to="/analyse">Return to Analyze</Link>
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  const sub = data.submission
  const metrics = sub.metricsJson || {}
  const feedback = sub.feedbackJson || {}
  const badgeStyle = badgeColors[sub.badge || 'NEEDS_WORK'] || badgeColors.NEEDS_WORK

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/analyse"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <FiArrowLeft className="h-3.5 w-3.5" /> Back to Analyzer
          </Link>
          <a
            href={sub.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:underline"
          >
            View GitHub Repository <FiExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Hero Score Card */}
        <Card className="overflow-hidden border border-slate-200 p-8 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Audited Submission #{sub.id}
              </span>
              <h1 className="mt-1 text-2xl font-extrabold text-slate-900">{sub.repoUrl}</h1>
              <p className="mt-1 text-xs text-slate-500">
                Analyzed on {new Date(sub.createdAt).toLocaleDateString()} for candidate{' '}
                <span className="font-semibold text-slate-700">{sub.user?.name}</span>
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div
                className={`rounded-2xl border px-4 py-2.5 text-center font-bold tracking-wide ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
              >
                <div className="flex items-center gap-1.5 text-sm">
                  <FiAward className="h-4 w-4" /> {sub.badge || 'UNRANKED'}
                </div>
              </div>

              <div className="flex h-20 w-20 flex-col items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                <span className="text-2xl font-black leading-none">{sub.score ?? 0}</span>
                <span className="text-[10px] font-medium tracking-wider uppercase text-blue-100">
                  / 100
                </span>
              </div>
            </div>
          </div>

          {feedback.summary && (
            <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-sm leading-relaxed text-blue-900">
              <span className="font-semibold">Executive Appraisal: </span>
              {feedback.summary}
            </div>
          )}
        </Card>

        {/* Category Breakdown Grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
              <FiCode className="h-4 w-4 text-blue-600" /> Architecture
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {metrics.architecture?.score ?? '-'}/100
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {metrics.architecture?.has_readme ? 'README included' : 'No README'}
            </p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
              <FiCheckCircle className="h-4 w-4 text-emerald-600" /> Testing
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {metrics.testing?.score ?? '-'}/100
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {metrics.testing?.test_file_count ?? 0} test specs detected
            </p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
              <FiShield className="h-4 w-4 text-indigo-600" /> Security
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {metrics.security?.score ?? '-'}/100
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {metrics.security?.passed ? 'No leaked credentials' : 'Issues flagged'}
            </p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
              <FiGitCommit className="h-4 w-4 text-amber-600" /> Git Depth
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {metrics.git?.score ?? '-'}/100
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {metrics.git?.commit_count ?? 0} commits inspected
            </p>
          </Card>
        </div>

        {/* Strengths & Improvements */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Key Strengths */}
          <Card className="p-6">
            <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <FiCheckCircle className="h-5 w-5 text-emerald-600" /> Verified Strengths
            </h3>
            <ul className="mt-4 space-y-3">
              {(feedback.strengths && feedback.strengths.length > 0
                ? feedback.strengths
                : ['Basic code structure detected.']
              ).map((s: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Actionable Improvements */}
          <Card className="p-6">
            <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <FiAlertTriangle className="h-5 w-5 text-amber-600" /> Critical Improvements
            </h3>
            <ul className="mt-4 space-y-3">
              {(feedback.improvements && feedback.improvements.length > 0
                ? feedback.improvements
                : ['Ensure comprehensive automated testing suites are included.']
              ).map((imp: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Placement Technical Interview Questions */}
        {feedback.interviewQuestions && feedback.interviewQuestions.length > 0 && (
          <Card className="mt-8 border border-slate-200 p-6">
            <div className="flex items-center gap-2">
              <FiHelpCircle className="h-5 w-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                Likely Technical Interview Questions
              </h3>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Questions recruiters and technical interviewers are expected to ask about this codebase.
            </p>

            <div className="mt-4 space-y-3">
              {feedback.interviewQuestions.map((q: string, idx: number) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 text-sm font-medium text-slate-800"
                >
                  <span className="mr-2 font-bold text-blue-600">Q{idx + 1}:</span>
                  {q}
                </div>
              ))}
            </div>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default ProjectReport
