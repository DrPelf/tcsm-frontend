import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTurtleSpecies, createSpecies, updateSpecies, deleteSpecies } from "../../../redux/thunks/species.thunk";
import { Trash2, Edit3 } from "lucide-react";
import { toast } from "sonner";

const SpeciesManagement = () => {
  const dispatch = useDispatch();
  const { turtleSpecies, loading, error } = useSelector((state) => state.species);

  const [editingIndex, setEditingIndex] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [newSpeciesName, setNewSpeciesName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchTurtleSpecies()); 
  }, [dispatch]);

  const openDeleteModal = (species) => {
    setSelectedSpecies(species);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedSpecies && selectedSpecies.id) {
      try {
        await dispatch(deleteSpecies(selectedSpecies.id)).unwrap();
        toast.success("Species deleted successfully.");
        await dispatch(fetchTurtleSpecies());
      } catch (err) {
        toast.error("Failed to delete species: " + (err?.message || "Unknown error"));
      }
    }
    setShowDeleteModal(false);
    setSelectedSpecies(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedSpecies(null);
  };

  const openAddModal = () => {
    setShowAddModal(true);
  };

  const confirmAdd = async () => {
    if (newSpeciesName.trim()) {
      try {
        await dispatch(createSpecies(newSpeciesName)).unwrap();
        toast.success("Species added successfully.");
        await dispatch(fetchTurtleSpecies());
        setNewSpeciesName("");
        setShowAddModal(false);
      } catch (err) {
        if (err?.message?.toLowerCase().includes("already exists") || err?.error?.toLowerCase().includes("already exists") || err?.detail?.toLowerCase().includes("already exists")) {
          toast.error("A species with this name already exists.");
        } else {
          toast.error("Failed to add species: " + (err?.message || err?.error || "Unknown error"));
        }
      }
    }
  };

  const cancelAdd = () => {
    setNewSpeciesName("");
    setShowAddModal(false);
  };

  const handleEditSpecies = (index) => {
    setEditingIndex(index);
    setEditingValue(turtleSpecies[index].name);
  };

  const handleSaveEdit = async () => {
    if (editingIndex !== null && editingValue.trim()) {
      const species = turtleSpecies[editingIndex];
      try {
        await dispatch(updateSpecies({ id: species.id, name: editingValue })).unwrap();
        toast.success("Species updated successfully.");
        await dispatch(fetchTurtleSpecies());
      } catch (err) {
        if (err?.message?.toLowerCase().includes("already exists") || err?.error?.toLowerCase().includes("already exists") || err?.detail?.toLowerCase().includes("already exists")) {
          toast.error("A species with this name already exists.");
        } else {
          toast.error("Failed to update species: " + (err?.message || err?.error || "Unknown error"));
        }
      }
    }
    setEditingIndex(null);
    setEditingValue("");
  };

  const filteredSpecies = turtleSpecies.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <p>Loading species...</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-[#666639] mb-2">Species Management</h2>
      <p className="text-sm text-gray-500 mb-4">Manage turtle and terrapin species</p>
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search species..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[0.5] focus:ring-[#666639]"
        />
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-[#666639] text-white rounded-md hover:opacity-90"
        >
          Add New Species
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-[#F5F5F0]">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#666639]">Scientific Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#666639]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSpecies.length > 0 ? (
              filteredSpecies.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {editingIndex === index ? (
                      <input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-[0.5] focus:ring-[#666639]"
                      />
                    ) : (
                      item.name 
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 flex gap-2">
                    {editingIndex === index ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          className="text-white hover:text-white"
                          title="Save"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingIndex(null)}
                          className="text-[#666639] bg-white border-[#666639] rounded-md"
                          title="Cancel"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditSpecies(index)}
                          className="text-gray-500 hover:text-gray-700 bg-white hover:bg-[#F9FAFB]"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(item)}
                          className="text-gray-500 hover:text-gray-700 bg-white hover:bg-[#F9FAFB]"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="px-6 py-4 text-center text-sm text-gray-500">
                  No species found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirm Delete</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the species{" "}
              <span className="font-semibold">{selectedSpecies?.name}</span>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-[#666639] text-white rounded-md hover:opacity-90"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Species Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Species</h2>
            <input
              type="text"
              placeholder="Enter species name..."
              value={newSpeciesName}
              onChange={(e) => setNewSpeciesName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[0.5] focus:ring-[#666639] mb-4"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelAdd}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmAdd}
                className="px-4 py-2 bg-[#666639] text-white rounded-md hover:opacity-90"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeciesManagement;