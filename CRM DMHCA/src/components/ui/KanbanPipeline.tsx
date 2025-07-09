import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, MoreHorizontal, User, Calendar, DollarSign } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  value: number;
  avatar?: string;
  lastContact: string;
  tags: string[];
}

interface Column {
  id: string;
  title: string;
  color: string;
  leads: Lead[];
  limit?: number;
}

const SortableCard: React.FC<{ lead: Lead }> = ({ lead }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
              {lead.name}
            </h4>
            <p className="text-xs text-gray-500">{lead.email}</p>
          </div>
        </div>
        <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Value</span>
          <span className="font-medium text-green-600 dark:text-green-400">
            ${lead.value.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Last Contact</span>
          <span className="text-gray-900 dark:text-gray-100">{lead.lastContact}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {lead.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

const KanbanColumn: React.FC<{ column: Column; onAddLead: (columnId: string) => void }> = ({
  column,
  onAddLead
}) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 min-h-[600px] w-80 flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${column.color}`} />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            {column.title}
          </h3>
          <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded-full">
            {column.leads.length}
          </span>
        </div>
        <button
          onClick={() => onAddLead(column.id)}
          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <SortableContext items={column.leads.map(lead => lead.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          <AnimatePresence>
            {column.leads.map((lead) => (
              <SortableCard key={lead.id} lead={lead} />
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>

      {column.limit && column.leads.length >= column.limit && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Column limit reached ({column.limit})
          </p>
        </div>
      )}
    </div>
  );
};

const KanbanPipeline: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [columns, setColumns] = useState<Column[]>([
    {
      id: 'prospects',
      title: 'Prospects',
      color: 'bg-blue-500',
      leads: [
        {
          id: '1',
          name: 'Dr. Sarah Johnson',
          email: 'sarah@hospital.com',
          value: 45000,
          lastContact: '2 days ago',
          tags: ['Emergency Medicine', 'Hot']
        },
        {
          id: '2',
          name: 'Dr. Michael Chen',
          email: 'mchen@clinic.com',
          value: 32000,
          lastContact: '1 week ago',
          tags: ['Cardiology', 'Warm']
        }
      ]
    },
    {
      id: 'qualified',
      title: 'Qualified',
      color: 'bg-yellow-500',
      leads: [
        {
          id: '3',
          name: 'Dr. Emily Rodriguez',
          email: 'emily@medcenter.com',
          value: 58000,
          lastContact: '3 days ago',
          tags: ['Surgery', 'Hot']
        }
      ]
    },
    {
      id: 'proposal',
      title: 'Proposal Sent',
      color: 'bg-purple-500',
      leads: [
        {
          id: '4',
          name: 'Dr. James Wilson',
          email: 'jwilson@hospital.org',
          value: 67000,
          lastContact: '1 day ago',
          tags: ['Fellowship', 'Decision Pending']
        }
      ]
    },
    {
      id: 'negotiation',
      title: 'Negotiation',
      color: 'bg-orange-500',
      leads: []
    },
    {
      id: 'closed',
      title: 'Closed Won',
      color: 'bg-green-500',
      leads: [
        {
          id: '5',
          name: 'Dr. Lisa Park',
          email: 'lpark@medical.edu',
          value: 75000,
          lastContact: 'Today',
          tags: ['Critical Care', 'Enrolled']
        }
      ]
    }
  ]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find source and destination columns
    const sourceColumn = columns.find(col => 
      col.leads.some(lead => lead.id === activeId)
    );
    const destColumn = columns.find(col => col.id === overId) || 
                      columns.find(col => col.leads.some(lead => lead.id === overId));

    if (!sourceColumn || !destColumn) {
      setActiveId(null);
      return;
    }

    if (sourceColumn.id !== destColumn.id) {
      const lead = sourceColumn.leads.find(l => l.id === activeId);
      if (lead) {
        setColumns(prev => prev.map(col => {
          if (col.id === sourceColumn.id) {
            return {
              ...col,
              leads: col.leads.filter(l => l.id !== activeId)
            };
          }
          if (col.id === destColumn.id) {
            return {
              ...col,
              leads: [...col.leads, lead]
            };
          }
          return col;
        }));
      }
    }

    setActiveId(null);
  };

  const handleAddLead = (columnId: string) => {
    console.log('Add lead to column:', columnId);
  };

  const activeLead = activeId ? 
    columns.flatMap(col => col.leads).find(lead => lead.id === activeId) : null;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Sales Pipeline
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Drag and drop leads between stages to update their status
        </p>
      </div>

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex space-x-6 overflow-x-auto pb-6">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              onAddLead={handleAddLead}
            />
          ))}
        </div>

        <DragOverlay>
          {activeLead ? (
            <div className="transform rotate-3 opacity-90">
              <SortableCard lead={activeLead} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanbanPipeline;