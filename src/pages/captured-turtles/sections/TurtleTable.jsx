"use client";

import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllCaptures, deleteCapture, updateCapture } from "../../../redux/thunks/captures.thunk";
import { fetchStatsSummary, fetchSpeciesDistribution, fetchConservationProgress, fetchNestingEventsVsBank, fetchCapturesSummary } from "../../../redux/thunks/analysis.thunk";
import { Trash2, Edit3, Filter, X, History } from "lucide-react";
import { SPECIES_LIST, GENDER_OPTIONS, ACTION_OPTIONS } from "../../../components/constants/SpeciesList";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import RecaptureHistoryModal from "../../../components/RecaptureHistoryModal";
import { fetchTurtleSpecies } from '../../../redux/thunks/species.thunk';

const RECORDS_PER_PAGE = 10;

const TurtleTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { captures, loading, error } = useSelector((state) => state.captures);
  const { turtleSpecies: speciesList, loading: speciesLoading } = useSelector((state) => state.species);
  const { userData } = useSelector((state) => state.Auth);

  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    date: "",
    species: "",
    gender: "",
    action: "",
    status: "",
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [activeFilter, setActiveFilter] = useState(null);
  const filterRefs = useRef({});
  const [currentPage, setCurrentPage] = useState(1);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCapture, setSelectedCapture] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedTurtleId, setSelectedTurtleId] = useState(null);

  // Fetch captures on component mount
  useEffect(() => {
    dispatch(fetchAllCaptures());
    dispatch(fetchTurtleSpecies());
  }, [dispatch]);

  // Call this after adding a turtle record
  const refreshTable = () => {
    dispatch(fetchAllCaptures());
  };

  // Apply filters when filter state or data changes
  useEffect(() => {
    if (!captures) return;

    let results = [...captures];

    // Filter by date
    if (appliedFilters.date) {
      results = results.filter((item) => new Date(item.date_of_capture).toDateString() === new Date(appliedFilters.date).toDateString());
    }

    // Filter by species
    if (appliedFilters.species) {
      results = results.filter((item) => {
        const speciesName = item.turtle?.species_id
          ? (speciesList.find(s => s.id === item.turtle.species_id)?.name || '')
          : '';
        return speciesName === appliedFilters.species;
      });
    }

    // Filter by gender
    if (appliedFilters.gender) {
      results = results.filter(
        (item) =>
          (item.turtle?.gender || "").toLowerCase() === appliedFilters.gender.toLowerCase()
      );
    }

    // Filter by action
    if (appliedFilters.action) {
      results = results.filter((item) => item.further_action && item.further_action.toLowerCase() === appliedFilters.action.toLowerCase());
    }

    // Filter by status
    if (appliedFilters.status) {
      results = results.filter(
        (item) =>
          (item.turtle?.status || "").toLowerCase() === appliedFilters.status.toLowerCase()
      );
    }

    setFilteredData(results);
    setCurrentPage(1); // Reset to first page on filter change
  }, [appliedFilters, captures, speciesList]);

  // Close filter modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeFilter && filterRefs.current[activeFilter] && !filterRefs.current[activeFilter].contains(event.target)) {
        setActiveFilter(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeFilter]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
    setActiveFilter(null);
  };

  const cancelFilters = () => {
    setFilters(appliedFilters);
    setActiveFilter(null);
  };

  const clearAllFilters = () => {
    setFilters({
      date: "",
      species: "",
      gender: "",
      action: "",
      status: "",
    });
    setAppliedFilters({
      date: "",
      species: "",
      gender: "",
      action: "",
      status: "",
    });
  };

  const toggleFilter = (filterName) => {
    setActiveFilter((prev) => (prev === filterName ? null : filterName));
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / RECORDS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * RECORDS_PER_PAGE,
    currentPage * RECORDS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Open delete modal
  const handleDeleteClick = (capture) => {
    setSelectedCapture(capture);
    setDeleteModalOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await dispatch(deleteCapture(selectedCapture.id)).unwrap();
      toast.success("Capture deleted successfully!");
      dispatch(fetchStatsSummary());
      dispatch(fetchSpeciesDistribution());
      dispatch(fetchConservationProgress());
      dispatch(fetchNestingEventsVsBank());
      dispatch(fetchCapturesSummary());
      setDeleteModalOpen(false);
      setSelectedCapture(null);
    } catch (error) {
      toast.error(error?.message || "Failed to delete capture.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Open edit modal
  const handleEditClick = (capture) => {
    setEditForm({ ...capture });
    setEditModalOpen(true);
  };

  // Handle form changes
  const handleEditFormChange = (e) => {
    const { name, value, type } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "number" && value !== "" ? parseFloat(value) : value,
    }));
  };

  // Confirm edit
  const handleConfirmEdit = async () => {
    setEditLoading(true);
    try {
      // Prepare payload as backend expects
      const payload = {
        date_of_capture: editForm.date_of_capture,
        captured_by: editForm.captured_by,
        area_of_capture: editForm.area_of_capture,
        further_action: editForm.further_action,
        notes: editForm.notes,
        weight_kg: editForm.weight_kg,
        scl: editForm.scl,
        scw: editForm.scw,
        ccl: editForm.ccl,
        ccw: editForm.ccw,
        latitude: editForm.latitude,
        longitude: editForm.longitude,
      };
      await dispatch(updateCapture({ id: editForm.id, updateData: payload })).unwrap();
      toast.success("Capture updated successfully!");
      dispatch(fetchStatsSummary());
      dispatch(fetchSpeciesDistribution());
      dispatch(fetchConservationProgress());
      dispatch(fetchNestingEventsVsBank());
      dispatch(fetchCapturesSummary());
      setEditModalOpen(false);
      setEditForm(null);
    } catch (error) {
      toast.error(error?.message || "Failed to update capture.");
    } finally {
      setEditLoading(false);
    }
  };

  // Update the handleViewHistory function
  const handleViewHistory = (capture) => {
    const turtleId = capture.turtle_id;
    
    if (turtleId) {
      setSelectedTurtleId(turtleId);
      setHistoryModalOpen(true);
    } else {
      toast.error("No turtle ID found for this record");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading captures...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error.message || "Failed to load captures"}</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        {Object.values(appliedFilters).some((filter) => filter !== "") && (
          <button
            onClick={clearAllFilters}
            className="flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200"
          >
            <X className="w-3 h-3 mr-1" />
            Clear All Filters
          </button>
        )}
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                { label: "Microchip ID" },
                { label: "Date of Capture", filter: "date" },
                { label: "Species", filter: "species" },
                { label: "Gender", filter: "gender" },
                { label: "Status", filter: "status" },
                { label: "Area of Capture" },
                { label: "Weight (kg)" },
                { label: "SCL" },
                { label: "SCW" },
                { label: "CCW" },
                { label: "CCL" },
                { label: "Further Action", filter: "action" },
                { label: "View History" },
                ...(userData?.role === "admin" ? [{ label: "Actions" }] : []),
              ].map(({ label, filter }) => (
                <th key={label} className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-1 relative">
                    <span>{label}</span>
                    {filter && (
                      <button
                        onClick={() => toggleFilter(filter)}
                        className="p-1 rounded-md bg-white text-gray-500 hover:text-gray-700"
                      >
                        <Filter className="w-3 h-3" />
                      </button>
                    )}
                    {activeFilter === filter && (
                      <div
                        ref={(el) => (filterRefs.current[filter] = el)}
                        className="absolute z-10 mt-2 bg-white rounded-md shadow-lg p-4 border border-gray-200"
                      >
                        {filter === "date" && (
                          <div className="space-y-2">
                            <label htmlFor="date" className="block text-xs font-medium text-gray-700">
                              Select Date
                            </label>
                            <input
                              type="date"
                              id="date"
                              name="date"
                              value={filters.date}
                              onChange={handleFilterChange}
                              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                              max={new Date().toISOString().split('T')[0]}
                            />
                          </div>
                        )}
                        {filter === "species" && (
                          <div className="space-y-2">
                            <label htmlFor="species" className="block text-xs font-medium text-gray-700">
                              Select Species
                            </label>
                            <select
                              id="species"
                              name="species"
                              value={filters.species}
                              onChange={handleFilterChange}
                              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                            >
                              <option value="">All</option>
                              {speciesList && speciesList.map((species) => (
                                <option key={species.id} value={species.name}>
                                  {species.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                        {filter === "gender" && (
                          <div className="space-y-2">
                            <label htmlFor="gender" className="block text-xs font-medium text-gray-700">
                              Select Gender
                            </label>
                            <select
                              id="gender"
                              name="gender"
                              value={filters.gender}
                              onChange={handleFilterChange}
                              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                            >
                              <option value="">All</option>
                              {GENDER_OPTIONS.map((gender) => (
                                <option key={gender} value={gender}>
                                  {gender}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                        {filter === "status" && (
                          <div className="space-y-2">
                            <label htmlFor="status" className="block text-xs font-medium text-gray-700">
                              Select Status
                            </label>
                            <select
                              id="status"
                              name="status"
                              value={filters.status}
                              onChange={handleFilterChange}
                              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                            >
                              <option value="">All</option>
                              <option value="alive">Alive</option>
                              <option value="dead">Dead</option>
                              <option value="unknown">Unknown</option>
                            </select>
                          </div>
                        )}
                        {filter === "action" && (
                          <div className="space-y-2">
                            <label htmlFor="action" className="block text-xs font-medium text-gray-700">
                              Select Action
                            </label>
                            <select
                              id="action"
                              name="action"
                              value={filters.action}
                              onChange={handleFilterChange}
                              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                            >
                              <option value="">All</option>
                              {ACTION_OPTIONS.map((action) => (
                                <option key={action} value={action.toLowerCase()}>
                                  {action}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                        <div className="flex justify-end mt-2 space-x-2">
                          <button
                            onClick={cancelFilters}
                            className="px-2 py-1 text-xs text-[#666639] bg-gray-200 hover:text-[#666639] rounded"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={applyFilters}
                            className="px-2 py-1 text-xs text-white bg-[#666639] hover:bg-[#666639] rounded-md"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.length > 0 ? (
              paginatedData.map((capture) => (
                <tr key={capture.id}>
                  <td className="py-3 px-4 text-sm text-gray-900">{capture.turtle?.microchip_id || "N/A"}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{new Date(capture.date_of_capture).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {capture.turtle?.species_id ? (speciesList.find(s => s.id === capture.turtle.species_id)?.name || capture.turtle.species_id) : "Unknown"}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 capitalize">{capture.turtle?.gender || "Unknown"}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{capture.turtle?.status || "Unknown"}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{capture.area_of_capture}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{capture.weight_kg}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{capture.scl}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{capture.scw}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{capture.ccw}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{capture.ccl}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{capture.further_action || "Pending"}</td>
                  {/* View History Button - always visible */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button
                      className="px-2 py-1 text-xs border border-[#666639] text-[#666639] bg-transparent rounded-md hover:bg-[#666639] hover:text-white transition-colors relative group"
                      onClick={() => handleViewHistory(capture)}
                    >
                      <History size={16} />
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                        View History
                      </span>
                    </button>
                  </td>
                  {userData?.role === "admin" && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditClick(capture)}
                          className="text-gray-500 hover:text-gray-700 bg-white hover:bg-[#F9FAFB]"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(capture)}
                          className="text-gray-500 hover:text-gray-700 bg-white hover:bg-[#F9FAFB]"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={userData?.role === "admin" ? 15 : 14} className="py-6 text-center text-sm text-gray-500">
                  No record found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Security Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Capture Record</h3>
            <p className="mb-4 text-gray-700">
              Are you sure you want to delete this capture record? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Capture Record</h3>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleConfirmEdit();
              }}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs mb-1">Date of Capture</label>
                  <input
                    type="date"
                    name="date_of_capture"
                    value={editForm.date_of_capture?.slice(0, 10) || ""}
                    onChange={handleEditFormChange}
                    className="w-full border px-2 py-1 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">Captured By</label>
                  <input
                    type="text"
                    name="captured_by"
                    value={editForm.captured_by || ""}
                    onChange={handleEditFormChange}
                    className="w-full border px-2 py-1 rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">Area of Capture</label>
                  <input
                    type="text"
                    name="area_of_capture"
                    value={editForm.area_of_capture || ""}
                    onChange={handleEditFormChange}
                    className="w-full border px-2 py-1 rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">Further Action</label>
                  <select
                    name="further_action"
                    value={editForm.further_action || ""}
                    onChange={handleEditFormChange}
                    className="w-full border px-2 py-1 rounded"
                  >
                    <option value="">Select</option>
                    <option value="Released">Released</option>
                    <option value="Rehab">Rehab</option>
                    <option value="Buried">Buried</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    name="weight_kg"
                    value={editForm.weight_kg ?? ""}
                    onChange={handleEditFormChange}
                    className="w-full border px-2 py-1 rounded"
                    step="0.001"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">SCL</label>
                  <input
                    type="number"
                    name="scl"
                    value={editForm.scl ?? ""}
                    onChange={handleEditFormChange}
                    className="w-full border px-2 py-1 rounded"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">SCW</label>
                  <input
                    type="number"
                    name="scw"
                    value={editForm.scw ?? ""}
                    onChange={handleEditFormChange}
                    className="w-full border px-2 py-1 rounded"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">CCL</label>
                  <input
                    type="number"
                    name="ccl"
                    value={editForm.ccl ?? ""}
                    onChange={handleEditFormChange}
                    className="w-full border px-2 py-1 rounded"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">CCW</label>
                  <input
                    type="number"
                    name="ccw"
                    value={editForm.ccw ?? ""}
                    onChange={handleEditFormChange}
                    className="w-full border px-2 py-1 rounded"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">Latitude</label>
                  <input
                    type="number"
                    name="latitude"
                    value={editForm.latitude ?? ""}
                    onChange={handleEditFormChange}
                    className="w-full border px-2 py-1 rounded"
                    step="0.000001"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">Longitude</label>
                  <input
                    type="number"
                    name="longitude"
                    value={editForm.longitude ?? ""}
                    onChange={handleEditFormChange}
                    className="w-full border px-2 py-1 rounded"
                    step="0.000001"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs mb-1">Notes</label>
                  <textarea
                    name="notes"
                    value={editForm.notes || ""}
                    onChange={handleEditFormChange}
                    className="w-full border px-2 py-1 rounded"
                    rows={2}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  disabled={editLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-4 py-2 bg-[#666639] text-white rounded hover:bg-[#55552a]"
                >
                  {editLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recapture History Modal */}
      <RecaptureHistoryModal 
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        turtleId={selectedTurtleId}
      />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx + 1}
              onClick={() => handlePageChange(idx + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === idx + 1
                  ? "bg-[#666639] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TurtleTable;