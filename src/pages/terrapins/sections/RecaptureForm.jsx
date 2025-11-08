import React, { useState } from 'react';
import { IoCheckmarkCircle } from "react-icons/io5";

const RecaptureForm = ({ terrapin, onCancel, onSave }) => {
  const [formData, setFormData] = useState({
    turtle_id: terrapin.id,
    microchip_id: terrapin.microchipId,
    recapture_date: '',
    capture_method: '',
    notes: '',
    weight_kg: '',
    scl: '',
    scw: '',
    ccl: '',
    ccw: '',
    latitude: '',
    longitude: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-4">
      {/* Success Message */}
      <div className="bg-green-50 rounded-lg p-4 flex items-start gap-3">
        <IoCheckmarkCircle className="text-green-600 w-5 h-5 mt-0.5" />
        <div>
          <h3 className="text-green-800 font-medium">Terrapin Found</h3>
          <p className="text-green-700 text-sm">
            Terrapin with ID {terrapin.id} has been found. Please enter the recapture details below.
          </p>
        </div>
      </div>

      {/* Terrapin Details */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500">ID</label>
            <p className="font-medium">{terrapin.id}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Species</label>
            <p className="font-medium">{terrapin.species}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Year Hatched</label>
            <p className="font-medium">{terrapin.yearHatched}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Microchip ID</label>
            <p className="font-medium">{terrapin.microchipId}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Gender</label>
            <p className="font-medium">{terrapin.gender}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Last Capture Date</label>
            <p className="font-medium">{terrapin.lastCaptureDate}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Last Measurements</label>
            <p className="font-medium">{`${terrapin.lastWeight}g, ${terrapin.lastCarapaceLength} × ${terrapin.lastCarapaceWidth} cm`}</p>
          </div>
        </div>
      </div>

      {/* Recapture Form */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recapture Date</label>
            <input
              type="date"
              value={formData.recapture_date}
              onChange={(e) => handleInputChange('recapture_date', e.target.value)}
              className="w-full border border-gray-200 rounded-md p-2 focus:outline-none focus:border-[#4D6A4D]"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Capture Method</label>
            <input
              type="text"
              value={formData.capture_method}
              onChange={(e) => handleInputChange('capture_method', e.target.value)}
              placeholder="Enter capture method"
              className="w-full border border-gray-200 rounded-md p-2 focus:outline-none focus:border-[#4D6A4D]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
            <input
              type="number"
              value={formData.latitude}
              onChange={(e) => handleInputChange('latitude', e.target.value)}
              placeholder="Enter latitude"
              step="0.000001"
              className="w-full border border-gray-200 rounded-md p-2 focus:outline-none focus:border-[#4D6A4D]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
            <input
              type="number"
              value={formData.longitude}
              onChange={(e) => handleInputChange('longitude', e.target.value)}
              placeholder="Enter longitude"
              step="0.000001"
              className="w-full border border-gray-200 rounded-md p-2 focus:outline-none focus:border-[#4D6A4D]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
            <input
              type="number"
              value={formData.weight_kg}
              onChange={(e) => handleInputChange('weight_kg', e.target.value)}
              min="0"
              step="0.01"
              className="w-full border border-gray-200 rounded-md p-2 focus:outline-none focus:border-[#4D6A4D]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SCL (cm)</label>
            <input
              type="number"
              value={formData.scl}
              onChange={(e) => handleInputChange('scl', e.target.value)}
              min="0"
              step="0.1"
              className="w-full border border-gray-200 rounded-md p-2 focus:outline-none focus:border-[#4D6A4D]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SCW (cm)</label>
            <input
              type="number"
              value={formData.scw}
              onChange={(e) => handleInputChange('scw', e.target.value)}
              min="0"
              step="0.1"
              className="w-full border border-gray-200 rounded-md p-2 focus:outline-none focus:border-[#4D6A4D]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CCL (cm)</label>
            <input
              type="number"
              value={formData.ccl}
              onChange={(e) => handleInputChange('ccl', e.target.value)}
              min="0"
              step="0.1"
              className="w-full border border-gray-200 rounded-md p-2 focus:outline-none focus:border-[#4D6A4D]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CCW (cm)</label>
            <input
              type="number"
              value={formData.ccw}
              onChange={(e) => handleInputChange('ccw', e.target.value)}
              min="0"
              step="0.1"
              className="w-full border border-gray-200 rounded-md p-2 focus:outline-none focus:border-[#4D6A4D]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Enter observations, health status, or other notes"
            rows={4}
            className="w-full border border-gray-200 rounded-md p-2 focus:outline-none focus:border-[#4D6A4D]"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-200 rounded-md text-sm hover:bg-gray-50 hover:text-[#4D6A4D]"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(formData)}
          className="px-4 py-2 bg-[#4D6A4D] text-white rounded-md text-sm hover:bg-[#3D5A3D]"
        >
          Save Recapture
        </button>
      </div>
    </div>
  );
};

export default RecaptureForm;