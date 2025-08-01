import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, Calendar, Activity } from 'lucide-react';

const GrowthTrackDashboard = () => {
  // Actual data from the CSV files
  const trimesterData = [
    { period: '2023 T1', crowd: 190, congregation: 81, committed: 54, core: 66, total: 391 },
    { period: '2023 T2', crowd: 141, congregation: 98, committed: 57, core: 60, total: 356 },
    { period: '2023 T3', crowd: 143, congregation: 93, committed: 60, core: 60, total: 356 },
    { period: '2024 T1', crowd: 138, congregation: 107, committed: 51, core: 58, total: 354 },
    { period: '2024 T2', crowd: 174, congregation: 119, committed: 54, core: 59, total: 406 },
    { period: '2024 T3', crowd: 202, congregation: 118, committed: 53, core: 59, total: 432 },
    { period: '2025 T1', crowd: 247, congregation: 131, committed: 61, core: 56, total: 495 },
  ];

  const percentageData = trimesterData.map(period => ({
    period: period.period,
    crowd: ((period.crowd / period.total) * 100).toFixed(1),
    congregation: ((period.congregation / period.total) * 100).toFixed(1),
    committed: ((period.committed / period.total) * 100).toFixed(1),
    core: ((period.core / period.total) * 100).toFixed(1)
  }));

  const currentDistribution = [
    { name: 'Crowd', value: 247, percentage: 49.9 },
    { name: 'Congregation', value: 131, percentage: 26.5 },
    { name: 'Committed', value: 61, percentage: 12.3 },
    { name: 'Core', value: 56, percentage: 11.3 },
  ];

  const phaseComparison = [
    { phase: 'Crowd', '2023 T1': 190, '2024 T1': 138, '2025 T1': 247 },
    { phase: 'Congregation', '2023 T1': 81, '2024 T1': 107, '2025 T1': 131 },
    { phase: 'Committed', '2023 T1': 54, '2024 T1': 51, '2025 T1': 61 },
    { phase: 'Core', '2023 T1': 66, '2024 T1': 58, '2025 T1': 56 },
  ];

  const conversionData = [
    { phase: 'Crowd → Congregation', count: 12, total: 168, percentage: 7.1, gap: 116 },
    { phase: 'Congregation → Committed', count: 6, total: 105, percentage: 5.7, gap: 70 },
    { phase: 'Committed → Core', count: 0, total: 46, percentage: 0.0, gap: 5 },
  ];

  const attendanceMetrics = [
    { metric: 'Phased Attendees', value: '458 of 495' },
    { metric: 'Median Attendance', value: '10 services' },
    { metric: '25th Percentile', value: '5 services' },
    { metric: '75th Percentile', value: '14 services' },
  ];

type CategoryKey = 'crowd' | 'congregation' | 'committed' | 'core';

const categoryColors: Record<CategoryKey, string> = {
  crowd: '#F97316',         // Orange
  congregation: '#10B981',  // Green
  committed: '#3B82F6',     // Blue
  core: '#8B5CF6',          // Purple
};

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <span className="text-4xl">⛪</span> Bucks Church Growth Track Dashboard
          </h1>
          <p className="text-gray-600">Spiritual Demographic Progression Analysis (2023 T1 - 2025 T1)</p>
          <p className="text-sm text-amber-600 mt-2">
            Data through complete trimesters only • Each trimester = 4 months
          </p>
          {/* Download Button */}
          <div className="mt-4">
            
              href="/SpiritualDemographics_Report.pdf"
              download="BucksChurch_SpiritualDemographics_Report_2025.pdf"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Full Report PDF
            </a>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 text-center border border-gray-200">
            <div className="text-gray-500 text-sm mb-1">CURRENT TOTAL</div>
            <div className="text-3xl font-bold text-gray-900">495</div>
            <div className="text-xs text-gray-400">📊 As of 2025 T1</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center border border-gray-200">
            <div className="text-gray-500 text-sm mb-1">OVERALL GROWTH</div>
            <div className="text-3xl font-bold text-gray-900">+26.6%</div>
            <div className="text-xs text-gray-400">↑ From 391 to 495</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center border border-gray-200">
            <div className="text-gray-500 text-sm mb-1">STRONGEST GROWTH</div>
            <div className="text-3xl font-bold text-green-600">+61.7%</div>
            <div className="text-xs text-gray-400">↑ Congregation phase</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center border border-gray-200">
            <div className="text-gray-500 text-sm mb-1">MEDIAN ATTENDANCE</div>
            <div className="text-3xl font-bold text-gray-900">9</div>
            <div className="text-xs text-gray-400">📅 Services per person</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center border border-gray-200">
            <div className="text-gray-500 text-sm mb-1">ATTENDANCE RATE</div>
            <div className="text-3xl font-bold text-gray-900">92.5%</div>
            <div className="text-xs text-gray-400">👥 458 of 495 attended</div>
          </div>
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Spiritual Phase Distribution Over Time */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gray-600" />
              Spiritual Phase Distribution Over Time
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trimesterData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="period" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
                  labelStyle={{ color: '#111827' }}
                />
                <Area type="monotone" dataKey="core" stackId="1" stroke={categoryColors.core} fill={categoryColors.core} />
                <Area type="monotone" dataKey="committed" stackId="1" stroke={categoryColors.committed} fill={categoryColors.committed} />
                <Area type="monotone" dataKey="congregation" stackId="1" stroke={categoryColors.congregation} fill={categoryColors.congregation} />
                <Area type="monotone" dataKey="crowd" stackId="1" stroke={categoryColors.crowd} fill={categoryColors.crowd} />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-gray-600 text-xs mt-3">
              Overall growth of <strong className="text-gray-900">26.6%</strong> from 391 to 495 adults. 
              The <strong className="text-green-600">Congregation phase shows exceptional growth</strong> of 61.7%, 
              while Core phase has declined by 15.2%.
            </p>
          </div>

          {/* Phase Percentage Trends */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-gray-600" />
              Phase Percentage Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={percentageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="period" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
                  labelStyle={{ color: '#111827' }}
                />
                <Line type="monotone" dataKey="crowd" stroke={categoryColors.crowd} strokeWidth={2} dot={{ fill: categoryColors.crowd }} />
                <Line type="monotone" dataKey="congregation" stroke={categoryColors.congregation} strokeWidth={2} dot={{ fill: categoryColors.congregation }} />
                <Line type="monotone" dataKey="committed" stroke={categoryColors.committed} strokeWidth={2} dot={{ fill: categoryColors.committed }} />
                <Line type="monotone" dataKey="core" stroke={categoryColors.core} strokeWidth={2} dot={{ fill: categoryColors.core }} />
                <Legend />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-gray-600 text-xs mt-3">
              Crowd percentage increased from 48.6% to 49.9%. <strong className="text-green-600">Congregation 
              remains stable</strong> at ~26-30%. Core percentage declined from 16.9% to 11.3%, 
              indicating challenges in leadership development.
            </p>
          </div>
        </div>

        {/* Bottom Row - Three Charts */}
        <div className="grid grid-cols-3 gap-6">
          {/* Current Distribution Donut */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-600" />
              Current Phase Distribution (2025 T1)
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={currentDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {currentDistribution.map((entry, index) => (
<Cell
  key={`cell-${index}`}
fill={categoryColors[entry.name.toLowerCase() as CategoryKey]}
/>
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
                  labelStyle={{ color: '#111827' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {currentDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
style={{ backgroundColor: categoryColors[item.name.toLowerCase() as CategoryKey] }}
                    />
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-gray-900 font-semibold">{item.value} ({item.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trimester Comparison */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              T1 Trimester Comparison
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={phaseComparison} margin={{ left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="phase" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
                  labelStyle={{ color: '#111827' }}
                />
                <Bar dataKey="2023 T1" fill="#94a3b8" />
                <Bar dataKey="2024 T1" fill="#64748b" />
                <Bar dataKey="2025 T1" fill="#475569" />
                <Legend />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-gray-600 text-xs mt-3">
              <strong className="text-gray-900">Crowd grew 30.0%</strong> (190→247). 
              <strong className="text-green-600"> Congregation grew 61.7%</strong> (81→131). 
              Core declined 15.2% (66→56).
            </p>
          </div>

          {/* Phase Transition Analysis */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gray-600" />
              Phase Transition Analysis
            </h3>
            <div className="text-xs text-gray-500 mb-3 p-2 bg-blue-50 rounded">
              📊 <strong>Transition rates</strong> show the % of people who advanced from one phase to the next between 2024 T3 → 2025 T1. 
              Only includes people present in <strong>both periods</strong> (excludes those who left or newly joined).
            </div>
            <div className="space-y-4">
              {conversionData.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-600 text-sm">{item.phase}</span>
                    <span className="text-gray-900 font-semibold">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-8 relative overflow-hidden">
                    <div 
                      className="h-full flex items-center justify-center text-xs font-semibold text-white"
                      style={{ 
                        width: `${Math.max(item.percentage * 5, 20)}%`, // Scale for visibility
                        backgroundColor: index === 0 ? '#10b981' : index === 1 ? '#3b82f6' : '#8b5cf6'
                      }}
                    >
                      {item.count} of {item.total}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Gap to target: {item.gap} people
                  </div>
                </div>
              ))}
              <p className="text-gray-600 text-xs mt-4 pt-4 border-t border-gray-200">
                Recent transition rates (2024 T3 → 2025 T1) show <strong className="text-gray-900">conversion 
                opportunities</strong>. The <strong className="text-amber-600">116-person gap</strong> between 
                Crowd and Congregation represents the primary growth opportunity.
              </p>
            </div>
          </div>
        </div>

        {/* Attendance Metrics Footer */}
        <div className="mt-6 bg-white rounded-lg shadow p-4 border border-gray-200">
          <h4 className="text-gray-900 font-semibold mb-3">Attendance Metrics (2025 T1)</h4>
          <div className="text-xs text-gray-500 mb-3 p-2 bg-blue-50 rounded">
            📊 Based on Sunday service attendance during the 2025 T1 trimester (Jan 5 - Apr 27, 2025) for the 495 people assigned to spiritual phases
          </div>
          <div className="grid grid-cols-4 gap-4">
            {attendanceMetrics.map((metric) => (
              <div key={metric.metric} className="text-center">
                <div className="text-sm text-gray-600">{metric.metric}</div>
                <div className="text-xl font-semibold text-gray-900">{metric.value}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {metric.metric === 'Phased Attendees' && 'People in phases who attended at least once'}
                  {metric.metric === 'Median Attendance' && 'Middle value of attendance frequency'}
                  {metric.metric === '25th Percentile' && '25% attended this many times or less'}
                  {metric.metric === '75th Percentile' && '75% attended this many times or less'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrowthTrackDashboard;