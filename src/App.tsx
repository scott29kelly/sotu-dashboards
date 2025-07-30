import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { LayoutDashboard, Wallet, Handshake, Users } from 'lucide-react';

// Import BOTH of your dashboards
import GrowthTrackDashboard from './GrowthTrackDashboard';
import BucksChurchUnifiedDashboard from './GivingDashboard';

// Custom Button Component from your original file
const DashboardButton = ({ icon: Icon, title, to }: { icon: React.ComponentType<any>, title: string, to: string }) => (
  <Link to={to} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex flex-col items-center justify-center text-center">
    <Icon className="h-10 w-10 text-indigo-600 mb-3" />
    <span className="font-semibold text-gray-800">{title}</span>
  </Link>
);

// This is your original HomePage layout with the buttons
const HomePage = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
    <h1 className="text-4xl font-bold text-gray-900 mb-2">State of the Union Meeting</h1>
    <p className="text-lg text-gray-600 mb-10">Select a dashboard to view key metrics.</p>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl">
      <DashboardButton icon={LayoutDashboard} title="Spiritual Demographics" to="/growth-track" />
      <DashboardButton icon={Wallet} title="Giving" to="/giving" />
      <DashboardButton icon={Handshake} title="Serving" to="#" />
      <DashboardButton icon={Users} title="Groups" to="#" />
    </div>
  </div>
);

// This sets up all the routes correctly
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/growth-track" element={<GrowthTrackDashboard />} />
      <Route path="/giving" element={<BucksChurchUnifiedDashboard />} />
    </Routes>
  );
}

export default App;