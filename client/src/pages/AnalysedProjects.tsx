import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  FiFolder,
  FiArrowRight,
  FiExternalLink,
  FiAward,
  FiClock,
  FiPlus,
  FiLoader,
  FiCode,
} from 'react-icons/fi'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { apiFetch } from '@/lib/api'

interface SubmissionItem {
  id: number
  repoUrl: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  score: number | null
  badge: 'GOLD' | 'SILVER' | 'BRONZE' | 'NEEDS_WORK' | null
  createdAt: string
}

const badgeColorMap: Record<string, string> = {
  GOLD: 'bg-amber-100 text-amber-800 border-amber-300',
  SILVER: 'bg-slate-100 text-slate-800 border-slate-300',
  BRONZE: 'bg-orange-100 text-orange-800 border-orange-300',
  NEEDS_WORK: 'bg-rose-100 text-rose-800 border-rose-300',
}

const AnalysedProjects = () => {
  const { data, isLoading } = useQuery<{ submissions: SubmissionItem[] }>({
    queryKey: ['my-submissions'],
    queryFn: async () => {
      const res = await apiFetch('/api/submissions/mine')
      if (!res.ok) throw new Error('Failed to load past submissions')
      return res.json()
    },
  })

  const submissions = data?.submissions || []

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              My Evaluated Projects
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Review verified audit history, track improvements across iterations, and view technical reports.
            </p>
          </div>

          <Button asChild className="gap-2 shadow-sm shadow-blue-600/20">
            <Link to="/analyse">
              <FiPlus className="h-4 w-4" /> Analyze New Repo
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <FiLoader className="h-7 w-7 animate-spin text-blue-600" />
              <p className="text-sm font-medium text-slate-500">Loading your project history...</p>
            </div>
          </div>
        ) : submissions.length === 0 ? (
          <Card className="mt-8 p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <FiFolder className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900">No Audited Projects Yet</h3>
            <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
              Analyze your first GitHub repository to measure its architecture, test suite, and get placement interview questions.
            </p>
            <Button asChild className="mt-5">
              <Link to="/analyse">Start First Analysis</Link>
            </Button>
          </Card>
        ) : (
          <div className="mt-8 space-y-4">
            {submissions.map((sub) => {
              const repoBasename = sub.repoUrl.replace(/^https?:\/\/(www\.)?github\.com\//i, '')
              const isCompleted = sub.status === 'COMPLETED'
              const badgeStyle = sub.badge ? badgeColorMap[sub.badge] || '' : ''

              return (
                <Card
                  key={sub.id}
                  className="flex flex-col justify-between gap-4 p-5 transition-shadow hover:shadow-md sm:flex-row sm:items-center"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                      <FiCode className="h-5 w-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900">{repoBasename}</h4>
                        <a
                          href={sub.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-blue-600"
                        >
                          <FiExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>

                      <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <FiClock className="h-3 w-3" />
                          {new Date(sub.createdAt).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span>Submission #{sub.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t pt-3 sm:border-0 sm:pt-0">
                    <div className="flex items-center gap-3">
                      {sub.badge && (
                        <span
                          className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${badgeStyle}`}
                        >
                          <span className="inline-flex items-center gap-1">
                            <FiAward className="h-3 w-3" /> {sub.badge}
                          </span>
                        </span>
                      )}

                      {isCompleted ? (
                        <div className="flex items-center gap-1 font-black text-slate-900">
                          <span className="text-xl">{sub.score}</span>
                          <span className="text-xs font-normal text-slate-400">/ 100</span>
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-xs font-medium uppercase">
                          {sub.status}
                        </Badge>
                      )}
                    </div>

                    <Button asChild size="sm" variant={isCompleted ? 'default' : 'outline'}>
                      <Link to={isCompleted ? `/report/${sub.id}` : '/analyse'}>
                        {isCompleted ? 'View Report' : 'Check Status'}
                        <FiArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Link>
                    </Button>
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

export default AnalysedProjects
