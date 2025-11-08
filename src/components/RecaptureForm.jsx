import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { fetchHeatmapData } from "../redux/thunks/map.thunk";
import { fetchStatsSummary, fetchSpeciesDistribution, fetchConservationProgress, fetchNestingEventsVsBank, fetchCapturesSummary } from "../redux/thunks/analysis.thunk";
import { createRecapture } from "../redux/thunks/recapture.thunk";

const RecaptureForm = ({ turtle, captureRecord, onClose }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    turtle_id: turtle?.id || 0,
    microchip_id: turtle?.microchip_id || "",
    recapture_date: new Date().toISOString().split('T')[0],
    capture_method: "",
    notes: "",
    weight_kg: "",
    scl: "",
    scw: "",
    ccl: "",
    ccw: "",
    latitude: 0,
    longitude: 0
  });

  const MALAYSIA_BOUNDS = {
    north: 7.363417,
    south: 0.855222,
    west: 99.643056,
    east: 119.267502
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Helper function to check if a value is a valid number
  const isValidNumber = (value) => {
    if (!value && value !== 0) return true; // Empty values are allowed
    const num = parseFloat(value);
    return !isNaN(num);
  };

  // Form validation function
  const validateForm = () => {
    // Required field validation
    if (!formData.recapture_date) {
      toast.error("Date of recapture is required.");
      return false;
    }
    // Validate recapture date is not earlier than first capture
    const firstCaptureDate = new Date(captureRecord.date_of_capture);
    const recaptureDate = new Date(formData.recapture_date);
    if (recaptureDate < firstCaptureDate) {
      toast.error("Recapture date cannot be earlier than the first capture date.");
      return false;
    }
    // Measurement validation
    const measurements = [
      { field: 'weight_kg', value: formData.weight_kg, name: 'Weight' },
      { field: 'scl', value: formData.scl, name: 'SCL' },
      { field: 'scw', value: formData.scw, name: 'SCW' },
      { field: 'ccl', value: formData.ccl, name: 'CCL' },
      { field: 'ccw', value: formData.ccw, name: 'CCW' }
    ];
    for (const measurement of measurements) {
      if (!isValidNumber(measurement.value)) {
        toast.error(`${measurement.name} must be a valid number.`);
        return false;
      }
    }
    // Validate coordinates only if both are provided and not 0/null
    const lat = formData.latitude === null || formData.latitude === '' ? null : Number(formData.latitude);
    const lng = formData.longitude === null || formData.longitude === '' ? null : Number(formData.longitude);

    if (
      lat !== null && lng !== null &&
      lat !== 0 && lng !== 0 &&
      (lat < MALAYSIA_BOUNDS.south || lat > MALAYSIA_BOUNDS.north ||
       lng < MALAYSIA_BOUNDS.west || lng > MALAYSIA_BOUNDS.east)
    ) {
      toast.error("Coordinates must be within Malaysia bounds.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const payload = {
        turtle_id: Number(formData.turtle_id),
        microchip_id: formData.microchip_id,
        recapture_date: formData.recapture_date,
        capture_method: formData.capture_method,
        notes: formData.notes.trim() || "",
        weight_kg: Number(formData.weight_kg) || 0,
        scl: Number(formData.scl) || 0,
        scw: Number(formData.scw) || 0,
        ccl: Number(formData.ccl) || 0,
        ccw: Number(formData.ccw) || 0,
        latitude: formData.latitude === '' || formData.latitude === null ? 0 : Number(formData.latitude),
        longitude: formData.longitude === '' || formData.longitude === null ? 0 : Number(formData.longitude)
      };
      await dispatch(createRecapture(payload)).unwrap();
      toast.success("Recapture record saved successfully!");
      dispatch(fetchHeatmapData());
      dispatch(fetchStatsSummary());
      dispatch(fetchSpeciesDistribution());
      dispatch(fetchConservationProgress());
      dispatch(fetchNestingEventsVsBank());
      dispatch(fetchCapturesSummary());
      onClose();
    } catch (error) {
      console.error('Recapture creation error:', error);
      toast.error(error.message || "Failed to save recapture record");
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
          Record with ID {captureRecord.microchip_id} has been found. Please enter the recapture details below.
        </p>
      </div>

      {/* Previous Capture Details */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
        <h4 className="text-md font-medium text-gray-700 mb-4">Previous Capture Details</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600">Microchip ID</p>
            <p className="font-medium">{captureRecord.microchip_id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Species</p>
            <p className="font-medium">{captureRecord.species_name || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Date of Capture</p>
            <p className="font-medium">{new Date(captureRecord.date_of_capture).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Captured By</p>
            <p className="font-medium">{captureRecord.captured_by}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Area of Capture</p>
            <p className="font-medium">{captureRecord.area_of_capture}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Further Action</p>
            <p className="font-medium">{captureRecord.further_action}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Weight (kg)</p>
            <p className="font-medium">{captureRecord.weight_kg}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">SCL (cm)</p>
            <p className="font-medium">{captureRecord.scl}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">SCW (cm)</p>
            <p className="font-medium">{captureRecord.scw}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">CCL (cm)</p>
            <p className="font-medium">{captureRecord.ccl}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">CCW (cm)</p>
            <p className="font-medium">{captureRecord.ccw}</p>
          </div>
          {captureRecord.notes && (
            <div className="col-span-2 md:col-span-3">
              <p className="text-sm text-gray-600">Notes</p>
              <p className="font-medium">{captureRecord.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Recapture Form */}
      <form onSubmit={handleSubmit}>
        <div className="border-t pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Date of recapture</label>
              <input 
                type="date" 
                name="recapture_date"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
                  formData.recapture_date && new Date(formData.recapture_date) < new Date(captureRecord.date_of_capture)
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300'
                }`}
                value={formData.recapture_date}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
              />
              {formData.recapture_date && new Date(formData.recapture_date) < new Date(captureRecord.date_of_capture) && (
                <p className="text-xs text-red-500 mt-1">
                  Recapture date cannot be earlier than {new Date(captureRecord.date_of_capture).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Capture Method</label>
              <input
                type="text"
                name="capture_method"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                value={formData.capture_method}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Latitude</label>
              <input
                type="number"
                step="0.000001"
                name="latitude"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                value={formData.latitude === null ? '' : formData.latitude}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Longitude</label>
              <input
                type="number"
                step="0.000001"
                name="longitude"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                value={formData.longitude === null ? '' : formData.longitude}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Weight (kg)</label>
              <input 
                type="number" 
                name="weight_kg"
                step="0.001"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
                  formData.weight_kg && !isValidNumber(formData.weight_kg) 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300'
                }`}
                value={formData.weight_kg}
                onChange={handleChange}
              />
              {formData.weight_kg && !isValidNumber(formData.weight_kg) && (
                <p className="text-xs text-red-500 mt-1">Please enter a valid number</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">SCL (cm)</label>
              <input 
                type="number" 
                name="scl"
                step="0.1"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
                  formData.scl && !isValidNumber(formData.scl) 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300'
                }`}
                value={formData.scl}
                onChange={handleChange}
              />
              {formData.scl && !isValidNumber(formData.scl) && (
                <p className="text-xs text-red-500 mt-1">Please enter a valid number</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">SCW (cm)</label>
              <input 
                type="number" 
                name="scw"
                step="0.1"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
                  formData.scw && !isValidNumber(formData.scw) 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300'
                }`}
                value={formData.scw}
                onChange={handleChange}
              />
              {formData.scw && !isValidNumber(formData.scw) && (
                <p className="text-xs text-red-500 mt-1">Please enter a valid number</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">CCL (cm)</label>
              <input 
                type="number" 
                name="ccl"
                step="0.1"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
                  formData.ccl && !isValidNumber(formData.ccl) 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300'
                }`}
                value={formData.ccl}
                onChange={handleChange}
              />
              {formData.ccl && !isValidNumber(formData.ccl) && (
                <p className="text-xs text-red-500 mt-1">Please enter a valid number</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">CCW (cm)</label>
              <input 
                type="number" 
                name="ccw"
                step="0.1"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
                  formData.ccw && !isValidNumber(formData.ccw) 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300'
                }`}
                value={formData.ccw}
                onChange={handleChange}
              />
              {formData.ccw && !isValidNumber(formData.ccw) && (
                <p className="text-xs text-red-500 mt-1">Please enter a valid number</p>
              )}
            </div>
            <div className="mb-4 md:col-span-2">
              <label className="block text-gray-700 mb-2">Notes</label>
              <textarea
                name="notes"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                value={formData.notes}
                onChange={handleChange}
                rows={2}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="bg-[#666639] text-white px-4 py-2 rounded-md hover:opacity-90"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Record"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecaptureForm;