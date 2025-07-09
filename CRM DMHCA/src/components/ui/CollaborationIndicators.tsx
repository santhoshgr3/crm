import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Eye, Edit, MessageCircle } from 'lucide-react';

interface User {
  id: string;
  name: string;
  avatar?: string;
  color: string;
}

interface PresenceIndicator {
  userId: string;
  status: 'viewing' | 'editing' | 'typing';
  location?: string;
  lastSeen: Date;
}

interface CollaborationIndicatorsProps {
  users: User[];
  presence: PresenceIndicator[];
  currentUserId: string;
}

const CollaborationIndicators: React.FC<CollaborationIndicatorsProps> = ({
  users,
  presence,
  currentUserId
}) => {
  const [activeUsers, setActiveUsers] = useState<User[]>([]);

  useEffect(() => {
    const active = presence
      .filter(p => p.userId !== currentUserId)
      .map(p => users.find(u => u.id === p.userId))
      .filter(Boolean) as User[];
    
    setActiveUsers(active);
  }, [presence, users, currentUserId]);

  const getStatusIcon = (status: PresenceIndicator['status']) => {
    switch (status) {
      case 'viewing':
        return Eye;
      case 'editing':
        return Edit;
      case 'typing':
        return MessageCircle;
      default:
        return User;
    }
  };

  const getStatusColor = (status: PresenceIndicator['status']) => {
    switch (status) {
      case 'viewing':
        return 'text-blue-500';
      case 'editing':
        return 'text-green-500';
      case 'typing':
        return 'text-orange-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusText = (status: PresenceIndicator['status']) => {
    switch (status) {
      case 'viewing':
        return 'viewing';
      case 'editing':
        return 'editing';
      case 'typing':
        return 'typing';
      default:
        return 'online';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-40">
      <AnimatePresence>
        {activeUsers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 min-w-[200px]"
          >
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
              Active Users ({activeUsers.length})
            </h4>
            
            <div className="space-y-2">
              {activeUsers.map((user) => {
                const userPresence = presence.find(p => p.userId === user.id);
                const StatusIcon = getStatusIcon(userPresence?.status || 'viewing');
                
                return (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center space-x-3"
                  >
                    {/* Avatar */}
                    <div className="relative">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                        style={{ backgroundColor: user.color }}
                      >
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          user.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      
                      {/* Status indicator */}
                      <div className="absolute -bottom-1 -right-1">
                        <div className="w-4 h-4 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                          <StatusIcon 
                            className={`h-2.5 w-2.5 ${getStatusColor(userPresence?.status || 'viewing')}`} 
                          />
                        </div>
                      </div>
                    </div>

                    {/* User info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {user.name}
                      </p>
                      <p className={`text-xs ${getStatusColor(userPresence?.status || 'viewing')}`}>
                        {getStatusText(userPresence?.status || 'viewing')}
                        {userPresence?.location && ` in ${userPresence.location}`}
                      </p>
                    </div>

                    {/* Pulse animation for active status */}
                    {userPresence?.status === 'editing' && (
                      <motion.div
                        className="w-2 h-2 bg-green-500 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating avatars for quick view */}
      <div className="flex -space-x-2 mt-2">
        <AnimatePresence>
          {activeUsers.slice(0, 3).map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div
                className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-sm font-medium shadow-lg"
                style={{ backgroundColor: user.color }}
                title={user.name}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
              
              {/* Online indicator */}
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {activeUsers.length > 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-10 h-10 rounded-full bg-gray-500 border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-sm font-medium shadow-lg"
          >
            +{activeUsers.length - 3}
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Sample data for demonstration
const sampleUsers: User[] = [
  { id: '1', name: 'Dr. Priya Sharma', color: '#3B82F6' },
  { id: '2', name: 'Mr. Rajesh Kumar', color: '#10B981' },
  { id: '3', name: 'Ms. Sunita Reddy', color: '#F59E0B' },
  { id: '4', name: 'Dr. Amit Patel', color: '#8B5CF6' }
];

const samplePresence: PresenceIndicator[] = [
  { userId: '1', status: 'editing', location: 'Lead Details', lastSeen: new Date() },
  { userId: '2', status: 'viewing', location: 'Dashboard', lastSeen: new Date() },
  { userId: '3', status: 'typing', location: 'Chat', lastSeen: new Date() }
];

export { CollaborationIndicators, sampleUsers, samplePresence };
export type { User, PresenceIndicator };