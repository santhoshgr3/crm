import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Users,
  BarChart3,
  Settings,
  Calendar,
  MessageCircle,
  FileText,
  Building,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href: string;
  badge?: number;
  preview?: string;
}

const SmartSidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      href: '/',
      preview: 'View overview and key metrics'
    },
    {
      id: 'leads',
      label: 'Leads',
      icon: Users,
      href: '/leads',
      badge: 12,
      preview: 'Manage customer leads and prospects'
    },
    {
      id: 'kanban',
      label: 'Pipeline',
      icon: BarChart3,
      href: '/kanban',
      preview: 'Visual pipeline management'
    },
    {
      id: 'courses',
      label: 'Courses',
      icon: FileText,
      href: '/courses',
      preview: 'Medical education programs'
    },
    {
      id: 'hospitals',
      label: 'Hospitals',
      icon: Building,
      href: '/hospitals',
      preview: 'Hospital network and locations'
    },
    {
      id: 'followups',
      label: 'Follow-ups',
      icon: Calendar,
      href: '/followups',
      badge: 5,
      preview: 'Scheduled follow-up activities'
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: MessageCircle,
      href: '/whatsapp',
      preview: 'WhatsApp integration and messaging'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      href: '/analytics',
      preview: 'Performance insights and reports'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      href: '/settings',
      preview: 'System configuration and preferences'
    }
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <motion.div
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-full flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">D</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    DMHCA CRM
                  </h1>
                  <p className="text-xs text-gray-500">Medical Education</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <div
            key={item.id}
            className="relative"
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Link
              to={item.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive(item.href)
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="flex items-center justify-between flex-1 overflow-hidden"
                  >
                    <span className="font-medium truncate">{item.label}</span>
                    {item.badge && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 ml-2"
                      >
                        {item.badge}
                      </motion.span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>

            {/* Hover Preview */}
            <AnimatePresence>
              {isCollapsed && hoveredItem === item.id && item.preview && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="absolute left-full top-0 ml-2 z-50"
                >
                  <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-gray-300 text-xs mt-1">{item.preview}</div>
                    {item.badge && (
                      <div className="text-red-400 text-xs mt-1">
                        {item.badge} pending
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center space-x-3 px-3 py-2"
            >
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-medium text-sm">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  Admin User
                </p>
                <p className="text-xs text-gray-500 truncate">admin@dmhca.edu</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SmartSidebar;