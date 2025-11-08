import React, { useState } from "react";
import { Outlet, useLocation, useOutletContext } from "react-router-dom";
import DefaultLayout from "../../components/layout/DefaultLayout";
import AdminSidebar from "./sections/adminSidebar";
import UserManagement from "./sections/userManagement";
import SpeciesManagement from "./sections/speciesManagement";
import NestingBankManagement from "./sections/nestingBankManagement";
import { SPECIES_LIST } from "../../components/constants/SpeciesList";

const AdminDashboard = () => {
  const location = useLocation();
  const [users, setUsers] = useState([
    { id: 1, name: "Sarah Johnson", email: "sarah.johnson@example.com", role: "Admin", status: "Active" },
    { id: 2, name: "Michael Chen", email: "michael.chen@example.com", role: "User", status: "Active" },
    { id: 3, name: "Emma Rodriguez", email: "emma.rodriguez@example.com", role: "Admin", status: "Active" },
    { id: 4, name: "David Kim", email: "david.kim@example.com", role: "User", status: "Blocked" },
    { id: 5, name: "Lisa Patel", email: "lisa.patel@example.com", role: "User", status: "Active" },
  ]);

  const [species, setSpecies] = useState(SPECIES_LIST);
  const [newSpecies, setNewSpecies] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleAddSpecies = (speciesName) => {
    if (speciesName.trim() && !species.includes(speciesName.trim())) {
      setSpecies([...species, speciesName.trim()]);
      setNewSpecies("");
    }
  };

  const handleEditSpecies = (index) => {
    setEditingIndex(index);
    setEditingValue(species[index]);
  };

  const handleSaveEdit = () => {
    const updatedSpecies = [...species];
    updatedSpecies[editingIndex] = editingValue.trim();
    setSpecies(updatedSpecies);
    setEditingIndex(null);
    setEditingValue("");
  };

  const handleDeleteSpecies = (speciesName) => {
    const index = species.indexOf(speciesName);
    if (index !== -1) {
      const updatedSpecies = species.filter((_, i) => i !== index);
      setSpecies(updatedSpecies);
    }
  };

  const handleAction = (user, action) => {
    if (action === "block") {
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === user.id ? { ...u, status: "Blocked" } : u))
      );
    } else if (action === "unblock") {
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === user.id ? { ...u, status: "Active" } : u))
      );
    } else if (action === "makeAdmin") {
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === user.id ? { ...u, role: "Admin" } : u))
      );
    } else if (action === "delete") {
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
    }
  };

  // Render the appropriate component based on the current path
  const renderContent = () => {
    const path = location.pathname;

    if (path.includes("species-management")) {
      return (
        <SpeciesManagement
          species={species}
          newSpecies={newSpecies}
          editingIndex={editingIndex}
          editingValue={editingValue}
          setNewSpecies={setNewSpecies}
          handleAddSpecies={handleAddSpecies}
          handleEditSpecies={handleEditSpecies}
          handleSaveEdit={handleSaveEdit}
          handleDeleteSpecies={handleDeleteSpecies}
          setEditingIndex={setEditingIndex}
          setEditingValue={setEditingValue}
        />
      );
    } else if (path.includes("nesting-banks-management")) {
      return <NestingBankManagement />;
    } else {
      // Default to user management
      return (
        <UserManagement
          users={users}
          searchQuery={searchQuery}
          roleFilter={roleFilter}
          statusFilter={statusFilter}
          handleSearch={handleSearch}
          setRoleFilter={setRoleFilter}
          setStatusFilter={setStatusFilter}
          handleAction={handleAction}
        />
      );
    }
  };

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <DefaultLayout>
          <div className="bg-white rounded-lg p-6">
            {renderContent()}
          </div>
        </DefaultLayout>
      </div>
    </div>
  );
};

export default AdminDashboard;