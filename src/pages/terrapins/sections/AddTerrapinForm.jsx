import React, { useState } from 'react';
import { IoSearch } from "react-icons/io5";
import { SPECIES_LIST } from '../../../components/constants/SpeciesList';
import RecaptureForm from './RecaptureForm';
import { toast } from 'sonner';

const AddTerrapinForm = ({ onCancel, onSave }) => {
  const [captureType, setCaptureType] = useState('new');
  const [searchQuery, setSearchQuery] = useState('');
  const [foundTerrapin, setFoundTerrapin] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [formData, setFormData] = useState({
    species: '',
    gender: 'Unknown',
    yearHatched: '',
    microchipId: '',
    condition: '',
    dateOfFirstRelease: '',
    weight_kg: 0, 
    scl: 0,
    scw: 0,
    notes: '',
    ccl: 0,
    ccw: 0
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    setSearchError("");
    const query = searchQuery.toLowerCase().trim();
    const foundTerrapin = DUMMY_TERRAPINS.find(terrapin => 
      terrapin.id.toLowerCase() === query ||
      terrapin.microchipId.toLowerCase() === query
    );
    if (foundTerrapin) {
      setFoundTerrapin(foundTerrapin);
    } else {
      setSearchError("No terrapin found with the given Microchip ID or Tag. Please check your entry and try again.");
    }
  };

  if (foundTerrapin) {
    return (
      <div className="p-6">
        <RecaptureForm
          terrapin={foundTerrapin}
          onCancel={() => {
            setFoundTerrapin(null);
            setSearchQuery('');
          }}
          onSave={onSave}
        />
      </div>
    );
  }

  if (captureType === 'recapture') {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Add a new record</h2>
        
        {/* Capture Type */}
        <div className="flex gap-4 mb-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="captureType"
              checked={captureType === 'new'}
              onChange={() => setCaptureType('new')}
              className="w-4 h-4 text-[#4D6A4D] border-gray-300 focus:ring-[#4D6A4D]"
            />
            <span>New Capture</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="captureType"
              checked={captureType === 'recapture'}
              onChange={() => setCaptureType('recapture')}
              className="w-4 h-4 text-[#4D6A4D] border-gray-300 focus:ring-[#4D6A4D]"
            />
            <span>Recapture</span>
          </label>
        </div>

        {/* Search Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
             Microchip ID
          </label>
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter microchip ID"
                className="w-full border border-gray-200 rounded-md p-2 focus:outline-none focus:border-[#4D6A4D]"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-[#4D6A4D] text-white rounded-md text-sm hover:bg-[#3D5A3D] flex items-center gap-2"
            >
              <IoSearch className="w-4 h-4" />
              Search records
            </button>
          </div>
          {searchError && (
            <div className="mt-4 p-4 bg-[#F0F0E4] text-[#666639] rounded-lg text-center">
              <h3 className="text-lg font-semibold mb-1">No results found</h3>
              <p className="text-base">{searchError}</p>
            </div>
          )}
          <p className="mt-2 text-sm text-gray-500">
            Try searching with: TP003, 1165, 011-030-033, TP007, 1172, etc.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Add a new record</h2>
      
      {/* Capture Type */}
      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="captureType"
            checked={captureType === 'new'}
            onChange={() => setCaptureType('new')}
            className="w-4 h-4 text-[#4D6A4D] border-gray-300 focus:ring-[#4D6A4D]"
          />
          <span>New Capture</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="captureType"
            checked={captureType === 'recapture'}
            onChange={() => setCaptureType('recapture')}
            className="w-4 h-4 text-[#4D6A4D] border-gray-300 focus:ring-[#4D6A4D]"
          />
          <span>Recapture</span>
        </label>
      </div>

      {/* New Capture Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-3">
          {/* Species */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Species</label>
            <select
              value={formData.species}
              onChange={(e) => handleInputChange('species', e.target.value)}
              className="w-full border border-gray-200 rounded-md p-2 focus:outline-none focus:border-[#4D6A4D]"
            >
              <option value="">Select species</option>
              {SPECIES_LIST.map((species) => (
                <option key={species.id} value={species.id}>{species.name}</option>
              ))}
            </select>
          </div>

      
          {/* Year hatched */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year hatched</label>
            <select
              value={formData.yearHatched}
              onChange={(e) => handleInputChange('yearHatched', e.target.value)}
              className="w-full border border-gray-200 rounded-md p-2 focus:outline-none focus:border-[#4D6A4D]"
            >
              <option value="">Select year</option>
              {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Microchip ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Microchip ID</label>
            <input
              type="text"
              value={formData.microchipId}
              onChange={(e) => handleInputChange('microchipId', e.target.value)}
              placeholder="Format: 057-XXX-XXX or 011XXXXXX"
              className="w-full border border-gray-200 rounded-md p-2 focus:outline-none focus:border-[#4D6A4D]"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  checked={formData.gender === 'Male'}
                  onChange={() => handleInputChange('gender', 'Male')}
                  className="w-4 h-4 text-[#4D6A4D] border-gray-300 focus:ring-[#4D6A4D]"
                />
                <span>Male</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  checked={formData.gender === 'Female'}
                  onChange={() => handleInputChange('gender', 'Female')}
                  className="w-4 h-4 text-[#4D6A4D] border-gray-300 focus:ring-[#4D6A4D]"
                />
                <span>Female</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  checked={formData.gender === 'Unknown'}
                  onChange={() => handleInputChange('gender', 'Unknown')}
                  className="w-4 h-4 text-[#4D6A4D] border-gray-300 focus:ring-[#4D6A4D]"
                />
                <span>Unknown</span>
              </label>
            </div>
          </div>

          {/* Point of Release */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Point of Release</label>
            <input
              type="text"
              value={formData.condition}
              onChange={(e) => handleInputChange('condition', e.target.value)}
              placeholder="Enter point of release"
              className="w-full border border-gray-200 rounded-md p-2 focus:outline-none focus:border-[#4D6A4D]"
            />
          </div>

          {/* Date of first release */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of first release</label>
            <input
              type="date"
              value={formData.dateOfFirstRelease}
              onChange={(e) => handleInputChange('dateOfFirstRelease', e.target.value)}
              className="w-full border border-gray-200 rounded-md p-2 focus:outline-none focus:border-[#4D6A4D]"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Measurements */}
          <div className="grid grid-cols-3 gap-2">
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

          {/* Notes */}
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
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-200 rounded-md text-sm hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            // Validate year hatched
            if (formData.yearHatched) {
              const hatchedYear = parseInt(formData.yearHatched);
              const currentYear = new Date().getFullYear();
              
              if (hatchedYear > currentYear) {
                toast.error("Year hatched cannot be in the future.");
                return;
              }
              
              if (hatchedYear < 1900) {
                toast.error("Year hatched seems too far in the past.");
                return;
              }
            }
            
            // Validate date of release vs year hatched
            if (formData.dateOfFirstRelease && formData.yearHatched) {
              const hatchedYear = parseInt(formData.yearHatched);
              const releaseDate = new Date(formData.dateOfFirstRelease);
              const releaseYear = releaseDate.getFullYear();
              const currentDate = new Date();
              
              // Check if release date is in the future
              if (releaseDate > currentDate) {
                toast.error("Date of release cannot be in the future.");
                return;
              }
              
              if (hatchedYear > releaseYear) {
                toast.error("Date of release cannot be earlier than the year hatched.");
                return;
              }
              
              // Additional check: if same year, ensure release date is not before January 1st of hatched year
              if (hatchedYear === releaseYear) {
                const hatchedYearStart = new Date(hatchedYear, 0, 1); // January 1st of hatched year
                if (releaseDate < hatchedYearStart) {
                  toast.error("Date of release cannot be earlier than the year hatched.");
                  return;
                }
              }
            }
            onSave(formData);
          }}
          className="px-4 py-2 bg-[#4D6A4D] text-white rounded-md text-sm hover:bg-[#3D5A3D]"
        >
          Save Record
        </button>
      </div>
    </div>
  );
};

export default AddTerrapinForm;