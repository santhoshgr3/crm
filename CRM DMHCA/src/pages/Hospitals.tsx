import React, { useState } from 'react';
import HospitalMap from '../components/Hospital/HospitalMap';

// Dummy data for hospitals and departments
const hospitals = [
  { id: 1, name: 'Apollo Hospital', city: 'Hyderabad', state: 'Telangana', lat: 17.385, lng: 78.4867, departments: ['Cardiology', 'Neurology', 'Orthopedics'] },
  { id: 2, name: 'AIIMS Delhi', city: 'New Delhi', state: 'Delhi', lat: 28.5672, lng: 77.2100, departments: ['General Surgery', 'Pediatrics', 'Oncology'] },
  { id: 3, name: 'CMC Vellore', city: 'Vellore', state: 'Tamil Nadu', lat: 12.9165, lng: 79.1325, departments: ['Dermatology', 'ENT', 'Nephrology'] },
  // ...add more hospitals as needed
];

const states = [...new Set(hospitals.map(h => h.state))];

export default function HospitalsPage() {
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('');

  const filteredHospitals = hospitals.filter(h =>
    (!stateFilter || h.state === stateFilter) &&
    (h.name.toLowerCase().includes(search.toLowerCase()) || h.city.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex h-full">
      {/* Left: Map */}
      <div className="w-1/2 h-full border-r">
        <HospitalMap hospitals={filteredHospitals} selectedHospital={selectedHospital} onSelectHospital={setSelectedHospital} />
        {/* Location from/to UI can be added here */}
        <div className="p-4">
          <label className="block font-semibold mb-1">Location From:</label>
          <input className="border p-1 mb-2 w-full" placeholder="Enter starting location..." />
          <label className="block font-semibold mb-1">Location To:</label>
          <input className="border p-1 w-full" value={selectedHospital ? selectedHospital.name : ''} readOnly />
        </div>
      </div>
      {/* Right: List/Search/Filter/Departments */}
      <div className="w-1/2 h-full p-6 overflow-y-auto">
        <div className="flex items-center mb-4 space-x-2">
          <input
            className="border p-2 flex-1"
            placeholder="Search hospitals..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="border p-2"
            value={stateFilter}
            onChange={e => setStateFilter(e.target.value)}
          >
            <option value="">All States</option>
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
        <ul>
          {filteredHospitals.map(h => (
            <li
              key={h.id}
              className={`p-3 border rounded mb-2 cursor-pointer ${selectedHospital && selectedHospital.id === h.id ? 'bg-blue-100' : ''}`}
              onClick={() => setSelectedHospital(h)}
            >
              <div className="font-bold">{h.name}</div>
              <div className="text-sm text-gray-600">{h.city}, {h.state}</div>
            </li>
          ))}
        </ul>
        {selectedHospital && (
          <div className="mt-6">
            <h2 className="font-bold text-lg mb-2">Departments in {selectedHospital.name}</h2>
            <ul className="list-disc ml-6">
              {selectedHospital.departments.map((d: string) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
