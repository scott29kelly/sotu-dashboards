import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Lazy-load each dashboard (fast first load)
const GrowthTrackDashboard = lazy(() => import('./GrowthTrackDashboard'));
const AttendanceDashboard  = lazy(() => import('./AttendanceDashboard'));
const GivingDashboard      = lazy(() => import('./GivingDashboard'));

function Home() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">SOTU Dashboards</h1>
      <p className="text-sm text-gray-600">Choose a dashboard:</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link className="block rounded-xl border p-4 hover:shadow"
              to="/growth-track">Growth Track</Link>
        <Link className="block rounded-xl border p-4 hover:shadow"
              to="/attendance">Attendance</Link>
        <Link className="block rounded-xl border p-4 hover:shadow"
              to="/giving">Giving</Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/growth-track" element={<GrowthTrackDashboard />} />
        <Route path="/attendance"   element={<AttendanceDashboard  />} />
        <Route path="/giving"       element={<GivingDashboard      />} />
        {/* redirect any unknown path back to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
