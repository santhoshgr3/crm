import React from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  Calendar, 
  FileText, 
  DollarSign, 
  MessageCircle,
  User,
  CheckCircle
} from 'lucide-react';

interface TimelineEvent {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'payment' | 'message' | 'status_change';
  title: string;
  description: string;
  timestamp: Date;
  user: string;
  metadata?: Record<string, any>;
}

interface CustomerTimelineProps {
  customerId: string;
  events: TimelineEvent[];
}

const CustomerTimeline: React.FC<CustomerTimelineProps> = ({ customerId, events }) => {
  const getIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'call':
        return Phone;
      case 'email':
        return Mail;
      case 'meeting':
        return Calendar;
      case 'note':
        return FileText;
      case 'payment':
        return DollarSign;
      case 'message':
        return MessageCircle;
      case 'status_change':
        return CheckCircle;
      default:
        return User;
    }
  };

  const getColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'call':
        return 'bg-blue-500';
      case 'email':
        return 'bg-purple-500';
      case 'meeting':
        return 'bg-green-500';
      case 'note':
        return 'bg-gray-500';
      case 'payment':
        return 'bg-yellow-500';
      case 'message':
        return 'bg-indigo-500';
      case 'status_change':
        return 'bg-emerald-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Customer Timeline
      </h3>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

        <div className="space-y-6">
          {events.map((event, index) => {
            const Icon = getIcon(event.type);
            const colorClass = getColor(event.type);

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-start space-x-4"
              >
                {/* Icon */}
                <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${colorClass} text-white shadow-lg`}>
                  <Icon className="h-5 w-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {event.title}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {formatTime(event.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {event.description}
                  </p>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">by {event.user}</span>
                    {event.metadata && (
                      <div className="flex space-x-2">
                        {Object.entries(event.metadata).map(([key, value]) => (
                          <span
                            key={key}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                          >
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {events.length === 0 && (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No timeline events yet</p>
        </div>
      )}
    </div>
  );
};

// Sample data for demonstration
const sampleEvents: TimelineEvent[] = [
  {
    id: '1',
    type: 'status_change',
    title: 'Status Updated',
    description: 'Lead status changed from "Warm" to "Hot"',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    user: 'Dr. Priya Sharma',
    metadata: { from: 'Warm', to: 'Hot' }
  },
  {
    id: '2',
    type: 'call',
    title: 'Phone Call',
    description: 'Discussed fellowship requirements and answered questions about curriculum',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    user: 'Dr. Priya Sharma',
    metadata: { duration: '25 min' }
  },
  {
    id: '3',
    type: 'email',
    title: 'Email Sent',
    description: 'Sent detailed course brochure and fee structure',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    user: 'Dr. Priya Sharma'
  },
  {
    id: '4',
    type: 'meeting',
    title: 'Initial Consultation',
    description: 'First meeting to understand career goals and course interests',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    user: 'Dr. Priya Sharma',
    metadata: { location: 'Video Call' }
  }
];

export { CustomerTimeline, sampleEvents };
export type { TimelineEvent };