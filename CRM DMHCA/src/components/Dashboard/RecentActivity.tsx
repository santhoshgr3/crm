import React from 'react';
import { Clock, User, Phone, Mail } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { format } from 'date-fns';

export default function RecentActivity() {
  const { state } = useCRM();

  const recentLeads = React.useMemo(() => {
    return (state.leads || [])
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);
  }, [state.leads]);

  const getCounselorName = (counselorId: string) => {
    const users = state.users || [];
    const counselor = users.find((c: any) => c.id === counselorId);
    return counselor?.name || 'Unknown';
  };

  const allStatuses = [
    'Admission done',
    'will enroll later',
    'Junk',
    'Fresh Lead',
    'Followup',
    'Hot Lead',
    'Not Answering',
    'Repeated Lead',
    'offline/cv',
    'Warm',
    'Not Interested',
    'Not Eligible',
    'Not Valid No.',
    'Interested, Detail Sent',
    'Detail Sent No responding',
    'Already enrolled',
    'Support query',
    'Call Back',
    'Fresh Leads',
    'Fresh leads',
    'Follow up Reassigned',
    'Fees issue',
    'Hot-Drop out',
    'Tried Multiple Times -No Response',
    'Fresh',
    'Hot',
    'Follow-Up'
  ];

  const getStatusBadge = (status: string) => {
    // Color logic: Hot=red, Warm=green, Follow-Up=black, others=blue
    const colorMap: Record<string, string> = {
      'Hot': 'bg-red-100 text-red-800',
      'Hot Lead': 'bg-red-100 text-red-800',
      'Warm': 'bg-green-100 text-green-800',
      'Follow-Up': 'bg-black text-white',
      'Followup': 'bg-black text-white',
    };
    const defaultColor = 'bg-blue-100 text-blue-800';
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorMap[status] || defaultColor}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {recentLeads.map((lead) => (
          <div key={lead.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {lead.fullName}
                </p>
                {getStatusBadge(lead.status)}
              </div>
              <div className="flex items-center space-x-4 mt-1">
                <p className="text-sm text-gray-500 flex items-center">
                  <Mail className="h-3 w-3 mr-1" />
                  {lead.email}
                </p>
                <p className="text-sm text-gray-500 flex items-center">
                  <Phone className="h-3 w-3 mr-1" />
                  {lead.phone}
                </p>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-400">
                  Assigned to: {getCounselorName(lead.assignedTo)}
                </p>
                <p className="text-xs text-gray-400 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {format(new Date(lead.updatedAt), 'MMM dd, HH:mm')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}