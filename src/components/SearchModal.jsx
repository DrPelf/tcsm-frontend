import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCaptureByMicrochipId } from "../redux/thunks/recapture.thunk";
import { fetchTurtleByMicrochip } from "../redux/thunks/turtle.thunk";
import { setTurtle, clearTurtle } from "../redux/slices/turtle.slice";
import { resetRecaptureState } from "../redux/slices/recapture.slice";
import RecaptureForm from "./RecaptureForm";
import CaptureForm from "./CaptureForm";
import { IoSearch } from "react-icons/io5";

const SearchModal = ({ isOpen, onClose, onAddNewRecord }) => {
  const dispatch = useDispatch();
  const { captureRecord, loading: recaptureLoading, error: recaptureError } = useSelector((state) => state.recapture);
  const { turtle, loading: turtleLoading, error: turtleError } = useSelector((state) => state.turtle);

  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery) return;
    setShowResults(false);
    setLoading(true);

    try {
      // Always fetch both turtle and capture data
      const [captureResult, turtleResult] = await Promise.all([
        dispatch(fetchCaptureByMicrochipId(searchQuery)).unwrap().catch(() => null),
        dispatch(fetchTurtleByMicrochip(searchQuery)).unwrap().catch(() => null)
      ]);

      if (captureResult) {
        dispatch({ type: 'recapture/setCaptureRecord', payload: captureResult });
      } 
      if (turtleResult && turtleResult.data) {
        dispatch(setTurtle(turtleResult.data));
      }
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
      setShowResults(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    setShowResults(false);
    dispatch(resetRecaptureState());
    dispatch(clearTurtle());
    onClose();
  };

  const renderSearchResults = () => {
    if (!showResults) return null;

    // If there's a capture record, show recapture form
    if (captureRecord) {
      return <RecaptureForm 
        turtle={turtle}
        captureRecord={captureRecord}
        onClose={onClose}
      />;
    }

    // If there's a turtle record, show capture form
    if (turtle) {
      return <CaptureForm 
        turtle={turtle}
        onClose={onClose}
      />;
    }

    // Show no records found
    return (
      <div className="mb-6">
        <p className="text-gray-700">
          {(recaptureError && turtleError) 
            ? "An error occurred while searching" 
            : `No records found for "${searchQuery}".`}
        </p>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1100]">
      <div className="bg-white rounded-lg p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-gray-700">
            Recapture Search
          </h2>
          <button onClick={handleClose} className="text-white hover:text-white">
            ✕
          </button>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Microchip ID</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#666639]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={recaptureLoading || turtleLoading}
            />
            <button 
              className="bg-[#666639] text-white px-4 py-2 rounded-md hover:opacity-90 flex items-center"
              onClick={handleSearch}
              disabled={(recaptureLoading || turtleLoading) || !searchQuery}
            >
              <IoSearch className="w-5 h-5 mr-2" />
              {(recaptureLoading || turtleLoading) ? "Searching..." : "Search"}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">Search with a microchip ID.</p>
        </div>

        {renderSearchResults()}

        <div className="flex justify-end">
          <button 
            onClick={onAddNewRecord}
            className="bg-[#666639] text-white px-4 py-2 rounded-md hover:opacity-90"
          >
            Add New Record
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;