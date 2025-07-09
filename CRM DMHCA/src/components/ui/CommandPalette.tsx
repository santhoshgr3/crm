import React, { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import { useHotkeys } from 'react-hotkeys-hook';
import { 
  Search, 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  Calendar,
  MessageCircle,
  Home,
  Plus
} from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ComponentType<any>;
  action: () => void;
  category: string;
}

const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  useHotkeys('cmd+k, ctrl+k', (e) => {
    e.preventDefault();
    setOpen(true);
  });

  useHotkeys('escape', () => setOpen(false));

  const commands: CommandItem[] = [
    {
      id: 'dashboard',
      title: 'Go to Dashboard',
      subtitle: 'View overview and metrics',
      icon: Home,
      action: () => console.log('Navigate to dashboard'),
      category: 'Navigation'
    },
    {
      id: 'leads',
      title: 'View Leads',
      subtitle: 'Manage customer leads',
      icon: Users,
      action: () => console.log('Navigate to leads'),
      category: 'Navigation'
    },
    {
      id: 'add-lead',
      title: 'Add New Lead',
      subtitle: 'Create a new customer lead',
      icon: Plus,
      action: () => console.log('Add new lead'),
      category: 'Actions'
    },
    {
      id: 'reports',
      title: 'Generate Report',
      subtitle: 'Create custom reports',
      icon: FileText,
      action: () => console.log('Generate report'),
      category: 'Actions'
    },
    {
      id: 'analytics',
      title: 'View Analytics',
      subtitle: 'Performance insights',
      icon: BarChart3,
      action: () => console.log('Navigate to analytics'),
      category: 'Navigation'
    },
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'Configure your account',
      icon: Settings,
      action: () => console.log('Navigate to settings'),
      category: 'Navigation'
    }
  ];

  const filteredCommands = commands.filter(command =>
    command.title.toLowerCase().includes(search.toLowerCase()) ||
    command.subtitle?.toLowerCase().includes(search.toLowerCase())
  );

  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = [];
    }
    acc[command.category].push(command);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Command className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <Search className="h-5 w-5 text-gray-400 mr-3" />
                <Command.Input
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500"
                />
                <kbd className="hidden sm:inline-block px-2 py-1 text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 rounded">
                  ESC
                </kbd>
              </div>

              <Command.List className="max-h-96 overflow-y-auto p-2">
                <Command.Empty className="py-6 text-center text-gray-500">
                  No results found.
                </Command.Empty>

                {Object.entries(groupedCommands).map(([category, items]) => (
                  <Command.Group key={category} heading={category} className="mb-2">
                    {items.map((command) => (
                      <Command.Item
                        key={command.id}
                        onSelect={() => {
                          command.action();
                          setOpen(false);
                        }}
                        className="flex items-center px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <command.icon className="h-5 w-5 text-gray-500 mr-3" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {command.title}
                          </div>
                          {command.subtitle && (
                            <div className="text-xs text-gray-500">
                              {command.subtitle}
                            </div>
                          )}
                        </div>
                      </Command.Item>
                    ))}
                  </Command.Group>
                ))}
              </Command.List>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;