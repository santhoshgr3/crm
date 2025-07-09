import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useCRM } from '../../context/CRMContext';

const STATUS_COLORS = {
  'Hot': '#EF4444',
  'Warm': '#F59E0B',
  'Cold': '#3B82F6',
  'Follow-Up Needed': '#8B5CF6',
  'Not Interested': '#6B7280',
  'Converted': '#10B981',
  'Lost': '#F87171'
};

export default function LeadsByStatus() {
  const { state } = useCRM();

  const data = React.useMemo(() => {
    const statusCounts = state.leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count,
      color: STATUS_COLORS[status as keyof typeof STATUS_COLORS]
    }));
  }, [state.leads]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Leads by Status</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}