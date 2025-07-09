import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Phone, Mail, MapPin, User, Edit, Trash2 } from 'lucide-react';
import { Lead } from '../../types';
import { useCRM } from '../../context/CRMContext';

interface KanbanCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
}

export default function KanbanCard({ lead, onEdit, onDelete }: KanbanCardProps) {
  const { state } = useCRM();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id,
  });

  const getCounselorName = (counselorId: string) => {
    const counselor = state.users.find(c => c.role === 'counselor' && c.id === counselorId);
    return counselor?.name || 'Unknown';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'High': 'bg-red-100 text-red-800 border-red-200',
      'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Low': 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-move hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 text-sm leading-tight">{lead.fullName}</h4>
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{lead.courseInterest}</p>
        </div>
        <div className="flex space-x-1 ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(lead);
            }}
            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
          >
            <Edit className="h-3 w-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(lead.id);
            }}
            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center space-x-2">
          <Mail className="h-3 w-3 text-gray-400 flex-shrink-0" />
          <span className="text-xs text-gray-600 truncate">{lead.email}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Phone className="h-3 w-3 text-gray-400 flex-shrink-0" />
          <span className="text-xs text-gray-600">{lead.phone}</span>
        </div>
        {lead.location && (
          <div className="flex items-center space-x-2">
            <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />
            <span className="text-xs text-gray-600">{lead.location}</span>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <User className="h-3 w-3 text-gray-400 flex-shrink-0" />
          <span className="text-xs text-gray-600 truncate">{getCounselorName(lead.assignedTo)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className={`px-2 py-1 text-xs font-medium rounded border ${getPriorityColor(lead.priority || '')}`}>
          {lead.priority}
        </span>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {lead.source}
        </span>
      </div>
    </div>
  );
}