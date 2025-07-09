import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import SmartSidebar from '../ui/SmartSidebar';
import ModernHeader from './ModernHeader';
import FloatingActionButton from '../ui/FloatingActionButton';
import CommandPalette from '../ui/CommandPalette';

interface ModernLayoutProps {
  onLogout: () => void;
}

const ModernLayout: React.FC<ModernLayoutProps> = ({ onLogout }) => {
  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden">
      {/* Sidebar */}
      <SmartSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <ModernHeader onLogout={onLogout} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton />
      
      {/* Command Palette */}
      <CommandPalette />
    </div>
  );
};

export default ModernLayout;