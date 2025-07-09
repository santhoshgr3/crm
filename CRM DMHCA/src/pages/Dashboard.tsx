import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardStats from '../components/Dashboard/DashboardStats';
import LeadsByStatus from '../components/Dashboard/LeadsByStatus';
import RecentActivity from '../components/Dashboard/RecentActivity';
import { useCRM } from '../context/CRMContext';

export default function Dashboard() {
  const { state } = useCRM();
  const currentUser = state.currentUser;
  const navigate = useNavigate();

  // Only show stats for leads within reporting line
  const getVisibleLeads = () => {
    if (currentUser.role === 'senior_manager') return state.leads;
    // For other roles, only show leads assigned to users in their reporting line
    const visibleUserIds = state.users
      .filter(u => u.reportsTo === currentUser.id || u.id === currentUser.id)
      .map(u => u.id);
    return state.leads.filter(lead => visibleUserIds.includes(lead.assignedTo));
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome, {currentUser.name} ({currentUser.role.replace('_', ' ')})</p>
      </div>
      <DashboardStats leads={getVisibleLeads()} onStatClick={(type) => {
        if (type === 'Total Leads') navigate('/leads');
        if (type === 'Hot Leads') navigate('/leads?status=Hot');
        if (type === 'Conversions') navigate('/leads?status=Converted');
      }} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <LeadsByStatus leads={getVisibleLeads()} />
        <RecentActivity leads={getVisibleLeads()} />
      </div>
    </div>
  );
}