import React from 'react';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart, ReferenceLine 
} from 'recharts';

const BucksChurchDashboard = () => {
  // Define consistent colors
  const COLORS = {
    primary: '#4472C4',      // Blue - Primary metrics, general fund
    secondary: '#ED7D31',    // Orange - Cash/Check, Expenses
    success: '#70AD47',      // Green - Electronic, Net Income, Positive metrics
    neutral: '#999999'       // Gray - Industry average
  };

  const reportData = {
    currentYTD: 511263,
    yoyGrowth: 12.1,
    electronicPercent: 39.4,
    netMargin: 27.4,
    decemberImpact: 194,
    avgWeeklyGiving: 17376,
    expenseRatio: 72.6,
    projectedAnnual: 877880,
    generalFund2024: 860667,
    electronic2024: 33.5,
    monthlyAvg2024: 72259,
    december2024: 138827,
    generalFund2022: 740790,
    generalFund2023: 805088,
    totalExpenses2022: 589409,
    totalExpenses2023: 773043,
    totalExpenses2024: 718399,
    netIncome2022: 180357,
    netIncome2023: 58270,
    netIncome2024: 168043,
    totalIncome2022: 769766,
    totalIncome2023: 831313,
    totalIncome2024: 886442
  };

  const monthlyData2024 = [
    { month: 'Jan', total: 47426, electronic: 15878, cashCheck: 31548 },
    { month: 'Feb', total: 50725, electronic: 16993, cashCheck: 33732 },
    { month: 'Mar', total: 80308, electronic: 26903, cashCheck: 53405 },
    { month: 'Apr', total: 48301, electronic: 16181, cashCheck: 32120 },
    { month: 'May', total: 65084, electronic: 21803, cashCheck: 43281 },
    { month: 'Jun', total: 56642, electronic: 18975, cashCheck: 37667 },
    { month: 'Jul', total: 93124, electronic: 31200, cashCheck: 61924 },
    { month: 'Aug', total: 71784, electronic: 24062, cashCheck: 47722 },
    { month: 'Sep', total: 50204, electronic: 16823, cashCheck: 33381 },
    { month: 'Oct', total: 64183, electronic: 21509, cashCheck: 42674 },
    { month: 'Nov', total: 79261, electronic: 26560, cashCheck: 52701 },
    { month: 'Dec', total: 138827, electronic: 46500, cashCheck: 92327 }
  ];

  const monthlyWithMA = monthlyData2024.map((month, index) => {
    let movingAvg = month.total;
    if (index >= 2) {
      movingAvg = (monthlyData2024[index].total + monthlyData2024[index-1].total + monthlyData2024[index-2].total) / 3;
    }
    return { ...month, movingAvg };
  });

  const channelMixData = [
    { name: 'Electronic', value: reportData.electronicPercent, color: COLORS.success },
    { name: 'Cash/Check', value: 100 - reportData.electronicPercent, color: COLORS.secondary }
  ];

  const financialPerformanceData = [
    {
      year: '2022',
      'General Fund': reportData.generalFund2022,
      'Total Expenses': reportData.totalExpenses2022,
      'Net Income': reportData.netIncome2022
    },
    {
      year: '2023',
      'General Fund': reportData.generalFund2023,
      'Total Expenses': reportData.totalExpenses2023,
      'Net Income': reportData.netIncome2023
    },
    {
      year: '2024',
      'General Fund': reportData.generalFund2024,
      'Total Expenses': reportData.totalExpenses2024,
      'Net Income': reportData.netIncome2024
    }
  ];

  const seasonalityData = monthlyData2024.map(month => ({
    month: month.month,
    percentage: Math.round((month.total / reportData.monthlyAvg2024) * 100)
  }));

  const ytdComparisonData = [
    { year: '2022', amount: 430000 },
    { year: '2023', amount: 465000 },
    { year: '2024', amount: 456000 },
    { year: '2025', amount: reportData.currentYTD }
  ];

  const growthRateData = [
    { year: '2022', growth: 5.2, industry: 4 },
    { year: '2023', growth: 8.7, industry: 4 },
    { year: '2024', growth: 6.9, industry: 4 },
    { year: '2025', growth: reportData.yoyGrowth, industry: 4 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
          <span>⛪</span> Bucks Church Financial Performance Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Financial Analysis (2022 - 2025 YTD)</p>
        <p className="text-sm text-gray-500 mt-1">Data through July 25, 2025 • P&L and Offering Analysis • Updated Monthly</p>

        {/* Download Report Button */}
        <div className="mt-4">
          <a
            href="/sotu-dashboards/reports/sotu-financial-performance-report.pdf"
            download
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
          >
            Download Full Report (PDF)
          </a>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">CURRENT YTD GIVING</p>
          <p className="text-3xl font-bold text-gray-900">${reportData.currentYTD.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
            📅 As of July 25, 2025
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">YOY GROWTH</p>
          <p className="text-3xl font-bold text-green-600">+{reportData.yoyGrowth}%</p>
          <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
            ↑ From same period 2024
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">ELECTRONIC GIVING</p>
          <p className="text-3xl font-bold text-gray-900">{reportData.electronicPercent}%</p>
          <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
            💳 Up from {reportData.electronic2024}% in 2024
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">NET MARGIN</p>
          <p className="text-3xl font-bold text-gray-900">{reportData.netMargin}%</p>
          <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
            💰 Cents per dollar retained
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">DECEMBER IMPACT</p>
          <p className="text-3xl font-bold text-gray-900">{reportData.decemberImpact}%</p>
          <p className="text-sm text-gray-500 mt-2">
            🎄 Of monthly average
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            📊 Monthly Giving with Moving Average
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={monthlyWithMA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
              <Area type="monotone" dataKey="total" fill={COLORS.secondary} fillOpacity={0.6} stroke={COLORS.secondary} name="Monthly Giving" />
              <Line type="monotone" dataKey="movingAvg" stroke={COLORS.primary} strokeWidth={3} dot={false} name="3-Month Average" />
              <Legend />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            📈 Giving Channel Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData2024}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
              <Area type="monotone" dataKey="cashCheck" stackId="1" fill={COLORS.secondary} name="Cash/Check" />
              <Area type="monotone" dataKey="electronic" stackId="1" fill={COLORS.success} name="Electronic" />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            👥 3-Year Financial Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={financialPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
              <Bar dataKey="General Fund" fill={COLORS.primary} />
              <Bar dataKey="Total Expenses" fill={COLORS.secondary} />
              <Bar dataKey="Net Income" fill={COLORS.success} />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            📅 Monthly Seasonality Pattern
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={seasonalityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${value}%`} />
              <Tooltip formatter={(value: number) => `${value}%`} />
              <Bar dataKey="percentage">
                {seasonalityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.month === 'Dec' ? COLORS.secondary : COLORS.primary} />
                ))}
              </Bar>
              <ReferenceLine y={100} stroke={COLORS.neutral} strokeDasharray="3 3" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default BucksChurchDashboard;