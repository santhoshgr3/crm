import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useCRM } from '../context/CRMContext';

export default function Analytics() {
  const { state } = useCRM();

  // Defensive: always use fallback arrays
  const users = state.users || [];
  const leads = state.leads || [];
  const counselors = users.filter(u => u.role === 'counselor');

  const leadSourceData = React.useMemo(() => {
    const sources = leads.reduce((acc, lead) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(sources).map(([source, count]) => ({
      source,
      count
    }));
  }, [leads]);

  const courseInterestData = React.useMemo(() => {
    const courses = leads.reduce((acc, lead) => {
      acc[lead.courseInterest] = (acc[lead.courseInterest] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(courses)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([course, count]) => ({
        course: course.length > 30 ? course.substring(0, 30) + '...' : course,
        count
      }));
  }, [leads]);

  const counselorPerformanceData = React.useMemo(() => {
    return counselors.map((counselor: any) => {
      const myLeads = leads.filter(lead => lead.assignedTo === counselor.id);
      const conversions = myLeads.filter(lead => lead.status === 'Converted').length;

      return {
        name: counselor.name.split(' ')[0], // First name only for chart
        leads: myLeads.length,
        conversions,
        conversionRate: myLeads.length > 0 ? Math.round((conversions / myLeads.length) * 100) : 0
      };
    });
  }, [leads, counselors]);

  if (!state.users || !state.leads) {
    return <div className="p-6">Loading analytics...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
        <p className="text-gray-600 mt-1">Comprehensive insights into lead performance and trends</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Lead Sources */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Sources</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadSourceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="source" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Counselor Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Counselor Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={counselorPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="leads" fill="#10B981" name="Total Leads" />
                <Bar dataKey="conversions" fill="#F59E0B" name="Conversions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Course Interest */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Popular Courses</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={courseInterestData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="course" type="category" width={200} />
              <Tooltip />
              <Bar dataKey="count" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Conversion Rates */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Rates by Counselor</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={counselorPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, 'Conversion Rate']} />
              <Line type="monotone" dataKey="conversionRate" stroke="#EF4444" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}