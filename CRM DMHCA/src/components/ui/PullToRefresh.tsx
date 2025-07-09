import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  threshold = 80
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, threshold], [0, 1]);
  const scale = useTransform(y, [0, threshold], [0.8, 1]);
  const rotate = useTransform(y, [0, threshold * 2], [0, 360]);

  const handlePanStart = () => {
    if (containerRef.current?.scrollTop === 0) {
      setIsPulling(true);
    }
  };

  const handlePan = (event: any, info: PanInfo) => {
    if (!isPulling || info.delta.y < 0) return;
    
    const newY = Math.max(0, Math.min(info.point.y, threshold * 1.5));
    y.set(newY);
  };

  const handlePanEnd = async () => {
    if (!isPulling) return;
    
    setIsPulling(false);
    
    if (y.get() >= threshold) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    
    y.set(0);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Pull to Refresh Indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex items-center justify-center py-4 bg-blue-50 dark:bg-blue-900/20 z-10"
        style={{
          opacity,
          y: useTransform(y, [0, threshold], [-60, 0])
        }}
      >
        <motion.div
          className="flex items-center space-x-2 text-blue-600 dark:text-blue-400"
          style={{ scale }}
        >
          <motion.div style={{ rotate }}>
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </motion.div>
          <span className="text-sm font-medium">
            {isRefreshing ? 'Refreshing...' : 'Pull to refresh'}
          </span>
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div
        ref={containerRef}
        className="h-full overflow-y-auto"
        style={{ y }}
        onPanStart={handlePanStart}
        onPan={handlePan}
        onPanEnd={handlePanEnd}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default PullToRefresh;