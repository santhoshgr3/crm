import React from 'react';
import { motion } from 'framer-motion';
import { GripVertical, MoreHorizontal, TrendingUp, TrendingDown } from 'lucide-react';

interface DashboardWidgetProps {
  id: string;
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  icon?: React.ComponentType<any>;
  color?: string;
  children?: React.ReactNode;
  isDragging?: boolean;
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  id,
  title,
  value,
  change,
  icon: Icon,
  color = 'blue',
  children,
  isDragging = false
}) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600'
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        scale: isDragging ? 1.05 : 1,
        rotateZ: isDragging ? 5 : 0
      }}
      transition={{ duration: 0.2 }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 relative overflow-hidden ${
        isDragging ? 'shadow-2xl z-50' : ''
      }`}
    >
      {/* Drag Handle */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <GripVertical className="h-4 w-4" />
        </button>
      </div>

      {/* Background Gradient */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} opacity-10 rounded-full transform translate-x-16 -translate-y-16`} />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {Icon && (
            <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} text-white`}>
              <Icon className="h-5 w-5" />
            </div>
          )}
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </h3>
        </div>
        <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Value */}
      <div className="mb-4">
        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {value}
        </div>
        {change && (
          <div className="flex items-center mt-2">
            {change.type === 'increase' ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${
              change.type === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {change.value}%
            </span>
            <span className="text-sm text-gray-500 ml-1">
              vs {change.period}
            </span>
          </div>
        )}
      </div>

      {/* Custom Content */}
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </motion.div>
  );
};

export default DashboardWidget;