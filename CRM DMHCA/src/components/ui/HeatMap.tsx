import React from 'react';
import { motion } from 'framer-motion';

interface HeatMapData {
  day: string;
  hour: number;
  value: number;
}

interface HeatMapProps {
  data: HeatMapData[];
  title: string;
}

const HeatMap: React.FC<HeatMapProps> = ({ data, title }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getIntensity = (day: string, hour: number) => {
    const item = data.find(d => d.day === day && d.hour === hour);
    return item ? item.value : 0;
  };

  const getColor = (intensity: number) => {
    const maxIntensity = Math.max(...data.map(d => d.value));
    const normalizedIntensity = intensity / maxIntensity;
    
    if (normalizedIntensity === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (normalizedIntensity < 0.25) return 'bg-blue-200 dark:bg-blue-900';
    if (normalizedIntensity < 0.5) return 'bg-blue-400 dark:bg-blue-700';
    if (normalizedIntensity < 0.75) return 'bg-blue-600 dark:bg-blue-500';
    return 'bg-blue-800 dark:bg-blue-300';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
        {title}
      </h3>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Hour labels */}
          <div className="flex mb-2">
            <div className="w-12" /> {/* Space for day labels */}
            {hours.map(hour => (
              <div
                key={hour}
                className="w-6 h-6 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400"
              >
                {hour % 4 === 0 ? hour : ''}
              </div>
            ))}
          </div>

          {/* Heat map grid */}
          {days.map((day, dayIndex) => (
            <div key={day} className="flex items-center mb-1">
              <div className="w-12 text-xs text-gray-500 dark:text-gray-400 text-right pr-2">
                {day}
              </div>
              {hours.map((hour, hourIndex) => {
                const intensity = getIntensity(day, hour);
                return (
                  <motion.div
                    key={`${day}-${hour}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      delay: (dayIndex * hours.length + hourIndex) * 0.01,
                      duration: 0.2 
                    }}
                    className={`w-6 h-6 m-0.5 rounded-sm cursor-pointer hover:scale-110 transition-transform ${getColor(intensity)}`}
                    title={`${day} ${hour}:00 - ${intensity} activities`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 text-xs text-gray-500 dark:text-gray-400">
        <span>Less</span>
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-gray-100 dark:bg-gray-800 rounded-sm" />
          <div className="w-3 h-3 bg-blue-200 dark:bg-blue-900 rounded-sm" />
          <div className="w-3 h-3 bg-blue-400 dark:bg-blue-700 rounded-sm" />
          <div className="w-3 h-3 bg-blue-600 dark:bg-blue-500 rounded-sm" />
          <div className="w-3 h-3 bg-blue-800 dark:bg-blue-300 rounded-sm" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

// Sample data generator
const generateSampleHeatMapData = (): HeatMapData[] => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const data: HeatMapData[] = [];

  days.forEach(day => {
    for (let hour = 0; hour < 24; hour++) {
      // Simulate higher activity during business hours
      let value = Math.random() * 10;
      if (hour >= 9 && hour <= 17 && !['Sat', 'Sun'].includes(day)) {
        value *= 3; // Higher activity during business hours
      }
      if (hour >= 22 || hour <= 6) {
        value *= 0.2; // Lower activity during night
      }
      
      data.push({
        day,
        hour,
        value: Math.round(value)
      });
    }
  });

  return data;
};

export { HeatMap, generateSampleHeatMapData };
export type { HeatMapData };