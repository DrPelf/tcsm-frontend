import React, { useState, useRef, useEffect } from 'react';
import { IoFilter, IoClose } from "react-icons/io5";

const ColumnFilter = ({ options = [], selected = [], onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleOption = (option) => {
    const newSelected = selected.includes(option)
      ? selected.filter(item => item !== option)
      : [...selected, option];
    onChange(newSelected);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-1 rounded-md hover:bg-gray-100 ${selected.length > 0 ? 'text-[#4D6A4D]' : 'text-gray-400'}`}
        title="Filter"
      >
        <IoFilter className="w-4 h-4" />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
        >
          <div className="p-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-1 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#4D6A4D]"
            />
          </div>

          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500">
                No options available
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <label
                  key={index}
                  className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(option)}
                    onChange={() => handleToggleOption(option)}
                    className="rounded border-gray-300 text-[#4D6A4D] focus:ring-[#4D6A4D]"
                  />
                  <span className="ml-2 text-sm text-gray-700">{option}</span>
                </label>
              ))
            )}
          </div>

          {selected.length > 0 && (
            <div className="p-2 border-t border-gray-200">
              <button
                onClick={() => onChange([])}
                className="w-full px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
              >
                Clear selection
              </button>
            </div>
          )}
        </div>
      )}

      {selected.length > 0 && (
        <div className="absolute -top-1 -right-1 h-4 w-4 bg-[#4D6A4D] text-white rounded-full flex items-center justify-center text-xs">
          {selected.length}
        </div>
      )}
    </div>
  );
};

export default ColumnFilter; 