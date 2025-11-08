import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser, toggleBlockUser } from "../../../redux/thunks/admin.thunk";
import { Lock, Unlock, Shield, Trash2 } from "lucide-react";

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.admin);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const openModal = (user, action) => {
    setSelectedUser(user);
    setActionType(action);
    setModalOpen(true);
  };

  const handleBlockUnblockUser = async () => {
    if (!selectedUser || (actionType !== "block" && actionType !== "unblock")) return;

    try {
      setActionInProgress(true);
      const isBlocked = actionType === "block";
      await dispatch(toggleBlockUser({ userId: selectedUser.id, isBlocked })).unwrap();
      setModalOpen(false);
    } catch (error) {
      console.error("Failed to block/unblock user:", error);
    } finally {
      setActionInProgress(false);
    }
  };

  const handleConfirmAction = async () => {
    switch (actionType) {
      case "delete":
        await dispatch(deleteUser(selectedUser.id)).unwrap();
        setModalOpen(false);
        break;
      case "block":
      case "unblock":
        await handleBlockUnblockUser();
        break;
      default:
        setModalOpen(false);
    }
  };

  if (loading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error.message || "Failed to load users"}</p>;
  }

  if (!Array.isArray(users)) {
    return <p className="text-gray-500">No users available</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-[#666639] mb-2">User Management</h2>
      <p className="text-sm text-gray-500 mb-4">Manage user accounts and permissions</p>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-[#F5F5F0]">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#666639]">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#666639]">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#666639]">Role</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#666639]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{user.role}</td>
                <td className="px-6 py-4 text-sm text-gray-900 flex gap-2">
                  {user.status === "Blocked" ? (
                    <button
                      onClick={() => openModal(user, "unblock")}
                      className="text-gray-500 hover:text-gray-700 bg-white hover:bg-[#F9FAFB]"
                      title="Unblock User"
                    >
                      <Unlock className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => openModal(user, "block")}
                      className="text-gray-500 hover:text-gray-700 bg-white hover:bg-[#F9FAFB]"
                      title="Block User"
                    >
                      <Lock className="w-4 h-4" />
                    </button>
                  )}
                  {user.role !== "Admin" && (
                    <button
                      onClick={() => openModal(user, "makeAdmin")}
                      className="text-gray-500 hover:text-gray-700 bg-white hover:bg-[#F9FAFB]"
                      title="Make Admin"
                    >
                      <Shield className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => openModal(user, "delete")}
                    className="text-gray-500 hover:text-gray-700 bg-white hover:bg-[#F9FAFB]"
                    title="Delete User"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {modalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {actionType === "block" && "Block User"}
              {actionType === "unblock" && "Unblock User"}
              {actionType === "makeAdmin" && "Make Admin"}
              {actionType === "delete" && "Delete User"}
            </h3>
            
            <div className="mb-6">
              {actionType === "block" && (
                <p className="text-gray-700">
                  Are you sure you want to block {selectedUser.name}? They will no longer be able to log in or use the system.
                </p>
              )}
              {actionType === "unblock" && (
                <p className="text-gray-700">
                  Are you sure you want to unblock {selectedUser.name}? This will restore their access to the system.
                </p>
              )}
              {actionType === "makeAdmin" && (
                <p className="text-gray-700">
                  Are you sure you want to make {selectedUser.name} an admin? This will grant them full access to all system features.
                </p>
              )}
              {actionType === "delete" && (
                <p className="text-gray-700">
                  Are you sure you want to delete {selectedUser.name}? This action cannot be undone.
                </p>
              )}
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
                onClick={handleConfirmAction}
                disabled={actionInProgress}
                className={`px-4 py-2 text-white rounded
                  ${actionType === "delete" ? "bg-red-600 hover:bg-red-700" : ""}
                  ${actionType === "block" ? "bg-orange-600 hover:bg-orange-700" : ""}
                  ${actionType === "unblock" ? "bg-green-600 hover:bg-green-700" : ""}
                  ${actionType === "makeAdmin" ? "bg-blue-600 hover:bg-blue-700" : ""}
                  ${actionInProgress ? "opacity-75 cursor-not-allowed" : ""}
                `}
              >
                {actionInProgress ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;