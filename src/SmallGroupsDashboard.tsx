import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import _ from 'lodash';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line 
} from 'recharts';

// Define types for better TypeScript support
declare global {
  interface Window {
    fs?: {
      readFile: (path: string, options: { encoding: string }) => Promise<string>;
    };
  }
}

interface Event {
  event_id: string;
  group_id: string;
  event_name: string;
  event_date: string;
  event_start_dt: string;
  event_end_dt: string;
  location: string;
  total_attended_count: number;
  members_attended_count: number;
  visitors_attended_count: number;
  source_file: string;
  month?: string;
  weekday?: string;
  hour?: number;
}

interface Group {
  group_id: string;
  group_name: string;
  group_type: string;
  tags: string;
  leaders: string;
  members_count: number;
  sources: string;
  in_archived_doc: boolean;
  is_active_in_exports: boolean;
  is_archived_in_exports: boolean;
  status_drift_flag: boolean;
  name_norm: string;
  canonical_status: string;
  status_source: string;
  status_note: string;
}

// Main component - MUST be default export for routing
const SmallGroupsDashboard: React.FC = () => {
  const [status, setStatus] = useState('Initializing...');
  const [events, setEvents] = useState<Event[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [memberVisitorData, setMemberVisitorData] = useState<any[]>([]);
  const [groupConsistencyData, setGroupConsistencyData] = useState<any[]>([]);
  const [topGroupsData, setTopGroupsData] = useState<any[]>([]);
  const [monthlyGrowthData, setMonthlyGrowthData] = useState<any[]>([]);
  const [allGroupsData, setAllGroupsData] = useState<any[]>([]);
  const [sortConfig, setSortConfig] = useState({ key: 'totalEvents', direction: 'desc' });
  const [groupFilter, setGroupFilter] = useState('all');

  const COLORS = {
    Active: '#10b981',
    Archived: '#ef4444',
    'Seasonal break': '#f59e0b',
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#ec4899'
  };

  useEffect(() => {
    let mounted = true;
    
    const loadData = async () => {
      if (mounted) {
        await loadAndProcessData();
      }
    };
    
    loadData();
    
    return () => {
      mounted = false;
    };
  }, []);

  // Function to correct known group name spelling issues
  const correctGroupName = (name: string) => {
    if (!name) return name;
    
    const normalized = name.toLowerCase().replace(/[''`´]/g, "'").trim();
    
    const corrections: Record<string, string> = {
      "a widows walk": "A Widow's Walk",
      "a widow's walk": "A Widow's Walk",
      "a widows' walk": "A Widow's Walk"
    };
    
    return corrections[normalized] || name;
  };

  // Function to normalize group names for duplicate detection
  const normalizeGroupName = (name: string) => {
    if (!name) return '';
    return name
      .toLowerCase()
      .replace(/[''`´]/g, "'")
      .replace(/[""„"]/g, '"')
      .replace(/[–—]/g, '-')
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s'-]/g, '')
      .trim();
  };

  // Function to merge duplicate groups
  const mergeDuplicateGroups = (groupsData: Group[], eventsData: Event[]) => {
    console.log('Starting duplicate group merge...');
    
    const correctedGroups = groupsData.map(group => ({
      ...group,
      group_name: correctGroupName(group.group_name)
    }));
    
    const nameGroups: Record<string, Group[]> = {};
    correctedGroups.forEach(group => {
      const normalized = normalizeGroupName(group.group_name);
      if (!nameGroups[normalized]) {
        nameGroups[normalized] = [];
      }
      nameGroups[normalized].push(group);
    });

    const mergedGroups: Group[] = [];
    const groupIdMapping: Record<string, string> = {};

    Object.entries(nameGroups).forEach(([normalizedName, groups]) => {
      if (groups.length === 1) {
        mergedGroups.push(groups[0]);
      } else {
        const primaryGroup = groups.find(g => g.canonical_status === 'Active') || groups[0];
        
        const mergedGroup = {
          ...primaryGroup,
          group_name: normalizedName.includes('widow') ? "A Widow's Walk" : primaryGroup.group_name,
          members_count: Math.max(...groups.map(g => g.members_count || 0)),
          sources: groups.map(g => g.sources).filter(Boolean).join('; '),
          leaders: groups.map(g => g.leaders).filter(Boolean).join('; ')
        };

        mergedGroups.push(mergedGroup);

        groups.forEach(group => {
          groupIdMapping[group.group_id] = primaryGroup.group_id;
        });
      }
    });

    const updatedEvents = eventsData.map(event => ({
      ...event,
      group_id: groupIdMapping[event.group_id] || event.group_id
    }));

    return { mergedGroups, updatedEvents };
  };

  const loadAndProcessData = async () => {
    try {
      setStatus('Loading CSV files...');
      
      // Note: window.fs check moved to file loading section

      // Fetch CSV files from public folder
      let eventsData: string;
      let enrichedGroupsData: string;
      
      // In Vite, files in public folder are served from the base path
      // Get the base path from the current URL
      const base = import.meta.env.BASE_URL || '/';
      console.log('Base URL from Vite:', base);
      console.log('Attempting to fetch from:', `${base}events.csv`);
      
      const eventsResponse = await fetch(`${base}events.csv`);
      if (!eventsResponse.ok) {
        console.error('Failed to fetch events.csv from:', `${base}events.csv`);
        throw new Error(`Failed to load events.csv: ${eventsResponse.status}`);
      }
      eventsData = await eventsResponse.text();
      
      const groupsResponse = await fetch(`${base}enriched_groups.csv`);
      if (!groupsResponse.ok) {
        console.error('Failed to fetch enriched_groups.csv from:', `${base}enriched_groups.csv`);
        throw new Error(`Failed to load enriched_groups.csv: ${groupsResponse.status}`);
      }
      enrichedGroupsData = await groupsResponse.text();

      setStatus('Parsing data...');

      const eventsParsed = Papa.parse(eventsData, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => header.trim()
      });

      const groupsParsed = Papa.parse(enrichedGroupsData, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => header.trim()
      });

      console.log('Events parsed:', eventsParsed.data.length, 'rows');
      console.log('First event:', eventsParsed.data[0]);
      console.log('Groups parsed:', groupsParsed.data.length, 'rows');
      console.log('First group:', groupsParsed.data[0]);

      if (eventsParsed.errors.length > 0) {
        console.error('Events parsing errors:', eventsParsed.errors);
      }

      if (groupsParsed.errors.length > 0) {
        console.error('Groups parsing errors:', groupsParsed.errors);
      }

      // Check if data is empty
      if (eventsParsed.data.length === 0) {
        throw new Error('No events data found in CSV');
      }

      if (groupsParsed.data.length === 0) {
        throw new Error('No groups data found in CSV');
      }

      setStatus('Processing data...');

      console.log('=== DEBUGGING DATA FLOW ===');
      console.log('1. Raw events count:', eventsParsed.data.length);
      console.log('2. Raw groups count:', groupsParsed.data.length);
      
      const { mergedGroups, updatedEvents } = mergeDuplicateGroups(
        groupsParsed.data as Group[], 
        eventsParsed.data as Event[]
      );
      
      console.log('3. After merge - events:', updatedEvents.length);
      console.log('4. After merge - groups:', mergedGroups.length);

      const processedEvents = updatedEvents
        .filter(event => {
          // Your CSV uses 'event_date' not 'event_start_dt'
          const hasDate = event.event_date;
          const hasGroupId = event.group_id;
          
          if (!hasDate) {
            console.log('Event missing event_date:', event);
          }
          if (!hasGroupId) {
            console.log('Event missing group_id:', event);
          }
          
          return hasDate && hasGroupId;
        })
        .map(event => {
          const eventDate = new Date(event.event_date);
          
          // Extract hour from event_start_dt if it exists, otherwise default to 0
          let hour = 0;
          if (event.event_start_dt) {
            const startDateTime = new Date(event.event_start_dt);
            hour = startDateTime.getHours();
          }
          
          return {
            ...event,
            month: eventDate.toISOString().substring(0, 7),
            weekday: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][eventDate.getDay()],
            hour: hour,
            total_attended_count: Number(event.total_attended_count) || 0,
            members_attended_count: Number(event.members_attended_count) || 0,
            visitors_attended_count: Number(event.visitors_attended_count) || 0
          };
        });

      console.log('Processed events:', processedEvents.length);
      if (processedEvents.length > 0) {
        console.log('Sample processed event:', processedEvents[0]);
      }
      console.log('Merged groups:', mergedGroups.length);
      
      if (processedEvents.length === 0) {
        console.warn('No events after processing');
        if (updatedEvents.length > 0) {
          console.log('Sample raw event:', updatedEvents[0]);
        }
      }

      console.log('5. Final processed events:', processedEvents.length);
      console.log('6. Final merged groups:', mergedGroups.length);

      setEvents(processedEvents);
      setGroups(mergedGroups);
      
      console.log('7. State set - generating visualizations...');

      // Generate all visualizations
      generateTimelineData(processedEvents, mergedGroups);
      generateMemberVisitorData(processedEvents);
      generateGroupConsistencyData(processedEvents, mergedGroups);
      generateTopGroupsData(processedEvents, mergedGroups);
      generateMonthlyGrowthData(processedEvents, mergedGroups);
      generateAllGroupsData(processedEvents, mergedGroups);

      console.log('8. All visualizations generated');
      setStatus('');
      console.log('=== DATA FLOW COMPLETE ===');
    } catch (error) {
      console.error('Error loading data:', error);
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const formatMonthDisplay = (monthStr: string) => {
    if (monthStr && monthStr.length >= 7) {
      const year = monthStr.substring(2, 4);
      const month = parseInt(monthStr.substring(5, 7));
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return monthNames[month - 1] + ' ' + year;
    }
    return monthStr || '';
  };

  const generateTimelineData = (eventsData: Event[], groupsData: Group[]) => {
    const groupLookup = _.keyBy(groupsData, 'group_id');

    const monthlyData = _.chain(eventsData)
      .groupBy('month')
      .map((events, month) => {
        const byStatus = _.groupBy(events, e => {
          const group = groupLookup[e.group_id];
          return group ? group.canonical_status : 'Unknown';
        });

        const totalAttendance = _.sumBy(events, 'total_attended_count');

        return {
          month: formatMonthDisplay(month),
          monthSort: month,
          Active: byStatus['Active'] ? byStatus['Active'].length : 0,
          Archived: byStatus['Archived'] ? byStatus['Archived'].length : 0,
          'Seasonal break': byStatus['Seasonal break'] ? byStatus['Seasonal break'].length : 0,
          total: events.length,
          attendance: totalAttendance
        };
      })
      .sortBy(item => item.monthSort)
      .value();

    setTimelineData(monthlyData);
  };

  const generateMemberVisitorData = (eventsData: Event[]) => {
    const monthlyData = _.chain(eventsData)
      .groupBy('month')
      .map((events, month) => ({
        month: formatMonthDisplay(month),
        monthSort: month,
        Members: _.sumBy(events, 'members_attended_count'),
        Visitors: _.sumBy(events, 'visitors_attended_count')
      }))
      .sortBy(item => item.monthSort)
      .value();

    setMemberVisitorData(monthlyData);
  };

  const generateGroupConsistencyData = (eventsData: Event[], groupsData: Group[]) => {
    const groupLookup = _.keyBy(groupsData, 'group_id');
    
    const topGroups = _.chain(eventsData)
      .groupBy('group_id')
      .map((events, groupId) => {
        const group = groupLookup[groupId];
        if (!group || group.group_name?.includes('Serve Team') || group.group_name === 'Staff Meeting') {
          return null;
        }

        const attendances = events.map(e => e.total_attended_count);
        const sorted = _.sortBy(attendances);
        const median = sorted[Math.floor(sorted.length / 2)] || 0;
        const mean = _.mean(attendances) || 0;
        const variance = _.mean(attendances.map(a => Math.pow(a - mean, 2))) || 0;
        const stdDev = Math.sqrt(variance);
        const cv = mean > 0 ? (stdDev / mean) * 100 : 0;
        
        return {
          groupId,
          name: group.group_name,
          eventCount: events.length,
          median,
          mean: Math.round(mean),
          consistency: Math.round(100 - cv),
          status: group.canonical_status
        };
      })
      .filter(g => g !== null && g.eventCount >= 3)
      .orderBy('median', 'desc')
      .take(12)
      .value();

    const chartData = topGroups.map(group => ({
      name: group.name.length > 20 ? group.name.substring(0, 17) + '...' : group.name,
      'Median Attendance': group.median,
      'Consistency Score': group.consistency,
      'Events': group.eventCount
    }));

    setGroupConsistencyData(chartData);
  };

  const generateTopGroupsData = (eventsData: Event[], groupsData: Group[]) => {
    const groupLookup = _.keyBy(groupsData, 'group_id');
    
    const groupStats = _.chain(eventsData)
      .groupBy('group_id')
      .map((events, groupId) => {
        const group = groupLookup[groupId];
        if (!group || 
            group.canonical_status !== 'Active' ||
            group.group_name?.includes('Serve Team') || 
            group.group_name === 'Staff Meeting') {
          return null;
        }

        const attendances = events.map(e => e.total_attended_count);
        const avgAttendance = Math.round(_.mean(attendances) || 0);
        
        return {
          name: group.group_name,
          avgAttendance,
          events: events.length
        };
      })
      .filter(g => g !== null && g.events >= 2)
      .orderBy('avgAttendance', 'desc')
      .take(10)
      .value();

    const chartData = groupStats.map(group => ({
      name: group.name.length > 22 ? group.name.substring(0, 19) + '...' : group.name,
      'Average': group.avgAttendance,
      'Events': group.events
    }));

    setTopGroupsData(chartData);
  };

  const generateMonthlyGrowthData = (eventsData: Event[], groupsData: Group[]) => {
    const groupLookup = _.keyBy(groupsData, 'group_id');
    
    const monthlyData = _.chain(eventsData)
      .groupBy('month')
      .map((events, month) => {
        const activeEvents = events.filter(e => {
          const group = groupLookup[e.group_id];
          return group && 
                 group.canonical_status === 'Active' &&
                 !group.group_name?.includes('Serve Team') && 
                 group.group_name !== 'Staff Meeting';
        });

        const totalVisitors = _.sumBy(activeEvents, 'visitors_attended_count');
        const totalAttendance = _.sumBy(activeEvents, 'total_attended_count');
        const visitorRate = totalAttendance > 0 ? Math.round((totalVisitors / totalAttendance) * 100) : 0;

        return {
          month: formatMonthDisplay(month),
          monthSort: month,
          visitorRate,
          totalAttendance,
          visitors: totalVisitors
        };
      })
      .sortBy(item => item.monthSort)
      .value();

    setMonthlyGrowthData(monthlyData);
  };

  const generateAllGroupsData = (eventsData: Event[], groupsData: Group[]) => {
    const groupLookup = _.keyBy(groupsData, 'group_id');
    
    const allGroups = _.chain(eventsData)
      .groupBy('group_id')
      .map((events, groupId) => {
        const group = groupLookup[groupId];
        if (!group || group.group_name?.includes('Serve Team') || group.group_name === 'Staff Meeting') {
          return null;
        }

        const attendances = events.map(e => e.total_attended_count);
        const sorted = _.sortBy(attendances);
        const median = sorted[Math.floor(sorted.length / 2)] || 0;
        const mean = _.mean(attendances) || 0;
        const variance = _.mean(attendances.map(a => Math.pow(a - mean, 2))) || 0;
        const stdDev = Math.sqrt(variance);
        const cv = mean > 0 ? (stdDev / mean) * 100 : 0;
        const consistency = Math.round(100 - cv);

        const totalVisitors = _.sumBy(events, 'visitors_attended_count');
        const totalAttendance = _.sumBy(events, 'total_attended_count');
        const visitorRate = totalAttendance > 0 ? Math.round((totalVisitors / totalAttendance) * 100) : 0;

        const sortedEvents = _.sortBy(events, 'event_date');
        const lastEventDate = sortedEvents.length > 0 ? 
          new Date(sortedEvents[sortedEvents.length - 1].event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 
          '-';

        return {
          groupId,
          name: group.group_name,
          groupType: group.group_type,
          status: group.canonical_status,
          totalEvents: events.length,
          medianAttendance: median,
          avgAttendance: Math.round(mean),
          consistency,
          visitorRate,
          lastEvent: lastEventDate,
          leaders: group.leaders
        };
      })
      .filter(g => g !== null)
      .value();

    setAllGroupsData(allGroups);
  };

  // Sorting logic
  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const sortedGroupsData = useMemo(() => {
    const filtered = allGroupsData.filter(group => {
      if (groupFilter === 'all') return true;
      if (groupFilter === 'active') return group.status === 'Active';
      if (groupFilter === 'archived') return group.status === 'Archived';
      if (groupFilter === 'seasonal') return group.status === 'Seasonal break';
      return true;
    });

    return _.orderBy(filtered, [sortConfig.key], [sortConfig.direction as 'asc' | 'desc']);
  }, [allGroupsData, groupFilter, sortConfig]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Calculate summary stats
  const totalGroups = groups.length;
  const activeGroups = groups.filter(g => g.canonical_status === 'Active').length;
  const totalEvents = events.length;
  const totalAttendance = _.sumBy(events, 'total_attended_count');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Small Groups Health Dashboard</h1>
          <p className="text-gray-600">Comprehensive analysis of Bucks Church small groups • June 2024 through May 2025</p>
          {status && (
            <div className="mt-4 p-3 bg-blue-100 text-blue-700 rounded-lg inline-block">
              {status}
            </div>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Groups</h3>
            <p className="text-2xl font-bold text-gray-900">{totalGroups}</p>
            <p className="text-sm text-gray-500">All registered groups</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Active Small Groups</h3>
            <p className="text-2xl font-bold text-green-600">{activeGroups}</p>
            <p className="text-sm text-gray-500">Excludes Serve Teams & Staff</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Events</h3>
            <p className="text-2xl font-bold text-blue-600">{totalEvents}</p>
            <p className="text-sm text-gray-500">June 2024 - May 2025</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Attendance</h3>
            <p className="text-2xl font-bold text-purple-600">{totalAttendance.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Member + visitor attendances</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Events Over Time by Status</h2>
            <p className="text-sm text-gray-600 mb-4">Monthly event counts split by group canonical status</p>
            {timelineData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area type="monotone" dataKey="Active" stackId="1" stroke={COLORS.Active} fill={COLORS.Active} />
                  <Area type="monotone" dataKey="Archived" stackId="1" stroke={COLORS.Archived} fill={COLORS.Archived} />
                  <Area type="monotone" dataKey="Seasonal break" stackId="1" stroke={COLORS['Seasonal break']} fill={COLORS['Seasonal break']} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <p>Loading timeline data...</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Members vs Visitors</h2>
            <p className="text-sm text-gray-600 mb-4">Monthly attendance breakdown showing outreach effectiveness</p>
            {memberVisitorData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={memberVisitorData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="Members" fill={COLORS.primary} />
                  <Bar dataKey="Visitors" fill={COLORS.accent} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <p>Loading member/visitor data...</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Group Consistency (Top 12)</h2>
            <p className="text-sm text-gray-600 mb-4">Median attendance and consistency score for most active groups</p>
            {groupConsistencyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={groupConsistencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="Median Attendance" fill={COLORS.primary} />
                  <Bar dataKey="Consistency Score" fill={COLORS.secondary} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <p>No consistency data available</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Top Active Groups by Attendance</h2>
            <p className="text-sm text-gray-600 mb-4">Active small groups ranked by average attendance (excludes Serve Teams)</p>
            {topGroupsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topGroupsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="Average" fill={COLORS.primary} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <p>No top groups data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Groups Table */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">All Groups Detailed Analysis</h2>
          <p className="text-sm text-gray-600 mb-4">Comprehensive statistics for all small groups (excluding Serve Teams & Staff)</p>
          
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium">{sortedGroupsData.length}</span> groups
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setGroupFilter('all')}
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  groupFilter === 'all' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All ({allGroupsData.length})
              </button>
              <button
                onClick={() => setGroupFilter('active')}
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  groupFilter === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Active ({allGroupsData.filter(g => g.status === 'Active').length})
              </button>
              <button
                onClick={() => setGroupFilter('archived')}
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  groupFilter === 'archived' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Archived ({allGroupsData.filter(g => g.status === 'Archived').length})
              </button>
              <button
                onClick={() => setGroupFilter('seasonal')}
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  groupFilter === 'seasonal' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Seasonal ({allGroupsData.filter(g => g.status === 'Seasonal break').length})
              </button>
            </div>
          </div>

          {sortedGroupsData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('name')}
                    >
                      Group Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('status')}
                    >
                      Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('totalEvents')}
                    >
                      Events {sortConfig.key === 'totalEvents' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('medianAttendance')}
                    >
                      Median {sortConfig.key === 'medianAttendance' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('avgAttendance')}
                    >
                      Average {sortConfig.key === 'avgAttendance' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('consistency')}
                    >
                      Consistency {sortConfig.key === 'consistency' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('visitorRate')}
                    >
                      Visitor % {sortConfig.key === 'visitorRate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Leaders
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedGroupsData.map((group, index) => (
                    <tr key={group.groupId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 text-sm text-gray-900">
                        <div className="font-medium">{group.name}</div>
                        <div className="text-xs text-gray-500">{group.groupType}</div>
                      </td>
                      <td className="px-3 py-2 text-sm">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          group.status === 'Active' ? 'bg-green-100 text-green-800' :
                          group.status === 'Archived' ? 'bg-red-100 text-red-800' :
                          group.status === 'Seasonal break' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {group.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-900">{group.totalEvents}</td>
                      <td className="px-3 py-2 text-sm text-gray-900">{group.medianAttendance}</td>
                      <td className="px-3 py-2 text-sm text-gray-900">{group.avgAttendance}</td>
                      <td className="px-3 py-2 text-sm text-gray-900">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            group.consistency >= 80 ? 'bg-green-400' :
                            group.consistency >= 60 ? 'bg-yellow-400' :
                            'bg-red-400'
                          }`}></div>
                          {group.consistency}%
                        </div>
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-900">{group.visitorRate}%</td>
                      <td className="px-3 py-2 text-sm text-gray-500">
                        {group.leaders ? group.leaders.substring(0, 30) + (group.leaders.length > 30 ? '...' : '') : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-500">
              <p>No group data available</p>
            </div>
          )}
        </div>

        {/* Growth Insights */}
        {monthlyGrowthData.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Visitor Rate Trends</h2>
            <p className="text-sm text-gray-600 mb-4">Monthly visitor percentage for active small groups (outreach indicator)</p>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="visitorRate" stroke={COLORS.accent} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

// IMPORTANT: Default export for routing
export default SmallGroupsDashboard;