import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  ComposedChart, 
} from 'recharts';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  CreditCard, 
  Target, 
  BarChart3, 
  AlertCircle,
} from 'lucide-react';

// CORRECTED: Helper function is now defined OUTSIDE the main component
function MetricCard({ icon: Icon, label, value, change, subtitle, positive }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  change?: string | null;
  subtitle?: string;
  positive?: boolean;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
        <div className={`p-1.5 rounded-md ${positive ? 'bg-green-100' : positive === false ? 'bg-red-100' : 'bg-blue-100'}`}>
          <Icon className={`h-4 w-4 ${positive ? 'text-green-600' : positive === false ? 'text-red-600' : 'text-blue-600'}`} />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        )}
        {change && (
          <p className={`text-sm font-medium mt-1 ${positive ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </p>
        )}
      </div>
    </div>
  );
}

const BucksChurchUnifiedDashboard = () => {
  const [data, setData] = useState({
    transactions: [] as any[],
    allocations: [] as any[],
    donors: [] as any[],
    funds: [] as any[],
    weeklyData: [] as any[],
    offeringHistory: [] as any[],
    fundsByYear: {},
    donorRetention: {}
  });
  
  const [period, setPeriod] = useState('1yr');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // CORRECTED: This data loading block now uses fetch to work in a web browser
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const BASE_URL = import.meta.env.BASE_URL || '/';

        // Helper function to fetch and parse CSV
        const fetchCSV = async (fileName: string) => {
          const res = await fetch(`${BASE_URL}data/${fileName}`);
          if (!res.ok) throw new Error(`Failed to fetch ${fileName}`);
          const text = await res.text();
          if (!text || text.trim() === '') return [];
          const lines = text.trim().split(/\r?\n/);
          if (lines.length < 2) return [];
          const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
          return lines.slice(1).map(line => {
              const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
              const row: { [key: string]: any } = {};
              headers.forEach((header, index) => {
                  row[header] = values[index];
              });
              return row;
          });
        };

        const [transactions, allocations, donors, funds, offeringExcelData] = await Promise.all([
          fetchCSV('donation_transactions.csv'),
          fetchCSV('donation_allocations.csv'),
          fetchCSV('donors.csv'),
          fetchCSV('funds.csv'),
          fetch(`${BASE_URL}data/Offering_Data_2023-2025_cleaned.xlsx`).then(res => res.arrayBuffer())
        ]);
        
        const workbook = XLSX.read(offeringExcelData, { type: 'array', cellDates: true });
        let offeringHistory: any[] = [];
        workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null });
            if (jsonData.length > 1) {
                for (let i = 1; i < jsonData.length; i++) {
                    const row = jsonData[i];
                    if (row && row[0] && (Number(row[4]) || 0) > 0) {
                        let parsedDate;
                        if (row[0] instanceof Date) {
                          parsedDate = row[0];
                        } else if (typeof row[0] === 'string' && new Date(row[0]).toString() !== 'Invalid Date') {
                          parsedDate = new Date(row[0]);
                        } else {
                          // Excel date serial number conversion
                          parsedDate = new Date((Number(row[0]) - 25569) * 86400 * 1000);
                        }
                        
                        const expectedYear = parseInt(sheetName, 10);
                        if (!isNaN(expectedYear) && parsedDate.getFullYear() !== expectedYear) {
                          parsedDate.setFullYear(expectedYear);
                        }
                        
                        offeringHistory.push({
                          week_end_sunday: parsedDate.toISOString().split('T')[0],
                          ytd_budgeted_income: Number(row[1]) || 0,
                          ytd_actual_income: Number(row[2]) || 0,
                          ytd_surplus_deficit: Number(row[3]) || 0,
                          offering_total: Number(row[4]) || 0,
                          electronic_batch: Number(row[5]) || 0,
                          checks_coins: Number(row[6]) || 0
                        });
                    }
                }
            }
        });
        
        offeringHistory.sort((a, b) => new Date(a.week_end_sunday).getTime() - new Date(b.week_end_sunday).getTime());

        const weeklyData = offeringHistory
          .filter(w => w.week_end_sunday && w.offering_total > 0)
          .map(w => ({
            week: w.week_end_sunday,
            gross: w.offering_total || 0,
            electronic: w.electronic_batch || 0,
            check: w.checks_coins || 0,
            ytd_budgeted: w.ytd_budgeted_income || 0,
            ytd_actual: w.ytd_actual_income || 0,
            variance: w.ytd_surplus_deficit || 0,
            source: 'offering'
          }))
          .map((week, i, arr) => {
            let ma = null;
            if (i >= 3) {
              const last4 = arr.slice(i - 3, i + 1);
              ma = last4.reduce((sum, w) => sum + (w.gross || 0), 0) / 4;
            }
            return { ...week, ma };
          });
        
        setData({ transactions, allocations, donors, funds, weeklyData, offeringHistory });
        setLoading(false);
      } catch (err: any) {
        console.error('Error loading data:', err);
        setError(err.message || 'Failed to load data');
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const filterByPeriod = (inputData: any[], dateField: string) => {
    const endDate = new Date('2025-05-31');
    const startDate = period === '1yr' 
      ? new Date('2024-06-01')
      : new Date('2022-06-01');
    
    return inputData.filter(item => {
      const dateStr = item[dateField];
      if (!dateStr) return false;
      const itemDate = new Date(dateStr);
      return itemDate >= startDate && itemDate <= endDate;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <div className="text-xl text-gray-700">Loading financial data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <div className="text-xl text-gray-700">Error loading data</div>
          <div className="text-sm text-gray-500 mt-2">{error}</div>
        </div>
      </div>
    );
  }

  // ALL ORIGINAL DATA CALCULATIONS ARE PRESERVED (with robust Number casting)
  // --- START: DIAGNOSTIC BLOCK ---
if (data.transactions.length > 0 && data.allocations.length > 0) {
  console.log("--- DEBUGGING FUND ALLOCATION ---");
  console.log("First Transaction ID:", data.transactions[0].transaction_id, "(type:", typeof data.transactions[0].transaction_id, ")");
  console.log("First Allocation's Transaction ID:", data.allocations[0].transaction_id, "(type:", typeof data.allocations[0].transaction_id, ")");
  console.log("Sample Transaction Object:", data.transactions[0]);
  console.log("Sample Allocation Object:", data.allocations[0]);
  console.log("---------------------------------");
}
// --- END: DIAGNOSTIC BLOCK ---
  const filteredTransactions = filterByPeriod(data.transactions, 'received_date');
  const filteredWeekly = filterByPeriod(data.weeklyData, 'week');
  
  const totalGiving = filteredWeekly.reduce((sum, w) => sum + (w.gross || 0), 0);
  const transactionDataTotal = filteredTransactions.reduce((sum, t) => sum + (Number(t.gross_amount) || 0), 0);
  
  const avgGift = filteredTransactions.length > 0 ? transactionDataTotal / filteredTransactions.length : 0;
  const uniqueDonors = new Set(filteredTransactions.map(t => t.donor_id).filter(id => id)).size;
  
  let yoyGrowth = 0;
  if (period === '1yr') {
    const currentYearWeeks = data.weeklyData.filter(w => {
      const date = new Date(w.week);
      return date >= new Date('2024-06-01') && date <= new Date('2025-05-31');
    });
    const prevYearWeeks = data.weeklyData.filter(w => {
      const date = new Date(w.week);
      return date >= new Date('2023-06-01') && date <= new Date('2024-05-31');
    });
    
    const currentYearTotal = currentYearWeeks.reduce((sum, w) => sum + (w.gross || 0), 0);
    const prevYearTotal = prevYearWeeks.reduce((sum, w) => sum + (w.gross || 0), 0);
    
    if (prevYearTotal > 0) {
      yoyGrowth = ((currentYearTotal - prevYearTotal) / prevYearTotal * 100);
    }
  }

const fundTotals: { [key: string]: number } = {};
  // This new logic starts with transactions we already know are in the date range.
  filteredTransactions.forEach(t => {
    // Then, it finds all allocations for that specific transaction.
    const relatedAllocations = data.allocations.filter(
      alloc => String(alloc.transaction_id) === String(t.transaction_id)
    );
    
    // And processes them.
    relatedAllocations.forEach(alloc => {
      const fund = data.funds.find(f => String(f.fund_id) === String(alloc.fund_id));
      const fundName = fund ? (fund.fund_name as string) : 'Unknown';
      const amount = Number(alloc.amount) || 0;
      fundTotals[fundName] = (fundTotals[fundName] || 0) + amount;
    });
  });

  const fundData = Object.entries(fundTotals)
    .map(([name, value]) => ({ 
      name, 
      value, 
      percentage: transactionDataTotal > 0 ? (value / transactionDataTotal * 100).toFixed(1) : '0.0'
    }))
    .sort((a, b) => b.value - a.value);

  const giftRanges = [
    { label: '$0-50', min: 0, max: 50, count: 0, total: 0 },
    { label: '$51-100', min: 51, max: 100, count: 0, total: 0 },
    { label: '$101-250', min: 101, max: 250, count: 0, total: 0 },
    { label: '$251-500', min: 251, max: 500, count: 0, total: 0 },
    { label: '$501-1000', min: 501, max: 1000, count: 0, total: 0 },
    { label: '$1000+', min: 1001, max: Infinity, count: 0, total: 0 }
  ];

  filteredTransactions.forEach(t => {
    const amount = Number(t.gross_amount) || 0;
    const range = giftRanges.find(r => amount >= r.min && amount <= r.max);
    if (range) {
      range.count++;
      range.total += amount;
    }
  });

  const paymentMethods: { [key: string]: number } = {};
  filteredTransactions.forEach(t => {
    const method = (t.payment_method as string) || 'Unknown';
    paymentMethods[method] = (paymentMethods[method] || 0) + (Number(t.gross_amount) || 0);
  });

  const paymentMethodData = Object.entries(paymentMethods)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const COLORS = ['#FF8C42', '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#14B8A6'];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="text-4xl">🏛️</div>
                <h1 className="text-3xl font-bold text-gray-900">Bucks Church Financial Health Dashboard</h1>
              </div>
              <p className="text-lg text-gray-600 font-medium mb-2">
                Financial Performance Analysis{' '}
                <span className="text-gray-500">
                  ({period === '1yr' ? 'Jun 2024 - May 2025' : 'Jun 2022 - May 2025'})
                </span>
              </p>
              <p className="text-sm text-yellow-600">Data through complete trimesters only • Each trimester = 4 months</p>
            </div>
            
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => setPeriod('1yr')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  period === '1yr' 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                1 Year
              </button>
              <button
                onClick={() => setPeriod('3yr')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  period === '3yr' 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                3 Years
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            icon={DollarSign}
            label="Total Giving"
            value={totalGiving >= 1000000 ? `${(totalGiving / 1000000).toFixed(2)}M` : `$${(totalGiving / 1000).toFixed(0)}K`}
            change={period === '1yr' && yoyGrowth !== 0 ? `${yoyGrowth > 0 ? '+' : ''}${yoyGrowth.toFixed(1)}% YoY` : null}
            positive={yoyGrowth > 0}
            subtitle="Total giving for period"
          />
          <MetricCard
            icon={Users}
            label="Active Donors"
            value={uniqueDonors}
            subtitle={`${data.donors.length > 0 ? ((uniqueDonors / data.donors.length) * 100).toFixed(0) : 0}% of total donors`}
          />
          <MetricCard
            icon={TrendingUp}
            label="Average Gift"
            value={`$${avgGift.toFixed(0)}`}
            subtitle={`From ${filteredTransactions.length} transactions`}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Weekly Giving Trend</h3>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={filteredWeekly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="week"
                  tick={{ fontSize: 11, fill: '#6B7280' }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    if (period === '3yr') return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  }}
                  interval={period === '3yr' ? 12 : 6}
                />
                <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                <Tooltip 
                  formatter={(value: number, name) => [`$${value.toFixed(0)}`, name === 'gross' ? 'Weekly Total' : '4-Week Average']}
                  labelFormatter={(label) => `Week of ${new Date(label).toLocaleDateString()}`}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="gross" fill="#3B82F6" fillOpacity={0.7} name="Weekly Total" radius={[2, 2, 0, 0]} />
                <Line type="monotone" dataKey="ma" stroke="#FF8C42" strokeWidth={2} name="4-Week Average" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="p-4 border-b border-gray-100"><h3 className="text-sm font-semibold text-gray-900">Payment Method Mix</h3></div>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={paymentMethodData} cx="50%" cy="50%" innerRadius={45} outerRadius={80} dataKey="value" nameKey="name">
                  {paymentMethodData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value: number) => `$${(value / 1000).toFixed(0)}K`} />
                 <Legend />
              </PieChart>
            </ResponsiveContainer>
             <div className="mt-3 space-y-1">
                {paymentMethodData.map((method, index) => (
                  <div key={method.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-gray-700">{method.name}</span>
                    </div>
                    <span className="font-medium">${(method.value / 1000).toFixed(0)}K</span>
                  </div>
                ))}
              </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="p-4 border-b border-gray-100"><h3 className="text-sm font-semibold text-gray-900">Fund Allocation</h3></div>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={fundData.slice(0, 6)} cx="50%" cy="50%" innerRadius={45} outerRadius={80} dataKey="value" nameKey="name">
                  {fundData.slice(0, 6).map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value: number) => `$${(value / 1000).toFixed(0)}K`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
             <div className="mt-3 space-y-1">
                {fundData.slice(0, 6).map((fund, index) => (
                  <div key={fund.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-gray-700">{fund.name}</span>
                    </div>
                    <span className="font-medium">{fund.percentage}%</span>
                  </div>
                ))}
              </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="p-4 border-b border-gray-100"><h3 className="text-sm font-semibold text-gray-900">Gift Size Distribution</h3></div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={giftRanges}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {filteredWeekly.some(w => w.ytd_budgeted > 0) && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="p-4 border-b border-gray-100"><h3 className="text-sm font-semibold text-gray-900">Budget vs Actual Performance</h3></div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredWeekly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="ytd_budgeted" stroke="#9CA3AF" name="YTD Budgeted" dot={false} />
                <Line type="monotone" dataKey="ytd_actual" stroke="#10B981" name="YTD Actual" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default BucksChurchUnifiedDashboard;