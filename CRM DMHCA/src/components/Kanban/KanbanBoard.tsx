import React from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { Lead, LeadStatus } from '../../types';
import { useCRM } from '../../context/CRMContext';
import KanbanColumn from './KanbanColumn';
import LeadCard from '../Leads/LeadCard';

const STATUSES: LeadStatus[] = [
  'Hot',
  'Warm',
  'Cold',
  'Follow-Up Needed',
  'Not Interested',
  'Converted',
  'Lost'
];

export default function KanbanBoard() {
  const { state, dispatch } = useCRM();
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [activeLead, setActiveLead] = React.useState<Lead | null>(null);

  const leadsByStatus = React.useMemo(() => {
    return STATUSES.reduce((acc, status) => {
      acc[status] = state.leads.filter(lead => lead.status === status);
      return acc;
    }, {} as Record<LeadStatus, Lead[]>);
  }, [state.leads]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    const lead = state.leads.find(l => l.id === active.id);
    setActiveLead(lead || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      setActiveLead(null);
      return;
    }

    const leadId = active.id as string;
    const newStatus = over.id as LeadStatus;

    if (STATUSES.includes(newStatus)) {
      dispatch({
        type: 'UPDATE_LEAD_STATUS',
        payload: { id: leadId, status: newStatus }
      });
    }

    setActiveId(null);
    setActiveLead(null);
  };

  const handleEditLead = (lead: Lead) => {
    // TODO: Implement edit modal
    console.log('Edit lead:', lead);
  };

  const handleDeleteLead = (leadId: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      dispatch({ type: 'DELETE_LEAD', payload: leadId });
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Lead Management - Kanban Board</h1>
        <p className="text-gray-600 mt-1">Drag and drop leads between status columns</p>
      </div>

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex space-x-6 overflow-x-auto pb-6">
          {STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              leads={leadsByStatus[status]}
              onEditLead={handleEditLead}
              onDeleteLead={handleDeleteLead}
            />
          ))}
        </div>

        <DragOverlay>
          {activeLead ? (
            <div className="transform rotate-3 opacity-90">
              <LeadCard
                lead={activeLead}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}