import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, UserPlus, FileText, Calendar, MessageCircle, X } from 'lucide-react';

interface FABAction {
  icon: React.ComponentType<any>;
  label: string;
  onClick: () => void;
  color: string;
}

const FloatingActionButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const actions: FABAction[] = [
    {
      icon: UserPlus,
      label: 'Add Lead',
      onClick: () => console.log('Add Lead'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      icon: FileText,
      label: 'Create Report',
      onClick: () => console.log('Create Report'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      icon: Calendar,
      label: 'Schedule Meeting',
      onClick: () => console.log('Schedule Meeting'),
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      icon: MessageCircle,
      label: 'Send Message',
      onClick: () => console.log('Send Message'),
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {actions.map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                onClick={action.onClick}
                className={`flex items-center space-x-3 px-4 py-3 rounded-full shadow-lg text-white ${action.color} transition-all duration-200 hover:scale-105`}
              >
                <action.icon className="h-5 w-5" />
                <span className="text-sm font-medium whitespace-nowrap">{action.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
        </motion.div>
      </motion.button>
    </div>
  );
};

export default FloatingActionButton;