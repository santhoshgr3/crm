import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HospitalDetails({ hospital }: any) {
  const [toLocation, setToLocation] = useState('');
  const [distance, setDistance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDepartments, setShowDepartments] = useState(false);

  const handleDistanceSearch = async () => {
    setError(null);
    setDistance(null);
    try {
      const res = await fetch(`/api/hospitals/${hospital.id}/distance?to=${toLocation}`);
      if (!res.ok) throw new Error('Failed to fetch distance');
      const data = await res.json();
      setDistance(data.distance_km);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <motion.div
      className="p-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-2 font-bold text-lg flex items-center gap-2">
        <span>{hospital.name}</span>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="ml-auto px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
          onClick={() => setShowDepartments((v) => !v)}
        >
          {showDepartments ? 'Hide Departments' : 'Show Departments'}
        </motion.button>
      </div>
      <div className="mb-2 text-sm text-gray-600 animate-fadeIn">
        {hospital.address}, {hospital.city}, {hospital.state}
      </div>
      <AnimatePresence>
        {showDepartments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-2 overflow-hidden"
          >
            <span className="font-semibold">Departments:</span>
            <ul className="list-disc ml-5 mt-1">
              {(hospital.departments || []).map((d: string, i: number) => (
                <motion.li key={i} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}>{d}</motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div className="mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <div className="font-semibold mb-1">Search Distance from this Hospital</div>
        <div className="flex items-center gap-2">
          <input
            className="border rounded px-2 py-1 flex-1 focus:ring-2 focus:ring-blue-200 transition"
            placeholder="lat,lng (e.g. 19.0760,72.8777)"
            value={toLocation}
            onChange={e => setToLocation(e.target.value)}
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="bg-blue-500 text-white px-3 py-1 rounded shadow hover:bg-blue-600 transition"
            onClick={handleDistanceSearch}
            disabled={!toLocation}
          >
            Search
          </motion.button>
        </div>
        <AnimatePresence>
          {distance !== null && (
            <motion.div
              className="mt-2 text-green-700"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              Distance: {distance.toFixed(2)} km
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {error && (
            <motion.div
              className="mt-2 text-red-600"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
