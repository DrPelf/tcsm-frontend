import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Users, List, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (location.pathname === "/admin" || location.pathname === "/admin/") {
      navigate("/admin/user-management");
    }
  }, [location.pathname, navigate]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`h-screen bg-[#F5F5F0] border-r border-gray-200 ${
        isCollapsed ? "w-16" : "w-64"
      } transition-all duration-300 flex flex-col`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-300">
        {!isCollapsed && <span className="text-lg font-bold text-[#666639]">Admin Dashboard</span>}
        <button
          onClick={toggleSidebar}
          className="text-white-500 focus:outline-none"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 overflow-hidden">
        <ul className="p-2">
          <li className="mt-2">
            <NavLink
              to="/admin/user-management"
              className={({ isActive }) => 
                `flex items-center ${isCollapsed ? "justify-center" : ""} p-2 rounded-md ${
                  isActive
                    ? "bg-[#666639] text-white"
                    : "text-[#666639] hover:bg-white"
                }`
              }
            >
              <div className="min-w-6 flex justify-center">
                <Users className="w-5 h-5" />
              </div>
              {!isCollapsed && <span className="ml-3">User Management</span>}
            </NavLink>
          </li>
          <li className="mt-2">
            <NavLink
              to="/admin/species-management"
              className={({ isActive }) =>
                `flex items-center ${isCollapsed ? "justify-center" : ""} p-2 rounded-md ${
                  isActive
                    ? "bg-[#666639] text-white"
                    : "text-[#666639] hover:bg-white"
                }`
              }
            >
              <div className="min-w-6 flex justify-center">
                <List className="w-5 h-5" />
              </div>
              {!isCollapsed && <span className="ml-3">Species Management</span>}
            </NavLink>
          </li>
          <li className="mt-2">
            <NavLink
              to="/admin/nesting-banks-management"
              className={({ isActive }) =>
                `flex items-center ${isCollapsed ? "justify-center" : ""} p-2 rounded-md ${
                  isActive
                    ? "bg-[#666639] text-white"
                    : "text-[#666639] hover:bg-white"
                }`
              }
            >
              <div className="min-w-6 flex justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              {!isCollapsed && <span className="ml-3">Nesting Banks</span>}
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;