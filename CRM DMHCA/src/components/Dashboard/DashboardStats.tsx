import React from 'react';
import { Users, TrendingUp, DollarSign, Target } from 'lucide-react';
import { Lead } from '../../types';

interface DashboardStatsProps {
  leads: Lead[];
  onStatClick?: (type: string) => void;
}

export default function DashboardStats({ leads, onStatClick }: DashboardStatsProps) {
  const stats = React.useMemo(() => {
    const totalLeads = leads.length;
    const hotLeads = leads.filter(lead => lead.status === 'Hot').length;
    const conversions = leads.filter(lead => lead.status === 'Converted').length;
    const conversionRate = totalLeads > 0 ? (conversions / totalLeads) * 100 : 0;
    return {
      totalLeads,
      hotLeads,
      conversions,
      conversionRate: Math.round(conversionRate * 10) / 10
    };
  }, [leads]);

  const statCards = [
    {
      name: 'Total Leads',
      value: stats.totalLeads,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      name: 'Hot Leads',
      value: stats.hotLeads,
      icon: TrendingUp,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      name: 'Conversions',
      value: stats.conversions,
      icon: Target,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      name: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      icon: DollarSign,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.name}
            className={`rounded-lg p-6 shadow-sm border ${stat.bgColor} cursor-pointer`}
            onClick={() => onStatClick && onStatClick(stat.name)}
          >
            <div className={`flex items-center mb-2`}>
              <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${stat.color} bg-opacity-10 mr-3`}>
                <Icon className={`w-6 h-6 ${stat.textColor}`} />
              </span>
              <span className={`text-lg font-semibold ${stat.textColor}`}>{stat.name}</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
          </div>
        );
      })}
    </div>
  );
}