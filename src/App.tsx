import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { BarChart3, Users, DollarSign, Globe, ClipboardList, ChevronRight } from 'lucide-react'; // Added ClipboardList icon

// Lazy-load each dashboard (fast first load)
const GrowthTrackDashboard = lazy(() => import('./GrowthTrackDashboard'));
const AttendanceDashboard  = lazy(() => import('./AttendanceDashboard'));
const FinancialPerformanceDashboard = lazy(() => import('./FinancialPerformanceDashboard'));
const DigitalPresenceDashboard = lazy(() => import('./DigitalPresenceDashboard'));
const SmallGroupsDashboard = lazy(() => import('./SmallGroupsDashboard')); // NEW DASHBOARD IMPORT

// Reusable card component for the homepage links
function CardLink({ to, title, desc, Icon }: { to: string; title: string; desc: string; Icon: React.ComponentType<{ className?: string }>}) {
  return (
    <Link
      to={to}
      className="group relative rounded-2xl border border-slate-200 bg-white/70 backdrop-blur px-6 py-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
    >
      <div className="flex items-center gap-4">
        <div className="rounded-xl p-2 bg-slate-100 shrink-0">
          <Icon className="h-5 w-5 text-slate-700" />
        </div>
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-sm text-slate-500 truncate">{desc}</div>
        </div>
        <ChevronRight className="ml-auto h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
      </div>
    </Link>
  );
}

function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <main className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">SOTU Dashboards</h1>
          <p className="mt-2 text-slate-600">
            Choose a dashboard to view key metrics for the 2025 State of the Union report.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <CardLink
            to="/growth-track"
            title="Spiritual Demographics"
            desc="Progression through the Growth Track phases."
            Icon={BarChart3}
          />
          <CardLink
            to="/financial-performance"
            title="Financial Performance"
            desc="Giving trends, participation, and momentum."
            Icon={DollarSign}
          />
          <CardLink
            to="/digital-presence"
            title="Digital Presence"
            desc="Website, social media, and email engagement."
            Icon={Globe}
          />
           <CardLink
            to="/small-groups" // NEW LINK
            title="Small Groups" // NEW TITLE
            desc="Engagement and health of small groups."
            Icon={ClipboardList} // NEW ICON
          />
           <CardLink
            to="/attendance"
            title="Attendance"
            desc="Placeholder for attendance metrics."
            Icon={Users}
          />
        </section>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading Dashboard…</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/growth-track" element={<GrowthTrackDashboard />} />
        <Route path="/attendance"   element={<AttendanceDashboard  />} />
        <Route path="/financial-performance" element={<FinancialPerformanceDashboard />} />
        <Route path="/digital-presence" element={<DigitalPresenceDashboard />} />
        <Route path="/small-groups" element={<SmallGroupsDashboard />} /> {/* NEW ROUTE */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}