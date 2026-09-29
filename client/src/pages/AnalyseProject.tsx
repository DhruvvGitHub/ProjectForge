import { useState } from 'react'
import {
  FiArrowRight,
  FiCheck,
  FiGitBranch,
  FiGithub,
  FiLock,
  FiSearch,
} from 'react-icons/fi'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'

const dimensions = [
  'Architecture & Design',
  'Code Quality & Style',
  'Testing & Coverage',
  'Documentation & Readme',
  'Security & Auth',
  'Deployment & CI/CD',
]

const AnalyseProject = () => {
  const [repoUrl, setRepoUrl] = useState('')
  const [branch, setBranch] = useState('main')
  const [queued, setQueued] = useState(false)

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault()
    setQueued(true)
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
            Paste a public repo URL. ProjectForge scores it across six placement-ready
            dimensions and returns a recruiter-ready report.
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
                    onChange={(e) => {
                      setRepoUrl(e.target.value)
                      setQueued(false)
                    }}
                    placeholder="https://github.com/username/project"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
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
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="main"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </label>

              <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-xs text-slate-500">
                <FiLock className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                Public repositories only. No code is stored after the audit.
              </div>

              {queued && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-medium text-emerald-700">
                  Scan queued for {repoUrl} on branch <span className="font-semibold">{branch}</span>.
                </div>
              )}

              <Button type="submit" size="lg" className="w-full gap-2 shadow-md shadow-blue-600/20">
                <FiSearch className="h-4 w-4" />
                Analyze Repository
                <FiArrowRight className="h-4 w-4" />
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
                You get a 0–100 score, dimension bars, security warnings, and recruiter-ready proof —
                the same report shown on the ProjectForge home page.
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
