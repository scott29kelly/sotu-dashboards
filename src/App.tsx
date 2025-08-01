import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { BarChart3, Users, DollarSign, Globe, ClipboardList, ChevronRight } from 'lucide-react';

// Lazy-load each dashboard (fast first load)
const GrowthTrackDashboard = lazy(() => import('./GrowthTrackDashboard'));
const AttendanceDashboard = lazy(() => import('./AttendanceDashboard'));
const FinancialPerformanceDashboard = lazy(() => import('./FinancialPerformanceDashboard'));
const DigitalPresenceDashboard = lazy(() => import('./DigitalPresenceDashboard'));
const SmallGroupsDashboard = lazy(() => import('./SmallGroupsDashboard'));

// Improved card component with better styling
function CardLink({ to, title, desc, Icon, color = "blue" }: { 
  to: string; 
  title: string; 
  desc: string; 
  Icon: React.ComponentType<{ className?: string }>;
  color?: string;
}) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700 group-hover:bg-blue-100",
    green: "bg-green-50 text-green-700 group-hover:bg-green-100",
    purple: "bg-purple-50 text-purple-700 group-hover:bg-purple-100",
    amber: "bg-amber-50 text-amber-700 group-hover:bg-amber-100",
    rose: "bg-rose-50 text-rose-700 group-hover:bg-rose-100"
  };

  return (
    <Link
      to={to}
      className="group relative block p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-200 hover:-translate-y-1"
    >
      <div className="flex flex-col h-full">
        {/* Icon */}
        <div className={`inline-flex p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]} mb-4 self-start transition-colors`}>
          <Icon className="h-6 w-6" />
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-gray-600 flex-grow">
          {desc}
        </p>
        
        {/* Arrow indicator */}
        <div className="flex items-center mt-4 text-sm font-medium text-gray-900">
          <span>View Dashboard</span>
          <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-2">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Bucks Church
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            State of the Union 2025
          </h1>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-6">
            Dashboard Portal
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select a dashboard below to explore key metrics and insights for our annual report.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <CardLink
            to="/growth-track"
            title="Spiritual Demographics"
            desc="Track member progression through the Growth Track phases and spiritual development metrics."
            Icon={BarChart3}
            color="blue"
          />
          <CardLink
            to="/financial-performance"
            title="Financial Performance"
            desc="Monitor giving trends, donor participation rates, and financial momentum indicators."
            Icon={DollarSign}
            color="green"
          />
          <CardLink
            to="/digital-presence"
            title="Digital Presence"
            desc="Analyze website traffic, social media engagement, and email campaign effectiveness."
            Icon={Globe}
            color="purple"
          />
          <CardLink
            to="/small-groups"
            title="Small Groups"
            desc="View engagement metrics and health indicators for all church small group activities."
            Icon={ClipboardList}
            color="amber"
          />
          <CardLink
            to="/attendance"
            title="Attendance"
            desc="Track weekly attendance patterns, growth trends, and demographic breakdowns."
            Icon={Users}
            color="rose"
          />
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-gray-500">
          <p>Data updated through May 2025</p>
        </div>
      </div>
    </div>
  );
}

// Loading component
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-flex items-center px-4 py-2 font-medium leading-6 text-sm text-gray-600">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading Dashboard...
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/growth-track" element={<GrowthTrackDashboard />} />
        <Route path="/attendance" element={<AttendanceDashboard />} />
        <Route path="/financial-performance" element={<FinancialPerformanceDashboard />} />
        <Route path="/digital-presence" element={<DigitalPresenceDashboard />} />
        <Route path="/small-groups" element={<SmallGroupsDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}