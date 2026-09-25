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
  FiUsers,
} from 'react-icons/fi'
import logo from '../assets/logo.png'

const Home = () => {
  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* ─── Navigation Bar ────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} alt="ProjectForge" className="h-8 w-8 object-contain" />
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Project<span className="text-blue-600">Forge</span>
            </span>
          </Link>

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

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Sign In
            </Link>
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

      {/* ─── Hero Section ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-20 sm:pb-28">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-blue-700">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            AI-POWERED STUDENT PROJECT EVALUATION
          </div>

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
            <Link
              to="/analyse"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-lg"
            >
              Analyze a Project
              <FiArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
            >
              Watch 2-min Demo
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
            <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-200/70 sm:p-3">
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
                <span className="text-[11px] text-blue-600 font-medium">Live Audit</span>
              </div>

              {/* Window Body */}
              <div className="grid grid-cols-1 gap-6 p-4 sm:p-6 md:grid-cols-5">
                {/* Left Circular Score */}
                <div className="flex flex-col items-center justify-center rounded-xl border border-slate-100 bg-slate-50/60 p-6 md:col-span-2 text-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    AI Readiness Score
                  </span>

                  <div className="relative my-4 flex h-32 w-32 items-center justify-center rounded-full border-8 border-blue-600 bg-white shadow-inner">
                    <div className="text-center">
                      <span className="text-4xl font-extrabold text-slate-900">87</span>
                      <span className="block text-[11px] font-semibold text-slate-400">/ 100</span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    <FiCheckCircle className="h-3.5 w-3.5" />
                    Placement Ready
                  </span>
                  <p className="mt-2 text-xs text-slate-500">
                    Production-grade code standards met
                  </p>
                </div>

                {/* Right Progress Bars */}
                <div className="flex flex-col justify-between space-y-3.5 md:col-span-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>Architecture & Design</span>
                      <span className="text-slate-900">88 / 100</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-slate-100">
                      <div className="h-2 rounded-full bg-blue-600" style={{ width: '88%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>Code Quality</span>
                      <span className="text-slate-900">85 / 100</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-slate-100">
                      <div className="h-2 rounded-full bg-blue-600" style={{ width: '85%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>Git Hygiene</span>
                      <span className="text-slate-900">92 / 100</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-slate-100">
                      <div className="h-2 rounded-full bg-blue-600" style={{ width: '92%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>Testing</span>
                      <span className="text-slate-900">78 / 100</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-slate-100">
                      <div className="h-2 rounded-full bg-blue-600" style={{ width: '78%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>Documentation</span>
                      <span className="text-slate-900">90 / 100</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-slate-100">
                      <div className="h-2 rounded-full bg-blue-600" style={{ width: '90%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>Security</span>
                      <span className="text-slate-900">86 / 100</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-slate-100">
                      <div className="h-2 rounded-full bg-blue-600" style={{ width: '86%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Tags */}
              <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 px-4 py-2.5 text-[11px] font-medium text-slate-500">
                <span className="rounded-md bg-slate-100 px-2 py-0.5"># Clean Commits</span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5"># CI/CD Setup</span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5"># Type Safe</span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5"># 0 Hardcoded Secrets</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 1: Features ───────────────────────────────────── */}
      <section id="features" className="border-t border-slate-200/80 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Features & Capabilities
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Everything needed to evaluate student projects at scale.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
              From individual student submissions to batch-level placement audits, ProjectForge
              automates every step of assessing engineering depth.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FiCpu className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">AI-Powered Evaluation</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Deep static analysis combined with smart heuristics to evaluate architecture,
                syntax patterns, and logic craft.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FiGitBranch className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">Git Hygiene</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Verifies commit frequency, author authenticity, meaningful messages, and branch
                workflows to detect copy-paste work.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FiFileText className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">Resume-Ready Summary</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Auto-generates recruiter bullet points, quantifiable project impact metrics, and
                shareable verified credentials.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FiBarChart2 className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">Batch Leaderboards</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Benchmarks students across batch years, college departments, and tracks project
                quality improvement over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 2: How It Works ──────────────────────────────── */}
      <section id="how-it-works" className="border-t border-slate-200/80 bg-[#f8fafc] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Seamless Workflow
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              From GitHub repository to placement-ready report.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
              Four simple steps to turn raw code into verifiable hiring proof.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Step 1 */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <span className="inline-block rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600">
                  STEP 01
                </span>
                <h3 className="mt-4 text-base font-bold text-slate-900">Paste GitHub URL</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Paste any public or private repository link. ProjectForge clones and parses all
                  source files in seconds.
                </p>
              </div>
              <div className="mt-6 font-mono text-[11px] text-blue-600">
                → github.com/username/repo
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <span className="inline-block rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600">
                  STEP 02
                </span>
                <h3 className="mt-4 text-base font-bold text-slate-900">Deep Analysis</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Our engine runs multi-dimensional static checks, test coverage scans, and
                  architecture assessments.
                </p>
              </div>
              <div className="mt-6 font-mono text-[11px] text-blue-600">
                → 6-dimensional audit
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <span className="inline-block rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600">
                  STEP 03
                </span>
                <h3 className="mt-4 text-base font-bold text-slate-900">Get Your Score</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Get a composite 0-100 score with detailed dimension breakdown and specific
                  lines-of-code feedback.
                </p>
              </div>
              <div className="mt-6 font-mono text-[11px] text-blue-600">
                → 0–100 Benchmark
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <span className="inline-block rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600">
                  STEP 04
                </span>
                <h3 className="mt-4 text-base font-bold text-slate-900">Share & Get Placed</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Export verified PDF reports, embed badges on LinkedIn/Resume, or showcase on
                  student portfolio profiles.
                </p>
              </div>
              <div className="mt-6 font-mono text-[11px] text-blue-600">
                → Recruiter-ready badge
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 3: Evaluation Dimensions ─────────────────────── */}
      <section id="dimensions" className="border-t border-slate-200/80 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Evaluation Rubric
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              One score. Six dimensions of project quality.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
              Clear, transparent rubrics inspired by top tech engineering hiring bars.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Dim 1 */}
            <div className="rounded-2xl border border-slate-200 p-6 transition hover:border-blue-200 hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <FiCode className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">Code Quality</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Readability, modularity, clean code principles, DRYness, and maintainability across
                files.
              </p>
            </div>

            {/* Dim 2 */}
            <div className="rounded-2xl border border-slate-200 p-6 transition hover:border-blue-200 hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <FiGitBranch className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">Git Hygiene</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Meaningful commit messages, branching strategy, commit timeline consistency, and
                no single-dump commits.
              </p>
            </div>

            {/* Dim 3 */}
            <div className="rounded-2xl border border-slate-200 p-6 transition hover:border-blue-200 hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <FiAward className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">Testing</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Unit test presence, test coverage percentage, mock usage, and edge case validation.
              </p>
            </div>

            {/* Dim 4 */}
            <div className="rounded-2xl border border-slate-200 p-6 transition hover:border-blue-200 hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <FiFileText className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">Documentation</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Complete README with setup guide, API docs, architecture diagrams, and license.
              </p>
            </div>

            {/* Dim 5 */}
            <div className="rounded-2xl border border-slate-200 p-6 transition hover:border-blue-200 hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <FiShield className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">Security</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Hardcoded secrets scanning, vulnerable dependencies, input sanitization, and safe
                API patterns.
              </p>
            </div>

            {/* Dim 6 */}
            <div className="rounded-2xl border border-slate-200 p-6 transition hover:border-blue-200 hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <FiLayers className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">Architecture</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Clear directory hierarchy, separation of concerns, scalability patterns, and
                database modeling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 4: Spotlight 1 - For Students ────────────────── */}
      <section className="border-t border-slate-200/80 bg-[#f8fafc] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Left Mockup Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Repo Audit Summary
                  </span>
                  <h4 className="font-mono text-sm font-semibold text-slate-800">
                    github.com/dhruv/taskflow-core
                  </h4>
                </div>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  84 / 100
                </span>
              </div>

              {/* Diagnostic items */}
              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3.5">
                  <div className="flex items-start gap-2.5">
                    <FiAlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    <div>
                      <span className="text-xs font-semibold text-amber-900">
                        Git Hygiene Alert
                      </span>
                      <p className="text-xs text-amber-700">
                        Single 12,000-line initial commit detected. Recommend breaking into
                        feature-specific atomic commits.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3.5">
                  <div className="flex items-start gap-2.5">
                    <FiCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <div>
                      <span className="text-xs font-semibold text-emerald-900">
                        Architecture Validated
                      </span>
                      <p className="text-xs text-emerald-700">
                        Clean separation between domain logic and presentation layer with MVC pattern.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3.5">
                  <div className="flex items-start gap-2.5">
                    <FiCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                    <div>
                      <span className="text-xs font-semibold text-blue-900">
                        Security Clearance
                      </span>
                      <p className="text-xs text-blue-700">
                        Zero hardcoded secrets, tokens, or environment files exposed in repository history.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>Scored in 4.2 seconds</span>
                <Link to="/analyse" className="font-semibold text-blue-600 hover:underline">
                  View Full Audit →
                </Link>
              </div>
            </div>

            {/* Right Text */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Student Perspective
              </span>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Know exactly where your project stands.
              </h2>
              <p className="mt-4 text-slate-600">
                Never walk into a campus placement interview guessing whether your project passes the
                engineering bar.
              </p>

              <ul className="mt-6 space-y-3.5 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <FiCheck className="h-3.5 w-3.5" />
                  </div>
                  <span>Get actionable code-level suggestions before recruiters review your profile</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <FiCheck className="h-3.5 w-3.5" />
                  </div>
                  <span>Identify missing unit tests, weak documentation, or hardcoded secrets</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <FiCheck className="h-3.5 w-3.5" />
                  </div>
                  <span>Generate resume bullet points that accurately showcase your contributions</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <FiCheck className="h-3.5 w-3.5" />
                  </div>
                  <span>Benchmark your work against thousands of peers across tier 1-3 colleges</span>
                </li>
              </ul>

              <div className="mt-8">
                <Link
                  to="/analyse"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  Check Your Project
                  <FiArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 5: Spotlight 2 - For Colleges ─────────────────── */}
      <section id="colleges" className="border-t border-slate-200/80 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Left Content & Stats */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                For Colleges & TPOs
              </span>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Give placement teams a clearer view of student projects.
              </h2>
              <p className="mt-4 text-slate-600">
                Stop relying on self-reported resumes. Placement officers and faculty get an instant
                birds-eye dashboard of cohort technical capability.
              </p>

              {/* 4 Stat Metrics */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                  <span className="text-2xl font-extrabold text-slate-900">3,420+</span>
                  <p className="mt-1 text-xs font-medium text-slate-500">Projects Scored</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                  <span className="text-2xl font-extrabold text-slate-900">2,050+</span>
                  <p className="mt-1 text-xs font-medium text-slate-500">Placement Ready</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                  <span className="text-2xl font-extrabold text-blue-600">78.4 / 100</span>
                  <p className="mt-1 text-xs font-medium text-slate-500">Avg Batch Score</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                  <span className="text-2xl font-extrabold text-slate-900">4.2x</span>
                  <p className="mt-1 text-xs font-medium text-slate-500">Faster Shortlisting</p>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                >
                  Explore TPO Dashboard
                  <FiArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Right Dashboard Widget Mockup */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <FiUsers className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-800">
                    Computer Science Cohort 2026
                  </span>
                </div>
                <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-600">
                  Batch: 240 Students
                </span>
              </div>

              {/* Distribution bar */}
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

              {/* Top candidates preview */}
              <div className="mt-6 divide-y divide-slate-100 border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between py-2 text-xs">
                  <div>
                    <span className="font-semibold text-slate-800">Aarav Sharma</span>
                    <span className="block text-[11px] text-slate-400">
                      Distributed Key-Value Store
                    </span>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 font-bold text-emerald-700">
                    94 / 100
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 text-xs">
                  <div>
                    <span className="font-semibold text-slate-800">Kritika Jain</span>
                    <span className="block text-[11px] text-slate-400">
                      Healthcare Telemedicine App
                    </span>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 font-bold text-emerald-700">
                    89 / 100
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 text-xs">
                  <div>
                    <span className="font-semibold text-slate-800">Rohan Verma</span>
                    <span className="block text-[11px] text-slate-400">
                      AI Resume Screening Engine
                    </span>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 font-bold text-emerald-700">
                    85 / 100
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 6: Dark CTA Banner ────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-14 text-center text-white shadow-2xl sm:px-12 sm:py-16">
            {/* Background subtle radial glow */}
            <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-96 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />

            <div className="relative z-10">
              <span className="inline-block rounded-full border border-blue-500/30 bg-blue-900/30 px-3 py-1 text-xs font-semibold tracking-wider text-blue-400 uppercase">
                Start Evaluating Today
              </span>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Make every student project count.
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm text-slate-400 sm:text-base">
                Turn unverified code into undeniable placement proof. Start scoring repositories
                with ProjectForge today.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/analyse"
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500"
                >
                  Analyze a Project
                </Link>
                <Link
                  to="/login"
                  className="rounded-xl border border-slate-700 bg-slate-900/60 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  Schedule Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 7: Footer ─────────────────────────────────────── */}
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
    </div>
  )
}

export default Home