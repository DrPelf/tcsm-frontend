import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; 
import { useSelector, useDispatch } from "react-redux";
import { handleLogout } from "../redux/slices/auth.slice"; 
import SearchModal from "./SearchModal";
import FullRecordFormModal from "./FullRecordFormModal";
import { User, LogOut, Grid } from "lucide-react"; 
import { toast } from "sonner"; 
import logo from "../assets/logo.png";

const CustomNavbar = ({ onLoginClick }) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isFullFormModalOpen, setIsFullFormModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null); 
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get authentication state from Redux
  const { isAuthenticated, userData } = useSelector((state) => state.Auth);

  const handleAddRecordClick = () => {
    if (!isAuthenticated) {
      // Show toast notification if the user is not authenticated
      toast.error("You need to log in to add a record.", {
        position: "top-center",
      });
      return;
    }
    setIsSearchModalOpen(true); 
  };

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  const handleAddNewRecord = () => {
    setIsSearchModalOpen(false);
    setIsFullFormModalOpen(true);
  };

  const closeFullFormModal = () => {
    setIsFullFormModalOpen(false);
  };

  const handleLogoutClick = () => {
    dispatch(handleLogout()); 
    setIsDropdownOpen(false); 
    localStorage.removeItem("token");
    navigate("/"); 
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <div className="w-full mb-6">
        <div className="flex flex-row items-center justify-between gap-2 w-full">
          {/* Logo and Name */}
          <div className="flex items-center flex-shrink-0">
            <img
              src={logo}
              alt="Turtle Data Management System"
              className="h-10 md:h-12 mr-2 md:mr-6"
            />
            <h1 className="text-xl md:text-2xl text-[#666639] font-domine whitespace-nowrap">
              <span className="hidden sm:inline">Turtle Data Management System</span>
              <span className="inline sm:hidden">TDMS</span>
            </h1>
          </div>
          {/* Nav Links (desktop, centered) */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="bg-[#F0F0E4] rounded-full flex items-center gap-2 px-2 md:px-4 py-1 md:py-2">
              <Link
                to="/"
                className="px-2 md:px-4 py-1 text-[#666639] text-sm md:text-base hover:opacity-75"
              >
                Home
              </Link>
              <Link
                to="/captured-turtles"
                className="px-2 md:px-4 py-1 text-[#666639] text-sm md:text-base hover:opacity-75"
              >
                Turtles
              </Link>
              <Link
                to="/terrapins"
                className={`px-2 md:px-4 py-1 text-[#666639] text-sm md:text-base hover:opacity-75 ${location.pathname === "/terrapins" ? "active" : ""}`}
              >
                Terrapins
              </Link>
              <Link
                to="/nesters"
                className={`px-2 md:px-4 py-1 text-[#666639] text-sm md:text-base hover:opacity-75 ${location.pathname === "/nesters" ? "active" : ""}`}
              >
                Nesters
              </Link>
            </div>
          </div>
          {/* Action Buttons and Hamburger */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleAddRecordClick}
              className="bg-white text-[#666639] border border-[#E5E5E5] hover:bg-[#F5F5F0] px-4 py-2 rounded-md text-sm md:text-base"
            >
              Add Record
            </button>
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="bg-[#F5F5F0] p-2 rounded-full hover:bg-gray-200"
                  title={userData?.name || "Profile"}
                >
                  <User className="w-6 h-6 text-[#666639]" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg w-48">
                    {userData?.role === "admin" && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Grid className="w-4 h-4 text-green-600" />
                        Dashboard
                      </Link>
                    )}
                    <hr className="my-1 border-gray-200" />
                    <button
                      onClick={handleLogoutClick}
                      className="flex items-center gap-2 px-4 py-2 bg-white text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="bg-[#666639] text-white px-4 py-2 rounded-md text-sm md:text-base hover:opacity-90"
              >
                Log In
              </button>
            )}
            {/* Hamburger menu button - only visible on mobile */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-md text-[#666639] bg-white hover:bg-[#F5F5F0] border border-[#E5E5E5]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile nav links dropdown */}
        {isMobileMenuOpen && (
          <div className="flex flex-col bg-[#F0F0E4] rounded-2xl max-w-xs w-auto mx-auto gap-1 py-2 mt-2 z-40 md:hidden">
            <Link to="/" className="px-4 py-2 text-[#666639] text-base hover:opacity-75 text-center" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/captured-turtles" className="px-4 py-2 text-[#666639] text-base hover:opacity-75 text-center" onClick={() => setIsMobileMenuOpen(false)}>Turtles</Link>
            <Link to="/terrapins" className={`px-4 py-2 text-[#666639] text-base hover:opacity-75 text-center ${location.pathname === "/terrapins" ? "active" : ""}`} onClick={() => setIsMobileMenuOpen(false)}>Terrapins</Link>
            <Link to="/nesters" className={`px-4 py-2 text-[#666639] text-base hover:opacity-75 text-center ${location.pathname === "/nesters" ? "active" : ""}`} onClick={() => setIsMobileMenuOpen(false)}>Nesters</Link>
          </div>
        )}
      </div>
      {/* Search Modal with Recapture Form */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={closeSearchModal}
        onAddNewRecord={handleAddNewRecord}
      />
      {/* Full Form Modal */}
      <FullRecordFormModal isOpen={isFullFormModalOpen} onClose={closeFullFormModal} />
    </>
  );
};

export default CustomNavbar;