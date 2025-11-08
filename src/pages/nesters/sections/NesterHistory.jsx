// src/pages/nesters/sections/NesterHistory.jsx
import React from 'react';
import { IoChevronBack } from "react-icons/io5";

const NesterHistory = ({ nester, onBack }) => {
  // Dummy history data
  const history = [
    {
      id: 1,
      date: '2020-05-18',
      location: 'Pasir Pok Yok',
      weight: '23.2',
      dimensions: '45.9 × 38.2',
      eggCount: 25,
      notes: 'First capture. Healthy condition. Tagged with microchip 011062596.',
      type: 'First Capture',
      carapaceLength: '45.9',
      carapaceWidth: '38.2',
      ccl: '50.0',
      ccw: '40.0'
    },
    {
      id: 2,
      date: '2021-04-22',
      location: 'Pasir Pok Yok',
      weight: '24.1',
      dimensions: '46.2 × 38.5',
      eggCount: 27,
      notes: 'Returned to same nesting bank. Slight increase in weight and size.',
      type: 'Recapture #1',
      carapaceLength: '46.2',
      carapaceWidth: '38.5',
      ccl: '50.5',
      ccw: '40.5'
    },
    {
      id: 3,
      date: '2021-06-15',
      location: 'Pasir Lembu',
      weight: '23.8',
      dimensions: '46.2 × 38.5',
      eggCount: 24,
      notes: 'Second nesting of the season. Different nesting bank.',
      type: 'Recapture #2',
      carapaceLength: '46.2',
      carapaceWidth: '38.5',
      ccl: '50.5',
      ccw: '40.5'
    },
    {
      id: 4,
      date: '2022-05-03',
      location: 'Pasir Pok Yok',
      weight: '24.5',
      dimensions: '46.8 × 39',
      eggCount: 28,
      notes: 'Returned to original nesting bank. Continued growth observed.',
      type: 'Recapture #3',
      carapaceLength: '46.8',
      carapaceWidth: '39',
      ccl: '51.0',
      ccw: '41.0'
    },
    {
      id: 5,
      date: '2023-05-12',
      location: 'Pasir Pok Yok',
      weight: '25.1',
      dimensions: '47.2 × 39.3',
      eggCount: 28,
      notes: 'Consistent nesting pattern. Healthy condition maintained.',
      type: 'Recapture #4',
      carapaceLength: '47.2',
      carapaceWidth: '39.3',
      ccl: '51.5',
      ccw: '41.5'
    }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-[#4D6A4D]">History</h2>
        <div className="flex gap-2">
          <button
            onClick={onBack}
            className="px-4 py-2 border border-[#E5E5E5] rounded-md text-white hover:bg-[#F5F5F0] hover:text-[#4D6A4D]"
          >
            Back to table
          </button>
          <button
            className="px-4 py-2 bg-[#4D6A4D] text-white rounded-md hover:bg-[#3D5A3D]"
          >
            Add New
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-6">
        {history.map((record, index) => (
          <div key={record.id} className="relative pl-8">
            {/* Timeline dot and line */}
            <div className="absolute left-0 top-0 flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                index === 0 ? 'border-[#4D6A4D] bg-white' : 'border-[#E5E5E5] bg-[#F5F5F0]'
              }`}>
                <span className="text-sm">{record.id}</span>
              </div>
              {index < history.length - 1 && (
                <div className="w-0.5 h-full bg-[#E5E5E5]" />
              )}
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg border border-[#E5E5E5] p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-[#666639]">{record.date}</span>
                    <span className="px-2 py-0.5 bg-[#F5F5F0] text-[#666639] text-xs rounded-full">
                      {record.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#666639]">
                    <span>📍 {record.location}</span>
                  </div>
                </div>
                <div className="flex gap-4 text-sm text-[#666639]">
                  <div>
                    <span className="opacity-70">Weight</span>
                    <p>{record.weight} kg</p>
                  </div>
                  <div>
                    <span className="opacity-70">Dimensions</span>
                    <p>{record.dimensions} cm</p>
                  </div>
                  <div>
                    <span className="opacity-70">Eggs</span>
                    <p>{record.eggCount}</p>
                  </div>
                  <div>
                    <span className="opacity-70">CCL</span>
                    <p>{record.ccl} cm</p>
                  </div>
                  <div>
                    <span className="opacity-70">CCW</span>
                    <p>{record.ccw} cm</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-[#666639]">{record.notes}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NesterHistory;