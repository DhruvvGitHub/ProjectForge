import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  FiArrowRight,
  FiCheck,
  FiGitBranch,
  FiGithub,
  FiLock,
  FiSearch,
  FiLoader,
  FiAlertCircle,
} from 'react-icons/fi'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { apiFetch } from '@/lib/api'

const dimensions = [
  'Architecture & Design',
  'Code Quality & Style',
  'Testing & Coverage',
  'Documentation & Readme',
  'Security & Auth',
  'Deployment & CI/CD',
]

const AnalyseProject = () => {
  const navigate = useNavigate()
  const [repoUrl, setRepoUrl] = useState('')
  const [branch, setBranch] = useState('main')
  const [submitting, setSubmitting] = useState(false)
  const [activeSubmissionId, setActiveSubmissionId] = useState<number | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Poll status endpoint while analysis is running
  const { data: statusData } = useQuery({
    queryKey: ['submission-status', activeSubmissionId],
    queryFn: async () => {
      if (!activeSubmissionId) return null
      const res = await apiFetch(`/api/submissions/${activeSubmissionId}`)
      if (!res.ok) throw new Error('Failed to fetch status')
      return res.json()
    },
    enabled: !!activeSubmissionId,
    refetchInterval: (query) => {
      const status = query.state.data?.submission?.status
      if (status === 'COMPLETED' || status === 'FAILED') {
        return false
      }
      return 2500
    },
  })

  const currentSubmission = statusData?.submission

  // When completed, allow one-click jump to report
  const isCompleted = currentSubmission?.status === 'COMPLETED'
  const isFailed = currentSubmission?.status === 'FAILED'

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    setSubmitting(true)

    try {
      const res = await apiFetch('/api/submissions', {
        method: 'POST',
        body: JSON.stringify({ repoUrl: repoUrl.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        setSubmitError(data.error || 'Failed to submit repository')
        setSubmitting(false)
        return
      }

      setActiveSubmissionId(data.submission.id)
    } catch {
      setSubmitError('Network error connecting to analysis server')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge className="gap-2 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            LIVE REPO AUDIT
          </Badge>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Analyze a GitHub Repository
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500 sm:text-base">
            Paste a public repo URL. ProjectForge performs deep static verification and AI evaluation
            to produce an evidence-backed campus placement score.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-5">
          <Card className="p-6 hover:shadow-md lg:col-span-3">
            <form className="space-y-5" onSubmit={handleAnalyze}>
              <label className="block text-sm font-semibold text-slate-800">
                GitHub repository URL
                <div className="relative mt-1.5">
                  <FiGithub className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="url"
                    required
                    value={repoUrl}
                    disabled={!!activeSubmissionId && !isCompleted && !isFailed}
                    onChange={(e) => {
                      setRepoUrl(e.target.value)
                      setSubmitError(null)
                    }}
                    placeholder="https://github.com/username/project"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white disabled:opacity-60"
                  />
                </div>
              </label>

              <label className="block text-sm font-semibold text-slate-800">
                Target branch
                <div className="relative mt-1.5">
                  <FiGitBranch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={branch}
                    disabled={!!activeSubmissionId && !isCompleted && !isFailed}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="main"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white disabled:opacity-60"
                  />
                </div>
              </label>

              <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-xs text-slate-500">
                <FiLock className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                Public repositories only. Cloned temporarily in isolated memory.
              </div>

              {submitError && (
                <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-medium text-rose-700">
                  <FiAlertCircle className="h-4 w-4 shrink-0" />
                  {submitError}
                </div>
              )}

              {/* Live polling progress indicator */}
              {activeSubmissionId && !isCompleted && !isFailed && (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                  <div className="flex items-center gap-3">
                    <FiLoader className="h-5 w-5 animate-spin text-blue-600" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900">Auditing repository...</p>
                      <p className="text-xs text-blue-700">
                        Running multi-tier inspection: Git depth, architecture, testing, and security.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Success notification */}
              {isCompleted && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-emerald-900">Analysis Complete!</p>
                      <p className="text-xs text-emerald-700">
                        Score: <span className="font-bold">{currentSubmission.score}/100</span> • Badge:{' '}
                        <span className="font-bold">{currentSubmission.badge}</span>
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => navigate(`/report/${activeSubmissionId}`)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      View Report <FiArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Failure notification */}
              {isFailed && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
                  <p className="text-sm font-bold text-rose-900">Analysis Failed</p>
                  <p className="text-xs text-rose-700 mt-1">
                    {currentSubmission.errorMessage || 'Failed to inspect this repository.'}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={submitting || (!!activeSubmissionId && !isCompleted && !isFailed)}
                className="w-full gap-2 shadow-md shadow-blue-600/20"
              >
                {submitting ? (
                  <>
                    <FiLoader className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FiSearch className="h-4 w-4" />
                    {activeSubmissionId && (isCompleted || isFailed) ? 'Analyze Another Repository' : 'Analyze Repository'}
                    <FiArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Card>

          <div className="space-y-4 lg:col-span-2">
            <Card className="p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                What we evaluate
              </p>
              <h2 className="mt-1 text-lg font-bold text-slate-900">Six quality dimensions</h2>
              <ul className="mt-4 space-y-2.5">
                {dimensions.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-slate-700">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <FiCheck className="h-3 w-3" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Typical output</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">AI Readiness Score + action items</p>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                You get a 0–100 score, evidence-backed badges, security flags, and interview questions tailored specifically to your codebase.
              </p>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default AnalyseProject
