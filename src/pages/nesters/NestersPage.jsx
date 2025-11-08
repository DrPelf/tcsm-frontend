import React, { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { IoChevronBack } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Trash2, Edit3, History } from "lucide-react"; 
import DefaultLayout from "../../components/layout/DefaultLayout";
import NestingActivityGraph from "./sections/NestingActivityGraph";
import NesterHistory from "./sections/NesterHistory";
import RecaptureHistoryModal from "../../components/RecaptureHistoryModal"; 
import { fetchNestingEvents, updateNestingEvent, deleteNestingEvent } from "../../redux/thunks/nestingEvent.thunk";
import { fetchStatsSummary, fetchSpeciesDistribution, fetchConservationProgress, fetchNestingEventsVsBank } from "../../redux/thunks/analysis.thunk";
import { fetchNestingBanks } from "../../redux/thunks/nestingBank.thunk";
import { SPECIES_LIST } from "../../components/constants/SpeciesList";
import { toast } from "sonner"; 
const NestersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("table");
  const [selectedNester, setSelectedNester] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedTurtleId, setSelectedTurtleId] = useState(null);
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.Auth);
  const { nestingEvents, loading, error } = useSelector((state) => state.nestingEvent);
  const { nestingBanks } = useSelector((state) => state.nestingBank);

  // Fetch nesting events and banks on component mount
  useEffect(() => {
    dispatch(fetchNestingEvents());
    dispatch(fetchNestingBanks());
  }, [dispatch]);

  const handleFormSubmit = (formData) => {
    console.log("Form submitted:", formData);
    setView("table");
    // Refresh the nesters table after adding a nester
    dispatch(fetchNestingEvents());
  };

  const handleFormCancel = () => {
    setView("table");
  };

  // Open edit modal
  const handleEditNester = (id) => {
    const event = nestingEvents.find(ev => ev.id === id);
    setEditForm({ ...event });
    setEditModalOpen(true);
  };

  // Handle form changes
  const handleEditFormChange = (e) => {
    const { name, value, type } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "number" && value !== "" ? Number(value) : value,
    }));
  };

  // Confirm edit
  const handleConfirmEdit = async () => {
    // Prevent saving if eggs hatched > eggs
    if (
      editForm?.editEggsHatched &&
      Number(editForm.num_of_eggs_hatched) > Number(editForm.num_of_eggs)
    ) {
      toast.error("Number of eggs hatched cannot be greater than number of eggs.");
      return;
    }
    setEditLoading(true);
    try {
      // Prepare payload as backend expects
      const payload = {
        turtle_id: editForm.turtle_id,
        nesting_date: editForm.nesting_date,
        nesting_bank_id: Number(editForm.nesting_bank_id),
        num_of_eggs: Number(editForm.num_of_eggs),
        num_of_eggs_hatched: Number(editForm.num_of_eggs_hatched),
        notes: editForm.notes,
        weight_kg: Number(editForm.weight_kg),
        scl: Number(editForm.scl),
        scw: Number(editForm.scw),
        ccl: Number(editForm.ccl),
        ccw: Number(editForm.ccw),
        latitude: Number(editForm.latitude),
        longitude: Number(editForm.longitude),
      };
      
      // Update the record
      await dispatch(updateNestingEvent({ id: editForm.id, updateData: payload })).unwrap();
      await dispatch(fetchNestingEvents()); // Refresh the table
      dispatch(fetchStatsSummary());
      dispatch(fetchSpeciesDistribution());
      dispatch(fetchConservationProgress());
      dispatch(fetchNestingEventsVsBank());
      toast.success("Nesting event updated successfully!");
      setEditModalOpen(false);
      setEditForm(null);
    } catch (error) {
      toast.error(error?.message || "Failed to update nesting event.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteNester = (id) => {
    setEventToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await dispatch(deleteNestingEvent(eventToDelete)).unwrap();
      toast.success("Nesting event deleted successfully!");
      dispatch(fetchStatsSummary());
      dispatch(fetchSpeciesDistribution());
      dispatch(fetchConservationProgress());
      dispatch(fetchNestingEventsVsBank());
      setDeleteModalOpen(false);
      setEventToDelete(null);
      // Optionally refresh the table
      dispatch(fetchNestingEvents());
    } catch (error) {
      toast.error(error?.message || "Failed to delete nesting event.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Enhanced filter function for search (includes nested fields)
  const filteredNesters = nestingEvents?.filter((nester) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    // Flatten all searchable fields, including nested turtle fields
    const fields = [
      nester.turtle?.microchip_id,
      nester.turtle?.species_name,
      nester.nesting_date,
      nester.num_of_eggs,
      nester.num_of_eggs_hatched,
      nester.weight_kg,
      nester.scl,
      nester.scw,
      nester.ccl,
      nester.ccw,
      nester.notes,
      nester.latitude,
      nester.longitude,
    ];
    return fields.some((val) => val?.toString().toLowerCase().includes(query));
  });

  const handleViewHistory = (nester) => {
    const turtleId = nester.turtle_id;
    console.log('Selected Turtle ID for history:', turtleId);
    
    if (turtleId) {
      setSelectedTurtleId(turtleId);
      setHistoryModalOpen(true);
    } else {
      toast.error("No turtle ID found for this record");
    }
  };

  // Helper function to get bank name
  const getNestingBankName = (bankId) => {
    const bank = nestingBanks.find(b => b.id === bankId);
    return bank?.name || 'Unknown Bank';
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="p-4 text-center">Loading...</div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="max-w-7.5xl mx-auto">
        {/* Back button and Title */}
        <div className="flex items-center gap-2 mb-6">
          <Link
            to="/"
            className="flex items-center text-[#666639] hover:text-[#4D6A4D] transition-colors"
          >
            <IoChevronBack className="w-5 h-5" />
            <span className="text-sm">Back to Dashboard</span>
          </Link>
        </div>

        {/* Nesting Activity Graph */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <h2 className="font-domine text-[#4D6A4D] text-lg font-medium mb-1">
            Nesting Activity by Species
          </h2>
          <p className="font-inter text-[#666639] text-sm mb-4">
            Track nesting patterns and activity
          </p>
          {/* Show error only for this section if it fails */}
          {error && error.section === "graph" ? (
            <div className="text-red-500 text-sm py-4">{error.message}</div>
          ) : (
            <NestingActivityGraph />
          )}
        </div>

        {/* Table/Form/History Section */}
        <div className="bg-white rounded-lg shadow-sm">
          {view === "table" ? (
            <>
              <div className="p-4 border-b border-[#E5E5E5]">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search records..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-[#E5E5E5] rounded-md w-64 focus:outline-none focus:border-[#4D6A4D] text-[#666639]"
                      />
                      <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666639] opacity-50 w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
                {/* Show error only for the table if it fails */}
                {error && error.section === "table" ? (
                  <div className="p-8 text-center text-red-500">
                    Error: {error.message}
                  </div>
                ) : !nestingEvents || nestingEvents.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <p className="text-lg font-medium mb-2">No Nesting Events Found</p>
                    <p className="text-sm">There are no nesting events recorded in the system yet.</p>
                  </div>
                ) : filteredNesters.length === 0 ? (
                  <div className="p-8 text-center text-[#666639] bg-[#F0F0E4] rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">No results found</h3>
                    <p className="text-base">Try adjusting your search or filters to find matching nesters.</p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#F5F5F0]">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-[#666639] tracking-wider">Microchip ID</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-[#666639] tracking-wider">Species</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-[#666639] tracking-wider">Nesting Bank</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-[#666639] tracking-wider">Number of Eggs</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-[#666639] tracking-wider">Number of Eggs Hatched</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-[#666639] tracking-wider">Weight (kg)</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-[#666639] tracking-wider">SCW (cm)</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-[#666639] tracking-wider">SCL (cm)</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-[#666639] tracking-wider">CCW (cm)</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-[#666639] tracking-wider">CCL (cm)</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-[#666639] tracking-wider">Notes</th>
                        {userData?.role === "admin" && (
                          <th className="px-6 py-4 text-left text-sm font-medium text-[#666639] tracking-wider">Actions</th>
                        )}
                        <th className="px-6 py-4 text-left text-sm font-medium text-[#666639] tracking-wider">History</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredNesters?.map((nester) => (
                        <tr key={nester.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {nester.turtle?.microchip_id || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {nester.turtle?.species_name || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {getNestingBankName(nester.nesting_bank_id)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{nester.num_of_eggs}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {nester.num_of_eggs_hatched}
                            <button
                              className="ml-2 px-1 py-0.5 text-xs rounded bg-white"
                              onClick={() => {
                                setEditForm({ ...nester, editEggsHatched: true });
                                setEditModalOpen(true);
                              }}
                              title="Edit eggs hatched"
                            >
                              <Edit3 className="w-4 h-4 bg-none text-gray-600" />
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{nester.weight_kg}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{nester.scw}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{nester.scl}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{nester.ccw}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{nester.ccl}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">{nester.notes || '-'}</td>
                          {userData?.role === "admin" && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEditNester(nester.id)}
                                  className="text-gray-500 hover:text-gray-700 bg-white hover:bg-[#F9FAFB]"
                                  title="Edit"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteNester(nester.id)}
                                  className="text-gray-500 hover:text-gray-700 bg-white hover:bg-[#F9FAFB]"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <button
                              className="px-2 py-1 text-xs border border-[#666639] text-[#666639] bg-transparent rounded-md hover:bg-[#666639] hover:text-white transition-colors relative group"
                              onClick={() => handleViewHistory(nester)}
                            >
                              <History size={16} />
                              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                                View History
                              </span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          ) : view === "form" ? (
            <NesterForm onCancel={handleFormCancel} onSubmit={handleFormSubmit} />
          ) : view === "history" ? (
            <NesterHistory
              nester={selectedNester}
              onBack={() => {
                setView("table");
                setSelectedNester(null);
              }}
            />
          ) : null}
        </div>
      </div>

      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editForm?.editEggsHatched ? "Update Number of Eggs Hatched" : "Edit Nesting Event"}
            </h3>
            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              onSubmit={e => {
                e.preventDefault();
                handleConfirmEdit();
              }}
            >
              {editForm?.editEggsHatched ? (
                <div className="md:col-span-2">
                  <label className="block text-xs mb-1">Number of Eggs Hatched</label>
                  <input
                    type="number"
                    name="num_of_eggs_hatched"
                    value={editForm.num_of_eggs_hatched ?? ""}
                    onChange={handleEditFormChange}
                    className="w-full border px-2 py-1 rounded"
                    min={0}
                    max={editForm.num_of_eggs ?? 0}
                  />
                  {Number(editForm.num_of_eggs_hatched) > Number(editForm.num_of_eggs) && (
                    <p className="text-xs text-red-600 mt-1">
                      Number of eggs hatched cannot be greater than number of eggs ({editForm.num_of_eggs}).
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs mb-1">Nesting Date</label>
                    <input
                      type="date"
                      name="nesting_date"
                      value={editForm.nesting_date?.slice(0, 10) || ""}
                      onChange={handleEditFormChange}
                      className="w-full border px-2 py-1 rounded"
                      required
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Nesting Bank</label>
                    <select
                      name="nesting_bank_id"
                      value={editForm.nesting_bank_id ?? ""}
                      onChange={handleEditFormChange}
                      className="w-full border px-2 py-1 rounded"
                      required
                    >
                      <option value="">Select Nesting Bank</option>
                      {nestingBanks.map(bank => (
                        <option key={bank.id} value={bank.id}>
                          {bank.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Eggs</label>
                    <input
                      type="number"
                      name="num_of_eggs"
                      value={editForm.num_of_eggs ?? ""}
                      onChange={handleEditFormChange}
                      className="w-full border px-2 py-1 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Eggs Hatched</label>
                    <input
                      type="number"
                      name="num_of_eggs_hatched"
                      value={editForm.num_of_eggs_hatched ?? ""}
                      onChange={handleEditFormChange}
                      className="w-full border px-2 py-1 rounded"
                    />
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
                  <div className="md:col-span-2">
                    <label className="block text-xs mb-1">Notes</label>
                    <textarea
                      name="notes"
                      value={editForm.notes || ""}
                      onChange={handleEditFormChange}
                      className="w-full border px-2 py-1 rounded"
                      rows={2}
                    />
                  </div>
                </>
              )}
              <div className="md:col-span-2 flex justify-end gap-2 mt-4">
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
                  className="px-4 py-2 bg-green-900 text-white rounded hover:bg-green-800"
                >
                  {editLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Nesting Event</h3>
            <p className="mb-4 text-gray-700">
              Are you sure you want to delete this nesting event? This action cannot be undone.
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

      <RecaptureHistoryModal 
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        turtleId={selectedTurtleId}
      />
    </DefaultLayout>
  );
};

export default NestersPage;