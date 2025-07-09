import React from 'react';

export default function HospitalList({ hospitals, loading, onSelectHospital, selectedHospital }: any) {
  if (loading) return <div className="p-4">Loading hospitals...</div>;
  if (!hospitals.length) return <div className="p-4">No hospitals found.</div>;
  return (
    <div className="overflow-y-auto flex-1">
      {hospitals.map((h: any) => (
        <div
          key={h.id}
          className={`p-3 border-b cursor-pointer ${selectedHospital && selectedHospital.id === h.id ? 'bg-blue-50 font-bold' : 'hover:bg-gray-50'}`}
          onClick={() => onSelectHospital(h)}
        >
          <div className="text-base">{h.name}</div>
          <div className="text-xs text-gray-500">{h.city}, {h.state}</div>
        </div>
      ))}
    </div>
  );
}

