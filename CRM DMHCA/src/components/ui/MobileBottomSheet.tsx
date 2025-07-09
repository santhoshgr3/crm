import React, { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useGesture } from '@use-gesture/react';
import { X, Minus } from 'lucide-react';

interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  snapPoints?: number[];
}

const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  snapPoints = [0.3, 0.6, 0.9]
}) => {
  const [currentSnap, setCurrentSnap] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  const bind = useGesture({
    onDrag: ({ movement: [, my], velocity: [, vy], direction: [, dy], cancel }) => {
      setIsDragging(true);
      
      // Close if dragged down significantly
      if (my > 100 && dy > 0) {
        cancel();
        onClose();
        return;
      }

      // Snap to different heights based on drag position
      const windowHeight = window.innerHeight;
      const dragPercent = Math.abs(my) / windowHeight;
      
      if (dragPercent > 0.2) {
        if (dy > 0 && currentSnap > 0) {
          setCurrentSnap(currentSnap - 1);
        } else if (dy < 0 && currentSnap < snapPoints.length - 1) {
          setCurrentSnap(currentSnap + 1);
        }
      }
    },
    onDragEnd: () => {
      setIsDragging(false);
    }
  });

  const sheetHeight = `${snapPoints[currentSnap] * 100}vh`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            {...bind()}
            initial={{ y: '100%' }}
            animate={{ 
              y: 0,
              height: sheetHeight
            }}
            exit={{ y: '100%' }}
            transition={{ 
              type: 'spring', 
              damping: 30, 
              stiffness: 300,
              duration: isDragging ? 0 : undefined
            }}
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl z-50 md:hidden overflow-hidden"
            style={{ touchAction: 'none' }}
          >
            {/* Handle */}
            <div className="flex justify-center py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {children}
            </div>

            {/* Snap Indicators */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 space-y-2">
              {snapPoints.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSnap(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSnap 
                      ? 'bg-blue-500' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileBottomSheet;