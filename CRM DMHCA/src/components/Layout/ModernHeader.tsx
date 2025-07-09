import React from 'react';
import { motion } from 'framer-motion';
import GlobalSearch from '../ui/GlobalSearch';
import NotificationCenter from '../ui/NotificationCenter';
import ThemeToggle from '../ui/ThemeToggle';
import { User, ChevronDown } from 'lucide-react';

interface ModernHeaderProps {
  onLogout: () => void;
}

const ModernHeader: React.FC<ModernHeaderProps> = ({ onLogout }) => {
  const handleSearchResult = (result: any) => {
    console.log('Selected search result:', result);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-2xl">
          <GlobalSearch onResultSelect={handleSearchResult} />
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Notifications */}
          <NotificationCenter />
          
          {/* User Menu */}
          <div className="relative">
            <button className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Admin User
                </p>
                <p className="text-xs text-gray-500">Senior Manager</p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default ModernHeader;