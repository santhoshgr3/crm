import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, FileText, Calendar, Building, Filter } from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'lead' | 'course' | 'hospital' | 'event';
  title: string;
  subtitle: string;
  metadata?: string;
  icon: React.ComponentType<any>;
}

interface GlobalSearchProps {
  onResultSelect: (result: SearchResult) => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ onResultSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filters, setFilters] = useState<string[]>([]);

  // Mock search function with AI-powered suggestions
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const mockResults: SearchResult[] = [
      {
        id: '1',
        type: 'lead',
        title: 'Dr. Sarah Johnson',
        subtitle: 'Emergency Medicine Fellowship',
        metadata: 'Hot Lead • $45,000',
        icon: User
      },
      {
        id: '2',
        type: 'course',
        title: 'Fellowship in Emergency Medicine',
        subtitle: '2 Years • MBBS Required',
        metadata: '$450,000',
        icon: FileText
      },
      {
        id: '3',
        type: 'hospital',
        title: 'Apollo Hospital Mumbai',
        subtitle: 'Teaching Hospital',
        metadata: 'Emergency Medicine Department',
        icon: Building
      },
      {
        id: '4',
        type: 'event',
        title: 'Follow-up Call with Dr. Johnson',
        subtitle: 'Scheduled for tomorrow',
        metadata: '10:00 AM',
        icon: Calendar
      }
    ].filter(result => 
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setResults(mockResults);
    setSelectedIndex(0);
    setIsLoading(false);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      onResultSelect(results[selectedIndex]);
      setQuery('');
      setResults([]);
    }
  };

  const getTypeColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'lead':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'course':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'hospital':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'event':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const filterTypes = ['lead', 'course', 'hospital', 'event'];

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search leads, courses, hospitals..."
          className="w-full pl-10 pr-12 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 placeholder-gray-500"
        />
        
        {/* Filter Button */}
        <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <Filter className="h-5 w-5" />
        </button>
      </div>

      {/* Search Results */}
      <AnimatePresence>
        {(results.length > 0 || isLoading) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto"
          >
            {isLoading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Searching...</p>
              </div>
            ) : (
              <div className="py-2">
                {results.map((result, index) => (
                  <motion.button
                    key={result.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      onResultSelect(result);
                      setQuery('');
                      setResults([]);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      index === selectedIndex ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <result.icon className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {result.title}
                          </p>
                          <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(result.type)}`}>
                            {result.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {result.subtitle}
                        </p>
                        {result.metadata && (
                          <p className="text-xs text-gray-400 mt-1">
                            {result.metadata}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlobalSearch;