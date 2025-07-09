import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Lead, LeadStatus } from '../../types';
import KanbanCard from './KanbanCard';

interface KanbanColumnProps {
  status: LeadStatus;
  leads: Lead[];
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (leadId: string) => void;
}

const STATUS_CONFIG = {
  'Hot': { emoji: '🔥', color: 'border-red-300 bg-red-50' },
  'Warm': { emoji: '🟡', color: 'border-yellow-300 bg-yellow-50' },
  'Cold': { emoji: '🔵', color: 'border-blue-300 bg-blue-50' },
  'Follow-Up Needed': { emoji: '⏰', color: 'border-purple-300 bg-purple-50' },
  'Not Interested': { emoji: '❌', color: 'border-gray-300 bg-gray-50' },
  'Converted': { emoji: '✅', color: 'border-green-300 bg-green-50' },
  'Lost': { emoji: '💔', color: 'border-red-300 bg-red-100' }
};

export default function KanbanColumn({ status, leads, onEditLead, onDeleteLead }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const config = STATUS_CONFIG[status];

  return (
    <div className="flex-shrink-0 w-80">
      <div className={`rounded-lg border-2 border-dashed ${config.color} ${isOver ? 'border-solid' : ''} transition-all duration-200`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
              <span>{config.emoji}</span>
              <span>{status}</span>
            </h3>
            <span className="bg-gray-200 text-gray-700 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {leads.length}
            </span>
          </div>

          <div ref={setNodeRef} className="space-y-3 min-h-[400px]">
            {leads.map((lead) => (
              <KanbanCard
                key={lead.id}
                lead={lead}
                onEdit={onEditLead}
                onDelete={onDeleteLead}
              />
            ))}
            {leads.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <p className="text-sm">No leads in this status</p>
                <p className="text-xs mt-1">Drag leads here to update status</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}