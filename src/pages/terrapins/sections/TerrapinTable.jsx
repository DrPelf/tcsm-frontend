import React, { useState, useMemo, useEffect, useRef } from "react";
import { IoSearch } from "react-icons/io5";
import { Trash2, Edit3, Filter, X } from "lucide-react";
import { SPECIES_LIST } from "../../../components/constants/SpeciesList";
import AddTerrapinForm from "./AddTerrapinForm";
import EditTerrapinModal from "./EditTerrapinModal";
import { useSelector, useDispatch } from "react-redux";
import { fetchHatchlings, deleteHatchling } from "../../../redux/thunks/hatchling.thunk";
import { fetchStatsSummary, fetchSpeciesDistribution, fetchConservationProgress, fetchNestingEventsVsBank, fetchHatchlingsPerYear } from "../../../redux/thunks/analysis.thunk";
import { fetchTurtleSpecies } from '../../../redux/thunks/species.thunk';
import { toast } from "sonner";

const GENDER_OPTIONS = ["Male", "Female", "Unknown"];

const TerrapinTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("table");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTerrapin, setSelectedTerrapin] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    species: "",
    gender: "",
    date: "",
    status: "",
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [activeFilter, setActiveFilter] = useState(null);
  const filterRefs = useRef({});

  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.Auth);
  const { hatchlings, loading, error } = useSelector((state) => state.hatchling);
  const { turtleSpecies: speciesList, loading: speciesLoading } = useSelector((state) => state.species);

  useEffect(() => {
    dispatch(fetchHatchlings());
    dispatch(fetchTurtleSpecies());
  }, [dispatch]);

  // Enhanced search filter (includes nested fields)
  const filteredTerrapins = useMemo(() => {
    let results = hatchlings || [];
    // Apply filters
    if (appliedFilters.species) {
      results = results.filter(
        (t) =>
          speciesList.find((s) => s.id === t.turtle?.species_id)?.name === appliedFilters.species
      );
    }
    if (appliedFilters.gender) {
      results = results.filter(
        (t) =>
          t.turtle?.gender &&
          t.turtle.gender.toLowerCase() === appliedFilters.gender.toLowerCase()
      );
    }
    if (appliedFilters.status) {
      results = results.filter(
        (t) =>
          t.turtle?.status &&
          t.turtle.status.toLowerCase() === appliedFilters.status.toLowerCase()
      );
    }
    if (appliedFilters.date) {
      results = results.filter(
        (t) =>
          t.date_first_release &&
          new Date(t.date_first_release).toDateString() ===
            new Date(appliedFilters.date).toDateString()
      );
    }
    // Enhanced search: flatten all relevant fields
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter((terrapin) => {
        const fields = [
          terrapin.turtle?.microchip_id,
          terrapin.turtle?.species_name,
          terrapin.turtle?.gender,
          terrapin.year_hatched,
          terrapin.date_first_release,
          terrapin.weight_kg,
          terrapin.turtle?.status,
          terrapin.scl,
          terrapin.scw,
          terrapin.ccl,
          terrapin.ccw,
          terrapin.notes,
        ];
        return fields.some((val) => val?.toString().toLowerCase().includes(query));
      });
    }
    return results;
  }, [hatchlings, searchQuery, appliedFilters, speciesList]);

  // Filter UI handlers
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
      species: "",
      gender: "",
      date: "",
      status: "",
    });
    setAppliedFilters({
      species: "",
      gender: "",
      date: "",
      status: "",
    });
  };

  const toggleFilter = (filterName) => {
    setActiveFilter((prev) => (prev === filterName ? null : filterName));
  };

  // Close filter modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        activeFilter &&
        filterRefs.current[activeFilter] &&
        !filterRefs.current[activeFilter].contains(event.target)
      ) {
        setActiveFilter(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeFilter]);

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  // Handle form submission
  const handleSaveRecord = (formData) => {
    setView("table");
    dispatch(fetchHatchlings());
  };

  // Handle edit action
  const handleEditTerrapin = (terrapin) => {
    setSelectedTerrapin(terrapin);
    setEditModalOpen(true);
  };

  // Handle delete action with security confirmation
  const handleDeleteTerrapin = (terrapin) => {
    setSelectedTerrapin(terrapin);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedTerrapin) return;
    try {
      setActionInProgress(true);
      await dispatch(deleteHatchling(selectedTerrapin.id)).unwrap();
      toast.success("Terrapin record deleted successfully", {
        description: "The record has been permanently removed from the system.",
        duration: 5000,
      });
      // Refresh the table data after successful deletion
      await dispatch(fetchHatchlings());
      dispatch(fetchStatsSummary());
      dispatch(fetchSpeciesDistribution());
      dispatch(fetchConservationProgress());
      dispatch(fetchNestingEventsVsBank());
      dispatch(fetchHatchlingsPerYear());
      setModalOpen(false);
    } catch (error) {
      toast.error("Failed to delete terrapin record", { duration: 5000 });
    } finally {
      setActionInProgress(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-md w-64 focus:outline-none focus:border-[#4D6A4D]"
              />
              <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            {searchQuery !== "" && (
              <button
                onClick={handleClearSearch}
                className="text-sm text-white hover:text-white"
              >
                Clear search
              </button>
            )}
            {Object.values(appliedFilters).some((filter) => filter !== "") && (
              <button
                onClick={clearAllFilters}
                className="flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200 ml-2"
              >
                <X className="w-3 h-3 mr-1" />
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {view === "table" ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm relative">
          {!hatchlings || hatchlings.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg font-medium mb-2">No Terrapin Records Found</p>
              <p className="text-sm">There are no terrapin records in the system yet.</p>
            </div>
          ) : filteredTerrapins.length === 0 ? (
            <div className="p-8 text-center text-[#666639] bg-[#F0F0E4] rounded-lg">
              <h3 className="text-xl font-semibold mb-2">No results found</h3>
              <p className="text-base">Try adjusting your search or filters to find matching terrapins.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#F5F5F0]">
                <tr>
                  {[
                    { label: "Microchip ID" },
                    { label: "Species", filter: "species" },
                    { label: "Gender", filter: "gender" },
                    { label: "Year Hatched" },
                    { label: "Date of First Release", filter: "date" },
                    { label: "Weight (kg)" },
                    { label: "SCL (cm)" },
                    { label: "SCW (cm)" },
                    { label: "CCL (cm)" },
                    { label: "CCW (cm)" },
                    { label: "Status", filter: "status" },
                    ...(userData?.role === "admin" ? [{ label: "Actions" }] : []),
                  ].map(({ label, filter }) => (
                    <th key={label} className="px-6 py-4 text-left text-sm font-medium text-[#666639] tracking-wider">
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
                            className="absolute top-full left-0 z-50 mt-2 bg-white rounded-md shadow-lg p-4 border border-gray-200 w-64"
                            style={{ 
                              minWidth: '240px', 
                              transform: 'none',
                              maxHeight: '300px',
                              overflow: 'visible'
                            }}
                          >
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
                                />
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
                                  <option value="Alive">Alive</option>
                                  <option value="Deceased">Deceased</option>
                                  <option value="Unknown">Unknown</option>
                                </select>
                              </div>
                            )}
                            <div className="flex justify-end mt-4 space-x-2">
                              <button
                                onClick={cancelFilters}
                                className="px-3 py-1.5 text-xs text-gray-700 bg-gray-200 hover:bg-gray-300 rounded"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={applyFilters}
                                className="px-3 py-1.5 text-xs text-white bg-[#666639] hover:bg-opacity-90 rounded"
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
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTerrapins.map((terrapin) => (
                  <tr key={terrapin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{terrapin.turtle?.microchip_id || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {terrapin.turtle?.species_id ? (speciesList.find(s => s.id === terrapin.turtle.species_id)?.name || terrapin.turtle.species_id) : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{terrapin.turtle?.gender || "Unknown"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{terrapin.year_hatched}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {terrapin.date_first_release ? new Date(terrapin.date_first_release).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{terrapin.weight_kg || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{terrapin.scl || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{terrapin.scw || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{terrapin.ccl || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{terrapin.ccw || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{terrapin.turtle?.status || "Unknown"}</td>
                    {userData?.role === "admin" && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditTerrapin(terrapin)}
                            className="text-gray-500 hover:text-gray-700 bg-white hover:bg-[#F9FAFB]"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTerrapin(terrapin)}
                            className="text-gray-500 hover:text-gray-700 bg-white hover:bg-[#F9FAFB]"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <AddTerrapinForm onCancel={() => setView("table")} onSave={handleSaveRecord} />
      )}

      {/* Delete Confirmation Modal */}
      {modalOpen && selectedTerrapin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Terrapin Record</h3>
            <div className="mb-6">
              <p className="text-gray-700">
                Are you sure you want to delete this terrapin record? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                disabled={actionInProgress}
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmDelete}
                disabled={actionInProgress}
                className={`px-4 py-2 text-white rounded bg-red-600 hover:bg-red-700
                  ${actionInProgress ? "opacity-75 cursor-not-allowed" : ""}
                `}
              >
                {actionInProgress ? "Processing..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <EditTerrapinModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        terrapin={selectedTerrapin}
        onSuccess={() => {
          dispatch(fetchHatchlings());
        }}
      />
    </div>
  );
};

export default TerrapinTable;