import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNestingBanks, createNestingBank, updateNestingBank, deleteNestingBank } from "../../../redux/thunks/nestingBank.thunk";
import { Trash2, Edit3 } from "lucide-react";
import { toast } from "sonner";

const NestingBankManagement = () => {
  const dispatch = useDispatch();
  const { nestingBanks, loading, error } = useSelector((state) => state.nestingBank);

  const [editingIndex, setEditingIndex] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [newNestingBank, setNewNestingBank] = useState("");

  useEffect(() => {
    dispatch(fetchNestingBanks()); 
  }, [dispatch]);

  const openDeleteModal = (bank) => {
    setSelectedBank(bank);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedBank && selectedBank.id) {
      try {
        await dispatch(deleteNestingBank(selectedBank.id)).unwrap();
        toast.success("Nesting bank deleted successfully.");
        await dispatch(fetchNestingBanks());
      } catch (err) {
        toast.error("Failed to delete nesting bank: " + (err?.message || "Unknown error"));
      }
    }
    setShowDeleteModal(false);
    setSelectedBank(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedBank(null);
  };

  const openAddModal = () => {
    setShowAddModal(true);
  };

  const confirmAdd = async () => {
    if (newNestingBank.trim()) {
      try {
        await dispatch(createNestingBank(newNestingBank)).unwrap();
        toast.success("Nesting bank added successfully.");
        await dispatch(fetchNestingBanks());
        setNewNestingBank("");
        setShowAddModal(false);
      } catch (err) {
        if (err?.message?.toLowerCase().includes("already exists") || err?.error?.toLowerCase().includes("already exists") || err?.detail?.toLowerCase().includes("already exists")) {
          toast.error("A nesting bank with this name already exists.");
        } else {
          toast.error("Failed to add nesting bank: " + (err?.message || err?.error || "Unknown error"));
        }
      }
    }
  };

  const cancelAdd = () => {
    setNewNestingBank("");
    setShowAddModal(false);
  };

  const handleEditNestingBank = (index) => {
    setEditingIndex(index);
    setEditingValue(nestingBanks[index].name);
  };

  const handleSaveEdit = async () => {
    if (editingIndex !== null && editingValue.trim()) {
      const bank = nestingBanks[editingIndex];
      try {
        await dispatch(updateNestingBank({ id: bank.id, name: editingValue })).unwrap();
        toast.success("Nesting bank updated successfully.");
        await dispatch(fetchNestingBanks());
      } catch (err) {
        if (err?.message?.toLowerCase().includes("already exists") || err?.error?.toLowerCase().includes("already exists") || err?.detail?.toLowerCase().includes("already exists")) {
          toast.error("A nesting bank with this name already exists.");
        } else {
          toast.error("Failed to update nesting bank: " + (err?.message || err?.error || "Unknown error"));
        }
      }
    }
    setEditingIndex(null);
    setEditingValue("");
  };

  const filteredNestingBanks = nestingBanks.filter((bank) =>
    (bank.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <p>Loading nesting banks...</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-[#666639] mb-2">Nesting Banks Management</h2>
      <p className="text-sm text-gray-500 mb-4">Manage nesting locations</p>
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search nesting banks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[0.5] focus:ring-[#666639]"
        />
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-[#666639] text-white rounded-md hover:opacity-90"
        >
          Add New Nesting Bank
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-[#F5F5F0]">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#666639]">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#666639]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredNestingBanks.length > 0 ? (
              filteredNestingBanks.map((bank, index) => (
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
                      bank.name
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
                          onClick={() => handleEditNestingBank(index)}
                          className="text-gray-500 hover:text-gray-700 bg-white hover:bg-[#F9FAFB]"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(bank)}
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
                  No nesting banks found
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
              Are you sure you want to delete the nesting bank{" "}
              <span className="font-semibold">{selectedBank?.name}</span>?
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

      {/* Add Nesting Bank Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Nesting Bank</h2>
            <input
              type="text"
              placeholder="Enter nesting bank name..."
              value={newNestingBank}
              onChange={(e) => setNewNestingBank(e.target.value)}
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

export default NestingBankManagement;