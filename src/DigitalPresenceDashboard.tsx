import React from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Globe, Mail, Smartphone, Users, ChevronUp, ChevronDown, Activity, Eye, MousePointer } from 'lucide-react';

const BucksChurchDashboard = () => {
  // Channel colors
  const colors = {
    facebook: '#1877f2',
    instagram: '#E4405F',
    website: '#0EA5E9',
    email: '#10B981',
    churchCenter: '#8B5CF6'
  };

  // Monthly performance data
  const monthlyData = [
    { month: 'Jan', facebook: 48000, instagram: 52000, website: 2100, email: 7800, churchCenter: 3200 },
    { month: 'Feb', facebook: 51000, instagram: 55000, website: 2300, email: 8100, churchCenter: 3400 },
    { month: 'Mar', facebook: 54000, instagram: 58000, website: 2500, email: 8300, churchCenter: 3600 },
    { month: 'Apr', facebook: 56000, instagram: 61000, website: 2700, email: 8400, churchCenter: 3800 },
    { month: 'May', facebook: 57000, instagram: 64000, website: 2900, email: 8500, churchCenter: 4000 },
    { month: 'Jun', facebook: 58000, instagram: 66000, website: 3100, email: 8600, churchCenter: 4200 },
    { month: 'Jul', facebook: 57896, instagram: 66528, website: 3300, email: 8364, churchCenter: 4400 }
  ];

  // Engagement rate trends
  const engagementData = [
    { month: 'Jan', facebook: 3.2, instagram: 3.8, email: 22.5, website: 28.2 },
    { month: 'Feb', facebook: 3.3, instagram: 3.9, email: 23.1, website: 28.5 },
    { month: 'Mar', facebook: 3.4, instagram: 4.0, email: 23.8, website: 29.0 },
    { month: 'Apr', facebook: 3.5, instagram: 4.1, email: 24.2, website: 29.3 },
    { month: 'May', facebook: 3.5, instagram: 4.2, email: 24.5, website: 29.5 },
    { month: 'Jun', facebook: 3.5, instagram: 4.2, email: 24.3, website: 29.6 },
    { month: 'Jul', facebook: 3.5, instagram: 4.2, email: 24.3, website: 29.6 }
  ];

  // Traffic sources
  const trafficSources = [
    { name: 'Search', value: 4898, percentage: 26, fill: '#3b82f6' },
    { name: 'Direct', value: 8000, percentage: 43, fill: '#10b981' },
    { name: 'Social', value: 258, percentage: 1.4, fill: '#f59e0b' },
    { name: 'Other', value: 5611, percentage: 29.6, fill: '#6b7280' }
  ];

  // Top content
  const topContent = [
    { page: 'Homepage', views: 4250 },
    { page: 'Staff', views: 1430 },
    { page: 'Sundays', views: 921 },
    { page: 'Beliefs', views: 711 },
    { page: 'Preschool', views: 697 }
  ];

  // Device breakdown
  const deviceData = [
    { name: 'Mobile', value: 68, fill: '#8b5cf6' },
    { name: 'Desktop', value: 30, fill: '#3b82f6' },
    { name: 'Tablet', value: 2, fill: '#10b981' }
  ];

  const KPICard = ({ title, value, subtitle, trend, icon: Icon, explanation }: { title: string; value: string; subtitle: string; trend?: number; icon: React.FC<any>; explanation?: string }) => (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">{value}</span>
            {trend !== undefined && (
              <span className={`flex items-center text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend > 0 ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {Math.abs(trend)}%
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          {explanation && (
            <p className="text-xs text-gray-400 mt-2 italic">{explanation}</p>
          )}
        </div>
        {Icon && <Icon className="w-5 h-5 text-gray-400" />}
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          ⛪ Bucks Church Digital Presence Dashboard
        </h1>
        <p className="text-base md:text-lg text-gray-600">
          Multi-Channel Performance Analysis (Dec 2024 - Jul 2025) • Church Center Year 1
        </p>
        <p className="text-xs md:text-sm text-gray-500 mt-1">
          Data through Jetpack, Social Media APIs, Email Analytics • Updated: July 31, 2025
        </p>
        <div className="mt-4 bg-blue-50 rounded-lg p-3 max-w-3xl mx-auto">
          <p className="text-sm text-blue-800">
            <strong>How to use this dashboard:</strong> This shows how many people we're reaching across all our digital platforms.
            Higher percentages mean more people are engaging with our content. Use these insights to plan when to post and what content works best.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <KPICard title="SOCIAL MEDIA REACH" value="140K+" subtitle="People who saw our posts" trend={15} icon={Eye} explanation="Combined Facebook + Instagram monthly views" />
        <KPICard title="SOCIAL ENGAGEMENT" value="3.8%" subtitle="People who interacted" icon={Activity} explanation="Of those who saw posts, % who liked/commented/shared" />
        <KPICard title="WEBSITE VISITORS" value="1,565" subtitle="Unique monthly visitors" icon={TrendingUp} explanation="29.6% convert to Church Center app (industry avg: 15-20%)" />
        <KPICard title="CHURCH CENTER TRAFFIC" value="3,773" subtitle="Total monthly app clicks" icon={MousePointer} explanation="Goal: 4,000 clicks/mo (+6%)" />
        <KPICard title="MOBILE USERS" value="68%" subtitle="Access via phone" icon={Smartphone} explanation="% of all website traffic from mobile devices" />
        <KPICard title="EMAIL OPENS" value="24.3%" subtitle="Open rate average" icon={Mail} explanation="% of email recipients who open our newsletters" />
      </div>

      {/* Main Content Sections */}
      <div className="space-y-6">
        {/* Main Charts: Reach and Engagement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Monthly Audience Reach by Channel</h2>
            <p className="text-xs text-gray-500 mb-4">How many people we're reaching each month</p>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} tickFormatter={formatNumber} /><Tooltip content={<CustomTooltip />} /><Legend wrapperStyle={{ fontSize: '11px' }} /><Area type="monotone" dataKey="facebook" stackId="1" stroke={colors.facebook} fill={colors.facebook} fillOpacity={0.8} /><Area type="monotone" dataKey="instagram" stackId="1" stroke={colors.instagram} fill={colors.instagram} fillOpacity={0.8} /><Area type="monotone" dataKey="website" stackId="1" stroke={colors.website} fill={colors.website} fillOpacity={0.8} /><Area type="monotone" dataKey="email" stackId="1" stroke={colors.email} fill={colors.email} fillOpacity={0.8} /><Area type="monotone" dataKey="churchCenter" stackId="1" stroke={colors.churchCenter} fill={colors.churchCenter} fillOpacity={0.8} /></AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Engagement Rates by Channel</h2>
            <p className="text-xs text-gray-500 mb-4">% of people who interact with our content</p>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={engagementData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip formatter={(value: number) => `${value}%`} /><Legend wrapperStyle={{ fontSize: '11px' }} /><Line type="monotone" dataKey="facebook" stroke={colors.facebook} strokeWidth={2} name="Facebook" /><Line type="monotone" dataKey="instagram" stroke={colors.instagram} strokeWidth={2} name="Instagram" /><Line type="monotone" dataKey="email" stroke={colors.email} strokeWidth={2} name="Email" /><Line type="monotone" dataKey="website" stroke={colors.website} strokeWidth={2} name="Website→App" /></LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DETAILED & RESTORED: Church Center Funnel */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">All Paths Lead to Church Center</h2>
          <p className="text-xs text-gray-500 mb-4">Conversion funnel showing all traffic sources flowing to our central hub</p>
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-center mb-4"><h3 className="font-semibold text-lg text-gray-900">Church Center Hub</h3></div>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center"><p className="text-2xl font-bold text-gray-900">4,400+</p><p className="text-sm text-gray-600 mb-2">Monthly Active Users</p><p className="text-xs text-gray-500 bg-white rounded px-2 py-1 inline-block">Goal: 4,600 (+4.5%)</p></div>
              <div className="text-center"><p className="text-2xl font-bold text-gray-900">3,773</p><p className="text-sm text-gray-600 mb-2">Total Clicks/Month</p><p className="text-xs text-gray-500 bg-white rounded px-2 py-1 inline-block">Goal: 4,000 (+6%)</p></div>
            </div>
            <p className="text-xs text-gray-500 text-center mt-4">First year performance after system migration (2025)</p>
          </div>
          <div className="relative">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-5 space-y-3">
                <div className="bg-green-50 rounded-lg p-3 border border-green-200"><div className="flex items-center gap-2 mb-1"><Globe className="w-4 h-4 text-green-600" /><span className="text-sm font-medium">Website Direct</span></div><p className="text-xs text-gray-600">1,565 visitors/mo</p></div>
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200"><div className="flex items-center gap-2 mb-1"><Mail className="w-4 h-4 text-blue-600" /><span className="text-sm font-medium">Email Direct</span></div><p className="text-xs text-gray-600">8,364 recipients</p></div>
                <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200"><div className="flex items-center gap-2 mb-1"><Mail className="w-4 h-4 text-yellow-600" /><span className="text-sm font-medium">Email → Website</span></div><p className="text-xs text-gray-600">1,200 clicks to site</p></div>
                <div className="bg-orange-50 rounded-lg p-3 border border-orange-200"><div className="flex items-center gap-2 mb-1"><Users className="w-4 h-4 text-orange-600" /><span className="text-sm font-medium">Social Direct</span></div><p className="text-xs text-gray-600">124K reach</p></div>
                <div className="bg-red-50 rounded-lg p-3 border border-red-200"><div className="flex items-center gap-2 mb-1"><Users className="w-4 h-4 text-red-600" /><span className="text-sm font-medium">Social → Website</span></div><p className="text-xs text-gray-600">258 clicks to site</p></div>
              </div>
              <div className="col-span-2 relative">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M 0 12 Q 50 12 100 50" fill="none" stroke="#10b981" strokeWidth="3" opacity="0.8" /><text x="50" y="10" textAnchor="middle" className="fill-green-700 text-xs font-bold">29.6%</text>
                  <path d="M 0 30 Q 50 30 100 50" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.6" /><text x="50" y="28" textAnchor="middle" className="fill-blue-700 text-xs font-bold">5.0%</text>
                  <path d="M 0 48 Q 50 48 100 50" fill="none" stroke="#eab308" strokeWidth="2" opacity="0.5" /><text x="50" y="46" textAnchor="middle" className="fill-yellow-700 text-xs font-bold">4.3%</text>
                  <path d="M 0 66 Q 50 66 100 50" fill="none" stroke="#f97316" strokeWidth="1" opacity="0.4" /><text x="50" y="68" textAnchor="middle" className="fill-orange-700 text-xs font-bold">0.1%</text>
                  <path d="M 0 84 Q 50 84 100 50" fill="none" stroke="#ef4444" strokeWidth="1" opacity="0.3" /><text x="50" y="86" textAnchor="middle" className="fill-red-700 text-xs font-bold">0.06%</text>
                </svg>
              </div>
              <div className="col-span-5 flex items-center">
                <div className="bg-purple-100 rounded-lg p-6 border-2 border-purple-400 w-full text-center">
                  <div className="flex items-center justify-center gap-2 mb-3"><div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center"><Users className="w-6 h-6 text-white" /></div><span className="text-lg font-bold text-purple-900">Church Center</span></div>
                  <div className="space-y-1 text-sm"><p className="text-green-700 font-medium">2,792 from Website</p><p className="text-blue-700">420 from Email</p><p className="text-yellow-700">360 Email→Web→CC</p><p className="text-orange-700">125 from Social</p><p className="text-red-700">76 Social→Web→CC</p></div>
                  <div className="mt-3 pt-3 border-t border-purple-300"><p className="text-purple-900 font-bold">3,773 Total/Month</p></div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-xs text-yellow-800"><strong>💡 Strategy:</strong> To reach 4,000 clicks/mo goal, focus on improving social media paths (orange & red) which currently underperform</p>
          </div>
        </div>

        {/* Website Analytics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">How People Find Our Website</h2>
            <p className="text-xs text-gray-500 mb-4">Where website visitors come from</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={trafficSources} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
                  {trafficSources.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.fill} />))}
                </Pie>
                <Tooltip />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-gray-900"><tspan x="50%" dy="-0.2em" className="text-2xl font-bold">18.8K</tspan><tspan x="50%" dy="1.5em" className="text-xs fill-gray-500">Total Visits</tspan></text>
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-3 space-y-2">
              {trafficSources.map((source) => (
                <div key={source.name} className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.fill }} />
                    {source.name === 'Search' ? '🔍 Google/Bing' :
                     source.name === 'Direct' ? '🔗 Direct/bookmarks' :
                     source.name === 'Social' ? '👥 Facebook/Instagram' :
                     '📧 Email/other'}
                  </span>
                  <span className="font-medium">{source.value.toLocaleString()} ({source.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Most Visited Website Pages</h2>
            <p className="text-xs text-gray-500 mb-4">Which pages people view most often</p>
            <div className="space-y-3">
              {topContent.map((content) => (<div key={content.page}><div className="flex justify-between items-center mb-1"><span className="text-sm font-medium">{content.page}</span><span className="text-sm text-gray-600">{content.views.toLocaleString()} views</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" style={{ width: `${(content.views / topContent[0].views) * 100}%` }} /></div></div>))}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Devices People Use</h2>
            <p className="text-xs text-gray-500 mb-4">How visitors access our website</p>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={deviceData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }: any) => `${name}: ${value}%`} labelLine={false}>
                  {deviceData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.fill} />))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Channel Performance Table */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-4 md:p-6 border border-gray-100 overflow-x-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Channel Performance Summary</h2>
          <p className="text-xs text-gray-500 mb-4">Quick reference for all platform metrics with industry comparisons</p>
          <table className="min-w-full divide-y divide-gray-200">
            <thead><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Audience</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Our Engagement</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Church Average</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Best Content</th></tr></thead>
            <tbody className="divide-y divide-gray-200">
              <tr><td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Facebook</td><td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">57,896 people reached</td><td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">3.5% interact</td><td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">1-2%</td><td className="px-4 py-3 whitespace-nowrap text-sm"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">↑ Above average</span></td><td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Event announcements</td></tr>
              <tr><td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Instagram</td><td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">66,528 people reached</td><td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">4.2% interact</td><td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">1.5-3%</td><td className="px-4 py-3 whitespace-nowrap text-sm"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">↑ Above average</span></td><td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Reels/Videos</td></tr>
              <tr><td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Website</td><td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">1,565 unique visitors</td><td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">29.6% click to app</td><td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">15-20%</td><td className="px-4 py-3 whitespace-nowrap text-sm"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">↑ Excellent</span></td><td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Homepage</td></tr>
              <tr><td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Email</td><td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">8,364 subscribers</td><td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">24.3% open emails</td><td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">20-25%</td><td className="px-4 py-3 whitespace-nowrap text-sm"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">↔ Average</span></td><td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Easter campaign</td></tr>
              <tr><td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Church Center</td><td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">4,400 active users</td><td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">3,773 clicks/mo</td><td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">2,000-3,000</td><td className="px-4 py-3 whitespace-nowrap text-sm"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">↑ Strong Year 1</span></td><td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Goal: 4,000/mo</td></tr>
            </tbody>
          </table>
        </div>

        {/* Key Takeaways */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-4 md:p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Key Takeaways & Action Items</h2>
          <p className="text-xs text-gray-500 mb-4">Priority recommendations based on your digital performance</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border-l-4 border-blue-500 pl-4"><h3 className="text-sm font-medium text-gray-900 mb-1">📱 Mobile First Strategy</h3><p className="text-sm text-gray-500">68% use phones - ensure all content, especially Church Center features, work seamlessly on mobile devices</p></div>
            <div className="border-l-4 border-green-500 pl-4"><h3 className="text-sm font-medium text-gray-900 mb-1">📈 Leverage Peak Engagement Windows</h3><p className="text-sm text-gray-500">Continue biweekly optimization with MBS. Sunday/Thursday peaks reflect service & newsletter timing - use these natural touchpoints for major announcements</p></div>
            <div className="border-l-4 border-purple-500 pl-4"><h3 className="text-sm font-medium text-gray-900 mb-1">🎯 Sustain Church Center Growth</h3><p className="text-sm text-gray-500">After strong Year 1 adoption, aim for 4,600 users and 4,000 clicks/mo by focusing on social media conversions (currently only 0.1%)</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BucksChurchDashboard;