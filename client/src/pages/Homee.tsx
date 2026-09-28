import { Link } from 'react-router-dom'
import {
  FiArrowRight,
  FiCheck,
  FiCode,
  FiGitBranch,
  FiFileText,
  FiAward,
  FiShield,
  FiLayers,
  FiCheckCircle,
  FiAlertTriangle,
  FiStar,
  FiCpu,
  FiBarChart2,
} from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'


const Homee = () => {
  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* ─── Navigation Bar ────────────────────────────────────────── */}
      <Navbar />

      {/* ─── Hero Section ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-20 sm:pb-28">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          {/* Pill Badge */}
          <Badge variant="default" className="gap-2 px-3.5 py-1 text-xs font-semibold">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            AI-POWERED STUDENT PROJECT EVALUATION
          </Badge>

          {/* Heading */}
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Turn Student Projects Into{' '}
            <span className="text-blue-600">Placement-Ready Proof.</span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-600 sm:text-lg">
            Turn messy GitHub repositories into verified skill scores, rubric-aligned feedback,
            and recruiter-ready portfolios — instantly.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Link to="/analyse">
              <Button size="lg" className="gap-2 shadow-md shadow-blue-600/20">
                Analyze a Project
                <FiArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="outline" size="lg">
                Watch 2-min Demo
              </Button>
            </a>
          </div>

          {/* Social Proof Rating */}
          <div className="mt-7 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className="h-3.5 w-3.5 fill-amber-400" />
              ))}
            </div>
            <span>Trusted by 50+ colleges & 15,000+ students</span>
          </div>

          {/* ─── Hero UI Mockup Card ───────────────────────────────── */}
          <div className="relative mx-auto mt-12 max-w-4xl text-left">
            <Card className="rounded-2xl border-slate-200 bg-white p-2 shadow-2xl shadow-slate-200/70 sm:p-3">
              {/* Window Header */}
              <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-rose-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
                <span className="font-mono text-[11px] text-slate-500">
                  projectforge-eval-report: fullstack-ecommerce-app
                </span>
                <Badge variant="success" className="text-[10px] px-2 py-0.5">
                  Live Audit
                </Badge>
              </div>

              {/* Window Body */}
              <div className="grid grid-cols-1 gap-6 p-4 sm:p-6 md:grid-cols-5">
                {/* Left Circular Score */}
                <div className="flex flex-col items-center justify-center rounded-xl border border-slate-100 bg-slate-50/70 p-6 md:col-span-2 text-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    AI Readiness Score
                  </span>

                  <div className="relative my-4 flex h-32 w-32 items-center justify-center rounded-full border-8 border-blue-600 bg-white shadow-inner">
                    <div className="text-center">
                      <span className="text-4xl font-extrabold text-slate-900">87</span>
                      <span className="block text-[11px] font-semibold text-slate-400">/ 100</span>
                    </div>
                  </div>

                  <Badge variant="success" className="gap-1">
                    <FiCheckCircle className="h-3.5 w-3.5" />
                    Placement Ready
                  </Badge>
                  <p className="mt-2 text-xs text-slate-500">
                    Production-grade code standards met
                  </p>
                </div>

                {/* Right Breakdown Bars */}
                <div className="flex flex-col justify-center space-y-3.5 md:col-span-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Quality Dimensions
                  </span>

                  <div className="space-y-3">
                    {[
                      { name: 'Architecture & Design', score: 92, col: 'bg-blue-600' },
                      { name: 'Code Quality & Style', score: 85, col: 'bg-emerald-600' },
                      { name: 'Testing & Coverage', score: 78, col: 'bg-amber-500' },
                      { name: 'Documentation & Readme', score: 90, col: 'bg-purple-600' },
                      { name: 'Security & Auth', score: 84, col: 'bg-rose-500' },
                      { name: 'Deployment & CI/CD', score: 88, col: 'bg-indigo-600' },
                    ].map((item) => (
                      <div key={item.name} className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-700">{item.name}</span>
                          <span className="font-semibold text-slate-900">{item.score}/100</span>
                        </div>
                        <Progress value={item.score} indicatorColor={item.col} className="h-2" />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400 border-t border-slate-100">
                    <span>Repository: GitHub Public</span>
                    <span>Commit Hash: 7e2f1a9</span>
                    <span>Branches: 4 Analyzed</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── Section 2: Features Grid ──────────────────────────────── */}
      <section id="features" className="border-t border-slate-200/80 bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="default" className="text-xs font-semibold">
              FEATURES & CAPABILITIES
            </Badge>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Everything needed to evaluate student projects at scale.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-slate-500">
              From individual student repos to department-wide batch reviews, ProjectForge
              automates the heavy lifting.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <FiCpu className="h-6 w-6 text-blue-600" />,
                title: 'AI-Powered Evaluation',
                desc: 'Deep multi-agent LLM analysis inspects code structure, anti-patterns, commit hygiene, and engineering trade-offs.',
              },
              {
                icon: <FiGitBranch className="h-6 w-6 text-indigo-600" />,
                title: 'GitHub Integration',
                desc: 'Paste any public repository URL. ProjectForge clones, parses ast, and audits the entire codebase in under 60 seconds.',
              },
              {
                icon: <FiBarChart2 className="h-6 w-6 text-purple-600" />,
                title: 'Rubric-Based Scoring',
                desc: 'Clear 6-dimension evaluation rubric benchmarked against entry-level software engineer hiring bars.',
              },
              {
                icon: <FiAward className="h-6 w-6 text-emerald-600" />,
                title: 'Recruiter-Ready Proof',
                desc: 'Students receive shareable public audit badges and verifiable portfolio links to impress hiring managers.',
              },
            ].map((f, i) => (
              <Card key={i} className="hover:-translate-y-1 transition-all">
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-100">
                    {f.icon}
                  </div>
                  <CardTitle className="text-lg">{f.title}</CardTitle>
                  <CardDescription className="text-xs">{f.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Section 3: How It Works ───────────────────────────────── */}
      <section id="how-it-works" className="py-20 bg-slate-50/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="default" className="text-xs font-semibold">
              SIMPLE WORKFLOW
            </Badge>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              From GitHub repository to placement-ready report.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-slate-500">
              Four simple steps to turn student code into verified proof of ability.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: 'STEP 01',
                title: 'Connect Repo',
                desc: 'Student or faculty submits a GitHub repository link with the target branch.',
              },
              {
                step: 'STEP 02',
                title: 'AI Deep Scan',
                desc: 'Our engine inspects commits, dependencies, security flaws, and modular architecture.',
              },
              {
                step: 'STEP 03',
                title: 'Rubric Score',
                desc: 'A comprehensive report is generated with scores across all 6 dimensions.',
              },
              {
                step: 'STEP 04',
                title: 'Share & Place',
                desc: 'Add verified badge to resumes and showcase live audit reports to recruiters.',
              },
            ].map((s, idx) => (
              <Card key={idx} className="relative bg-white hover:-translate-y-1 transition-all">
                <CardHeader>
                  <span className="text-xs font-bold text-blue-600 tracking-wider">
                    {s.step}
                  </span>
                  <CardTitle className="mt-2 text-lg">{s.title}</CardTitle>
                  <CardDescription className="text-xs">{s.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Section 4: Six Dimensions ─────────────────────────────── */}
      <section id="dimensions" className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="default" className="text-xs font-semibold">
              EVALUATION FRAMEWORK
            </Badge>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              One score. Six dimensions of project quality.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-slate-500">
              Our holistic assessment framework gives an un-fakeable view of real software
              engineering competence.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <FiCode className="h-5 w-5 text-blue-600" />,
                title: 'Code Quality',
                desc: 'Linters, naming conventions, clean code principles, DRYness, and modular organization.',
              },
              {
                icon: <FiLayers className="h-5 w-5 text-indigo-600" />,
                title: 'Architecture',
                desc: 'Layering, separation of concerns, scalability considerations, and state management.',
              },
              {
                icon: <FiCheckCircle className="h-5 w-5 text-emerald-600" />,
                title: 'Testing',
                desc: 'Unit test coverage, integration tests, mock usage, and edge case handling.',
              },
              {
                icon: <FiFileText className="h-5 w-5 text-purple-600" />,
                title: 'Documentation',
                desc: 'README completeness, setup instructions, API contracts, and architecture diagrams.',
              },
              {
                icon: <FiShield className="h-5 w-5 text-rose-600" />,
                title: 'Security',
                desc: 'Secret management, SQL injection guards, input sanitization, and dependency vulnerabilities.',
              },
              {
                icon: <FiCpu className="h-5 w-5 text-amber-600" />,
                title: 'Deployment & CI',
                desc: 'Dockerfiles, GitHub Actions workflows, environment configuration, and hosting readiness.',
              },
            ].map((dim, i) => (
              <Card key={i} className="hover:-translate-y-1 transition-all">
                <CardHeader>
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50/80 border border-blue-100">
                    {dim.icon}
                  </div>
                  <CardTitle className="text-base">{dim.title}</CardTitle>
                  <CardDescription className="text-xs">{dim.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Section 5: Student Feature Showcase ──────────────────── */}
      <section className="py-20 bg-slate-50/70 border-t border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Visual Card */}
            <Card className="rounded-2xl p-6 shadow-xl shadow-slate-200/80 bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs text-slate-400">Detailed Audit</span>
                  <h4 className="font-semibold text-slate-800">Critical Feedback Points</h4>
                </div>
                <Badge variant="warning">2 Action Items</Badge>
              </div>

              <div className="mt-5 space-y-4">
                <div className="rounded-xl border border-rose-100 bg-rose-50/60 p-4">
                  <div className="flex items-start gap-3">
                    <FiAlertTriangle className="mt-0.5 h-4 w-4 text-rose-600 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-rose-900">Security Warning</span>
                      <p className="mt-0.5 text-xs text-rose-700">
                        Hardcoded API secret found in <code>config/db.ts:14</code>. Move to environment variables.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-4">
                  <div className="flex items-start gap-3">
                    <FiCode className="mt-0.5 h-4 w-4 text-amber-600 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-amber-900">Missing Unit Tests</span>
                      <p className="mt-0.5 text-xs text-amber-700">
                        Controller methods in <code>authController.ts</code> lack automated test coverage.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                  <div className="flex items-start gap-3">
                    <FiCheckCircle className="mt-0.5 h-4 w-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-emerald-900">Clean Architecture</span>
                      <p className="mt-0.5 text-xs text-emerald-700">
                        Repository pattern properly implemented across data access layer.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Description */}
            <div className="space-y-5">
              <Badge variant="default" className="text-xs font-semibold">
                STUDENT EXPERIENCE
              </Badge>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Know exactly where your project stands.
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                No more guessing why your resume didn't make the cut. Get precise, actionable
                feedback on how to elevate your code to production standards before interviews.
              </p>

              <ul className="space-y-3 pt-2">
                {[
                  'Instant line-level recommendations for bug and security fixes',
                  'Actionable advice to increase your test coverage score',
                  'Verified skill badges you can embed directly in your README',
                  'Public recruiter verification link to prove your work is authentic',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <FiCheck className="h-3.5 w-3.5" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4">
                <Link to="/analyse">
                  <Button size="lg" className="gap-2">
                    Analyze Your Project Now
                    <FiArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 6: For Colleges & Placement Teams ─────────────── */}
      <section id="colleges" className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Left Content */}
            <div className="space-y-5">
              <Badge variant="default" className="text-xs font-semibold">
                INSTITUTIONAL INSIGHTS
              </Badge>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Give placement teams a clearer view of student projects.
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Placement officers and faculties can track hundreds of student repositories
                in a single view. Filter top performers, catch low-effort submissions, and export
                audit reports for visiting recruiters.
              </p>

              {/* Stats 2x2 Grid */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <Card className="p-4 bg-slate-50/70 border-slate-200">
                  <span className="text-2xl font-extrabold text-blue-600">1,420</span>
                  <span className="block text-xs font-medium text-slate-500 mt-1">
                    Projects Evaluated
                  </span>
                </Card>
                <Card className="p-4 bg-slate-50/70 border-slate-200">
                  <span className="text-2xl font-extrabold text-indigo-600">2,890+</span>
                  <span className="block text-xs font-medium text-slate-500 mt-1">
                    Commits Inspected
                  </span>
                </Card>
                <Card className="p-4 bg-slate-50/70 border-slate-200">
                  <span className="text-2xl font-extrabold text-emerald-600">78.4 / 100</span>
                  <span className="block text-xs font-medium text-slate-500 mt-1">
                    Avg Readiness Score
                  </span>
                </Card>
                <Card className="p-4 bg-slate-50/70 border-slate-200">
                  <span className="text-2xl font-extrabold text-purple-600">412</span>
                  <span className="block text-xs font-medium text-slate-500 mt-1">
                    Job-Ready Candidates
                  </span>
                </Card>
              </div>

              <div className="pt-2">
                               <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                >
                  Explore TPO Dashboard
                  <FiArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Right Dashboard Mockup */}
            <Card className="rounded-2xl p-6 shadow-xl shadow-slate-200/80 bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-semibold text-slate-800 text-sm">
                  Batch 2026 — CS Dept Leaderboard
                </span>
                <Badge variant="outline" className="text-[10px]">
                  Batch: 250 students
                </Badge>
              </div>

              {/* Mini distribution bar */}
                            <div className="mt-5">
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>Batch Readiness Distribution</span>
                  <span className="text-blue-600 font-bold">62% Ready</span>
                </div>
                <div className="mt-2 flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="bg-emerald-500" style={{ width: '62%' }} title="Ready" />
                  <div className="bg-amber-400" style={{ width: '28%' }} title="Needs Polish" />
                  <div className="bg-rose-400" style={{ width: '10%' }} title="High Risk" />
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> 62% Ready
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-400" /> 28% In Progress
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-rose-400" /> 10% Needs Review
                  </span>
                </div>
              </div>

              {/* Mini Leaderboard Items */}
              <div className="mt-6 space-y-3">
                {[
                  { name: 'Aarav Sharma', project: 'Distributed KV Store', score: 94, rank: '01' },
                  { name: 'Kritika Jain', project: 'MedTech Teleconsult API', score: 91, rank: '02' },
                  { name: 'Rohan Gupta', project: 'FinTrack Budget Engine', score: 88, rank: '03' },
                ].map((st) => (
                  <div
                    key={st.rank}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3 hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-[11px] font-bold text-blue-700">
                        {st.rank}
                      </span>
                      <div>
                        <span className="block text-xs font-semibold text-slate-800">
                          {st.name}
                        </span>
                        <span className="text-[11px] text-slate-400">{st.project}</span>
                      </div>
                    </div>
                    <Badge variant="success" className="font-mono text-xs">
                      {st.score}/100
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── Section 7: Dark Final CTA Banner ──────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-8 py-16 text-center text-white shadow-2xl sm:px-16">
            {/* Background Glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-blue-600/30 blur-3xl pointer-events-none" />

            <Badge
              variant="outline"
              className="border-slate-700 text-blue-400 bg-slate-800/80 mb-6"
            >
              GET STARTED IN 30 SECONDS
            </Badge>

            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Make every student project count.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-slate-400">
              Start evaluating repositories today. Join leading universities helping their
              graduates stand out with verified proof of technical capability.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link to="/analyse">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold">
                  Analyze a Project Now
                  <FiArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-slate-700 bg-slate-800/60 text-slate-200 hover:bg-slate-800 hover:text-white"
                >
                  Sign In to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 8: Footer ─────────────────────────────────────── */}
      <Footer />
    </div>
  )
}

export default Homee
