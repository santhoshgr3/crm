import React, { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';

interface Column {
  key: string;
  title: string;
  width: number;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface VirtualizedTableProps {
  data: any[];
  columns: Column[];
  height: number;
  onRowClick?: (row: any) => void;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: string) => void;
}

const VirtualizedTable: React.FC<VirtualizedTableProps> = ({
  data,
  columns,
  height,
  onRowClick,
  sortBy,
  sortDirection,
  onSort
}) => {
  const totalWidth = useMemo(() => 
    columns.reduce((sum, col) => sum + col.width, 0), 
    [columns]
  );

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const row = data[index];
    const isEven = index % 2 === 0;

    return (
      <motion.div
        style={style}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.01 }}
        className={`flex items-center border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
          isEven ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'
        }`}
        onClick={() => onRowClick?.(row)}
      >
        {columns.map((column) => (
          <div
            key={column.key}
            className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 truncate"
            style={{ width: column.width }}
          >
            {column.render ? column.render(row[column.key], row) : row[column.key]}
          </div>
        ))}
      </motion.div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        {columns.map((column) => (
          <div
            key={column.key}
            className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            style={{ width: column.width }}
            onClick={() => column.sortable && onSort?.(column.key)}
          >
            <div className="flex items-center space-x-1">
              <span>{column.title}</span>
              {column.sortable && sortBy === column.key && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {sortDirection === 'asc' ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </motion.div>
              )}
              {column.sortable && sortBy !== column.key && (
                <Filter className="h-3 w-3 opacity-50" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Virtual List */}
      <List
        height={height}
        itemCount={data.length}
        itemSize={60}
        width={totalWidth}
      >
        {Row}
      </List>
    </div>
  );
};

export default VirtualizedTable;