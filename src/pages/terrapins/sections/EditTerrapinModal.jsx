import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateHatchling, fetchHatchlings } from "../../../redux/thunks/hatchling.thunk";
import { fetchStatsSummary, fetchSpeciesDistribution, fetchConservationProgress, fetchNestingEventsVsBank, fetchHatchlingsPerYear } from "../../../redux/thunks/analysis.thunk";
import { toast } from "sonner";
import { SPECIES_LIST } from "../../../components/constants/SpeciesList";

const EditTerrapinModal = ({ isOpen, onClose, terrapin, onSuccess }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    year_hatched: "",
    scl: "",
    scw: "",
    ccl: "",
    ccw: "",
    date_first_release: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (terrapin) {
      setFormData({
        year_hatched: terrapin.year_hatched || "",
        scl: terrapin.scl || "",
        scw: terrapin.scw || "",
        ccl: terrapin.ccl || "",
        ccw: terrapin.ccw || "",
        date_first_release: terrapin.date_first_release ? terrapin.date_first_release.split('T')[0] : "",
        notes: terrapin.notes || "",
      });
    }
  }, [terrapin]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convert empty strings to null for numeric fields
    const numericFields = ["scl", "scw", "ccl", "ccw"];
    setFormData((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) && value === "" ? null : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate year hatched
    if (formData.year_hatched) {
      const hatchedYear = parseInt(formData.year_hatched);
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
    if (formData.date_first_release && formData.year_hatched) {
      const hatchedYear = parseInt(formData.year_hatched);
      const releaseDate = new Date(formData.date_first_release);
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

    const formattedData = {
      turtle_id: terrapin.turtle_id || 0,
      year_hatched: parseInt(formData.year_hatched) || 0,
      date_first_release: formData.date_first_release || "",
      notes: formData.notes || "",
      scl: parseFloat(formData.scl) || 0,
      scw: parseFloat(formData.scw) || 0,
      ccl: parseFloat(formData.ccl) || 0,
      ccw: parseFloat(formData.ccw) || 0,
    };

    try {
      await dispatch(updateHatchling({ hatchlingId: terrapin.id, updateData: formattedData })).unwrap();
      await dispatch(fetchHatchlings());
      dispatch(fetchStatsSummary());
      dispatch(fetchSpeciesDistribution());
      dispatch(fetchConservationProgress());
      dispatch(fetchNestingEventsVsBank());
      dispatch(fetchHatchlingsPerYear());
      toast.success("Terrapin record updated successfully!");
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      console.error("Failed to update terrapin:", error);
      toast.error("Failed to update terrapin record. Please check your input.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-gray-700">Edit Terrapin Record</h2>
          <button onClick={onClose} className="text-white-500 hover:text-white-700">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Species</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  value={terrapin.turtle?.species_name || "Unknown"}
                  disabled
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Year Hatched</label>
                <input
                  type="number"
                  name="year_hatched"
                  value={formData.year_hatched}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#4D6A4D]"
                />
              </div>



              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Date of First Release</label>
                <input
                  type="date"
                  name="date_first_release"
                  value={formData.date_first_release}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#4D6A4D]"
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">SCL (cm)</label>
                  <input
                    type="number"
                    name="scl"
                    value={formData.scl}
                    onChange={handleChange}
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#4D6A4D]"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">SCW (cm)</label>
                  <input
                    type="number"
                    name="scw"
                    value={formData.scw}
                    onChange={handleChange}
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#4D6A4D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">CCL (cm)</label>
                  <input
                    type="number"
                    name="ccl"
                    value={formData.ccl}
                    onChange={handleChange}
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#4D6A4D]"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">CCW (cm)</label>
                  <input
                    type="number"
                    name="ccw"
                    value={formData.ccw}
                    onChange={handleChange}
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#4D6A4D]"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#4D6A4D] h-24"
                  placeholder="Enter any additional notes or observations"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#666639] text-white px-4 py-2 rounded-md hover:opacity-90 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTerrapinModal;