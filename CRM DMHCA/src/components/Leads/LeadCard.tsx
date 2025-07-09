import React from 'react';
import { Phone, Mail, MapPin, Clock, User, Edit, Trash2 } from 'lucide-react';
import { Lead } from '../../types';
import { format } from 'date-fns';
import { useCRM } from '../../context/CRMContext';

interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
  countryTime?: string; // Add this prop
}

export default function LeadCard({ lead, onEdit, onDelete, countryTime }: LeadCardProps) {
  const { state } = useCRM();

  const getCounselorName = (counselorId: string) => {
    // Use users with role counselor for backward compatibility
    const users = state.users || [];
    const counselor = users.find((c: any) => c.id === counselorId);
    return counselor?.name || 'Unknown';
  };

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
      <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${colorMap[status] || defaultColor}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-violet-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className={`flex items-start justify-between mb-4 ${lead.status === 'Hot' || lead.status === 'Hot Lead' ? 'bg-red-50' : lead.status === 'Warm' ? 'bg-green-50' : 'bg-black'}`}>
        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${lead.status === 'Hot' || lead.status === 'Hot Lead' ? 'text-red-800' : lead.status === 'Warm' ? 'text-green-800' : 'text-white'}`}>{lead.fullName}</h3>
          <p className={`text-sm mt-1 ${lead.status === 'Hot' || lead.status === 'Hot Lead' ? 'text-red-600' : lead.status === 'Warm' ? 'text-green-600' : 'text-gray-200'}`}>{lead.courseInterest}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(lead)}
            className={`p-2 rounded-full transition-colors duration-200 ${lead.status === 'Hot' || lead.status === 'Hot Lead' ? 'text-red-400 hover:text-red-700 hover:bg-red-100' : lead.status === 'Warm' ? 'text-green-400 hover:text-green-700 hover:bg-green-100' : 'text-white hover:text-violet-700 hover:bg-violet-50'}`}
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(lead.id)}
            className={`p-2 rounded-full transition-colors duration-200 ${lead.status === 'Hot' || lead.status === 'Hot Lead' ? 'text-red-400 hover:text-red-700 hover:bg-red-100' : lead.status === 'Warm' ? 'text-green-400 hover:text-green-700 hover:bg-green-100' : 'text-white hover:text-red-600 hover:bg-red-50'}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2">
          <Mail className="h-4 w-4 text-violet-400" />
          <span className="text-sm text-gray-600">{lead.email}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Phone className="h-4 w-4 text-violet-400" />
          <span className="text-sm text-gray-600">{lead.phone}</span>
        </div>
        {lead.location && (
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-violet-400" />
            <span className="text-sm text-gray-600">{lead.location}</span>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-violet-400" />
          <span className="text-sm text-gray-600">{getCounselorName(lead.assignedTo)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-violet-400" />
          <span className="text-sm text-gray-600">{lead.country}</span>
          {countryTime && (
            <span className="ml-2 text-xs text-violet-500">{countryTime}</span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
          {getStatusBadge(lead.status)}
        </div>
        <span className="text-xs text-violet-700 bg-violet-50 px-2 py-1 rounded">
          {lead.source}
        </span>
      </div>

      {lead.notes && (
        <div className="mb-2">
          <p className="text-sm text-gray-600 bg-violet-50 p-3 rounded-md">
            <b>Notes:</b> {lead.notes}
          </p>
          {lead.notesDate && (
            <div className="text-xs text-violet-700 mt-1">
              <b>Conversation Date:</b> {lead.notesDate}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <Clock className="h-3 w-3 text-violet-400" />
          <span>Created: {format(new Date(lead.createdAt), 'MMM dd, yyyy')}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="h-3 w-3 text-violet-400" />
          <span>Updated: {format(new Date(lead.updatedAt), 'MMM dd, yyyy')}</span>
        </div>
      </div>
    </div>
  );
}