import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createCapture } from '../redux/thunks/captures.thunk';
import { toast } from 'sonner';
import { fetchTurtleSpecies } from '../redux/thunks/species.thunk';
import { fetchHeatmapData } from '../redux/thunks/map.thunk';
import { fetchStatsSummary, fetchSpeciesDistribution, fetchConservationProgress, fetchNestingEventsVsBank, fetchCapturesSummary } from '../redux/thunks/analysis.thunk';

const CaptureForm = ({ turtle, onClose }) => {
  const dispatch = useDispatch();
  const { turtleSpecies, loading: speciesLoading } = useSelector((state) => state.species);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    turtle_id: turtle?.id || 0,
    date_of_capture: new Date().toISOString().split('T')[0],
    captured_by: "",
    area_of_capture: "",
    further_action: "Released", 
    notes: "",
    weight_kg: 0, 
    scl: 0,      
    scw: 0,      
    ccl: 0,     
    ccw: 0,     
    latitude: 0,  
    longitude: 0 
  });

  const MALAYSIA_BOUNDS = {
    north: 7.363417,
    south: 0.855222,
    west: 99.643056,
    east: 119.267502
  };

  useEffect(() => {
    if (!turtleSpecies || turtleSpecies.length === 0) {
      dispatch(fetchTurtleSpecies());
    }
  }, [dispatch, turtleSpecies]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate coordinates
    const lat = Number(formData.latitude);
    const lng = Number(formData.longitude);
    if (
      lat < MALAYSIA_BOUNDS.south || lat > MALAYSIA_BOUNDS.north ||
      lng < MALAYSIA_BOUNDS.west || lng > MALAYSIA_BOUNDS.east
    ) {
      toast.error("Coordinates must be within Malaysia bounds.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        turtle_id: Number(turtle.id),
        date_of_capture: formData.date_of_capture,
        captured_by: formData.captured_by.trim(),
        area_of_capture: formData.area_of_capture.trim(),
        further_action: formData.further_action,
        notes: formData.notes.trim() || "",
        weight_kg: Number(formData.weight_kg) || 0,
        scl: Number(formData.scl) || 0,
        scw: Number(formData.scw) || 0,
        ccl: Number(formData.ccl) || 0,
        ccw: Number(formData.ccw) || 0,
        latitude: Number(formData.latitude) || 0,
        longitude: Number(formData.longitude) || 0
      };

      console.log('Submitting payload:', payload); 

      const response = await dispatch(createCapture(payload)).unwrap();
      toast.success("Capture record created successfully");
      dispatch(fetchHeatmapData());
      dispatch(fetchStatsSummary());
      dispatch(fetchSpeciesDistribution());
      dispatch(fetchConservationProgress());
      dispatch(fetchNestingEventsVsBank());
      dispatch(fetchCapturesSummary());
      onClose();
    } catch (error) {
      console.error('Capture creation error:', error);
      toast.error(error.message || "Failed to create capture record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 w-full max-w-4xl mb-6">
      {/* Record Found Header */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-medium text-green-800 mb-2">Record Found</h3>
        <p className="text-sm text-green-700">
          Turtle record with ID {turtle.microchip_id} has been found. Please enter the capture details below.
        </p>
      </div>

      {/* Turtle Details */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
        <h4 className="text-md font-medium text-gray-700 mb-4">Turtle Details</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600">Microchip ID</p>
            <p className="font-medium">{turtle.microchip_id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Species</p>
            <p className="font-medium">{turtle.species_name || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Gender</p>
            <p className="font-medium">{turtle.gender || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p className="font-medium">{turtle.status}</p>
          </div>
          {turtle.name && (
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">{turtle.name}</p>
            </div>
          )}
        </div>
      </div>

      {/* Capture Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2">Date of Capture*</label>
            <input 
              type="date" 
              name="date_of_capture"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#666639]"
              value={formData.date_of_capture}
              onChange={(e) => setFormData(prev => ({ ...prev, date_of_capture: e.target.value }))}
              required
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Captured By*</label>
            <input 
              type="text"
              name="captured_by"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#666639]"
              value={formData.captured_by}
              onChange={(e) => setFormData(prev => ({ ...prev, captured_by: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Area of Capture*</label>
            <input 
              type="text"
              name="area_of_capture"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#666639]"
              value={formData.area_of_capture}
              onChange={(e) => setFormData(prev => ({ ...prev, area_of_capture: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Further Action</label>
            <select
              name="further_action"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#666639]"
              value={formData.further_action}
              onChange={(e) => setFormData(prev => ({ ...prev, further_action: e.target.value }))}
            >
              <option value="Released">Released</option>
              <option value="Retained">Retained</option>
              <option value="Rehab">Rehab</option>
              <option value="Deceased">Deceased</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-lg font-medium text-gray-700 mb-4">Measurements</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Weight (kg)</label>
                <input 
                  type="number"
                  step="0.01"
                  name="weight_kg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#666639]"
                  value={formData.weight_kg}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight_kg: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">SCL (cm)</label>
                <input 
                  type="number"
                  step="0.1"
                  name="scl"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#666639]"
                  value={formData.scl}
                  onChange={(e) => setFormData(prev => ({ ...prev, scl: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">SCW (cm)</label>
                <input 
                  type="number"
                  step="0.1"
                  name="scw"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#666639]"
                  value={formData.scw}
                  onChange={(e) => setFormData(prev => ({ ...prev, scw: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">CCL (cm)</label>
                <input 
                  type="number"
                  step="0.1"
                  name="ccl"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#666639]"
                  value={formData.ccl}
                  onChange={(e) => setFormData(prev => ({ ...prev, ccl: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">CCW (cm)</label>
                <input 
                  type="number"
                  step="0.1"
                  name="ccw"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#666639]"
                  value={formData.ccw}
                  onChange={(e) => setFormData(prev => ({ ...prev, ccw: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Latitude*</label>
            <input 
              type="number"
              step="0.000001"
              name="latitude"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#666639]"
              value={formData.latitude}
              onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Longitude*</label>
            <input 
              type="number"
              step="0.000001"
              name="longitude"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#666639]"
              value={formData.longitude}
              onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-2">Notes</label>
            <textarea
              name="notes"
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#666639]"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Species</label>
            <select
              name="species_id"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#666639]"
              value={formData.species_id || ''}
              onChange={e => setFormData(prev => ({ ...prev, species_id: e.target.value }))}
              required
            >
              <option value="">Select Species</option>
              {speciesLoading ? (
                <option>Loading...</option>
              ) : (
                turtleSpecies && turtleSpecies.map(species => (
                  <option key={species.id} value={species.id}>{species.name}</option>
                ))
              )}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-white"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="bg-[#666639] text-white px-4 py-2 rounded-md hover:opacity-90 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Capture Record'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CaptureForm;