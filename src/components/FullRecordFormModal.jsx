import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchNestingBanks } from "../redux/thunks/nestingBank.thunk";
import { fetchTurtleSpecies } from "../redux/thunks/species.thunk";
import { createTurtle } from "../redux/thunks/turtle.thunk";
import { createCapture } from "../redux/thunks/captures.thunk";
import { createNestingEvent, fetchNestingEvents } from '../redux/thunks/nestingEvent.thunk';
import { createHatchling } from "../redux/thunks/hatchling.thunk";
import { fetchHatchlings } from "../redux/thunks/hatchling.thunk";
import { fetchHatchlingsPerYear } from '../redux/thunks/analysis.thunk';
import { GENDER_OPTIONS, ACTION_OPTIONS } from "./constants/SpeciesList";
import { toast } from "sonner"; 
import { fetchHeatmapData } from '../redux/thunks/map.thunk';
import { fetchStatsSummary, fetchSpeciesDistribution, fetchConservationProgress, fetchNestingEventsVsBank } from '../redux/thunks/analysis.thunk';
import { fetchAllCaptures } from "../redux/thunks/captures.thunk"; 

const FullRecordFormModal = ({ isOpen, onClose, existingRecord = null }) => {
  const dispatch = useDispatch();
  const { nestingBanks, loading: nestingBanksLoading } = useSelector((state) => state.nestingBank);
  const { turtleSpecies, loading: speciesLoading } = useSelector((state) => state.species);
  const token = useSelector((state) => state.Auth?.token || null);

  const [recordType, setRecordType] = useState('turtle'); 
  const [isNester, setIsNester] = useState(existingRecord?.numberOfEggs ? true : false);
  const [formData, setFormData] = useState({
    // Shared fields
    species: "",
    microchipId: "",
    gender: "",
    weight: "",
    scl: "",
    scw: "",
    ccl: "",
    ccw: "",
    notes: "",
    latitude: "",
    longitude: "",

    // Turtle-specific fields
    date: "",
    capturedBy: "",
    area: "",
    status: "",
    numberOfEggs: "",
    nestingBank: "",
    furtherAction: "",

    // Terrapin-specific fields
    yearHatched: "",
    dateOfFirstRelease: "",
    pointOfRelease: ""
  });

  //bounds for Malaysia
  const MALAYSIA_BOUNDS = {
    north: 7.363417,
    south: 0.855222,
    west: 99.643056,
    east: 119.267502
  };
  
  // Fetch nesting banks and species data when modal opens
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchNestingBanks());
      dispatch(fetchTurtleSpecies());
    }
  }, [isOpen, dispatch]);

  // Initialize form data with existing record if provided
  useEffect(() => {
    if (existingRecord) {
      setFormData(existingRecord);
      setRecordType(existingRecord.yearHatched ? 'terrapin' : 'turtle');
      setIsNester(existingRecord.numberOfEggs ? true : false);
    }
  }, [existingRecord]);
  
  // Reset state when modal is closed
  const handleClose = () => {
    setRecordType('turtle');
    setIsNester(false);
    setFormData({
      species: "",
      microchipId: "",
      gender: "",
      weight: "",
      scl: "",
      scw: "",
      ccl: "",
      ccw: "",
      notes: "",
      latitude: "",
      longitude: "",
      date: "",
      capturedBy: "",
      area: "",
      status: "",
      numberOfEggs: "",
      nestingBank: "",
      furtherAction: "",
      yearHatched: "",
      dateOfFirstRelease: "",
      pointOfRelease: ""
    });
    onClose();
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Allow null values for specific fields
    const nullableFields = ["scl", "scw", "ccl", "ccw", "notes"];
    setFormData((prev) => ({
      ...prev,
      [name]: nullableFields.includes(name) && value === "" ? null : value,
    }));
  };

  // Helper function to check if a value is a valid number
  const isValidNumber = (value) => {
    if (!value) return true; // Empty values are allowed
    const num = parseFloat(value);
    return !isNaN(num) && num > 0;
  };

  // Validation function
  const validateForm = () => {
    // Required field validation
    if (!formData.species) {
      toast.error("Species is required.");
      return false;
    }

    if (recordType === 'turtle' && !formData.gender) {
      toast.error("Gender is required for turtles.");
      return false;
    }

    if (recordType === 'turtle' && !formData.date) {
      toast.error("Date of sighting/capture is required for turtles.");
      return false;
    }

    // Status vs Action validation for turtles
    if (recordType === 'turtle' && !isNester) {
      if (formData.status === "Dead" && formData.furtherAction === "Released") {
        toast.error("A dead turtle cannot be released.");
        return false;
      }
      if (formData.status === "Dead" && formData.furtherAction === "Rehab") {
        toast.error("A dead turtle cannot be sent to rehabilitation.");
        return false;
      }
      if (formData.status === "Alive" && formData.furtherAction === "Buried") {
        toast.error("An alive turtle cannot be buried.");
        return false;
      }
    }

    // Nesting turtle validation (only applies when nesting checkbox is checked)
    if (isNester) {
      if (formData.gender !== "Female") {
        toast.error("Nesting turtles must be female.");
        return false;
      }
      if (formData.status !== "Alive") {
        toast.error("Nesting turtles must be alive.");
        return false;
      }
      if (!formData.nestingBank) {
        toast.error("Nesting bank is required for nesting turtles.");
        return false;
      }
      if (!formData.numberOfEggs || parseInt(formData.numberOfEggs) <= 0) {
        toast.error("Number of eggs must be greater than 0 for nesting turtles.");
        return false;
      }
    }

    // Measurement validation
    const measurements = [
      { field: 'weight', value: formData.weight, name: 'Weight' },
      { field: 'scl', value: formData.scl, name: 'SCL' },
      { field: 'scw', value: formData.scw, name: 'SCW' },
      { field: 'ccl', value: formData.ccl, name: 'CCL' },
      { field: 'ccw', value: formData.ccw, name: 'CCW' }
    ];

    for (const measurement of measurements) {
      if (!isValidNumber(measurement.value)) {
        toast.error(`${measurement.name} must be a valid number.`);
        return false;
      }
    }

    // Terrapin validation
    if (recordType === 'terrapin') {
      if (!formData.yearHatched) {
        toast.error("Year hatched is required for terrapins.");
        return false;
      }
      const currentYear = new Date().getFullYear();
      const hatchedYear = parseInt(formData.yearHatched);
      if (hatchedYear > currentYear) {
        toast.error("Year hatched cannot be in the future.");
        return false;
      }
      if (hatchedYear < 1900) {
        toast.error("Year hatched seems too far in the past.");
        return false;
      }
      if (formData.dateOfFirstRelease) {
        const releaseDate = new Date(formData.dateOfFirstRelease);
        const releaseYear = releaseDate.getFullYear();
        const currentDate = new Date();
        
        // Check if release date is in the future
        if (releaseDate > currentDate) {
          toast.error("Date of release cannot be in the future.");
          return false;
        }
        
        if (hatchedYear > releaseYear) {
          toast.error("Date of release cannot be earlier than the year hatched.");
          return false;
        }
        // Additional check: if same year, ensure release date is not before January 1st of hatched year
        if (hatchedYear === releaseYear) {
          const hatchedYearStart = new Date(hatchedYear, 0, 1); // January 1st of hatched year
          if (releaseDate < hatchedYearStart) {
            toast.error("Date of release cannot be earlier than the year hatched.");
            return false;
          }
        }
      }
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Run validation first
    if (!validateForm()) {
      return;
    }

    // Validate coordinates for turtle records
    if (recordType === 'turtle') {
      const lat = formData.latitude === "" ? null : Number(formData.latitude);
      const lng = formData.longitude === "" ? null : Number(formData.longitude);

      // Only check bounds if not null and not 0
      if (
        lat !== null && lat !== 0 &&
        (lat < MALAYSIA_BOUNDS.south || lat > MALAYSIA_BOUNDS.north)
      ) {
        toast.error("Latitude must be within Malaysia bounds.");
        return;
      }
      if (
        lng !== null && lng !== 0 &&
        (lng < MALAYSIA_BOUNDS.west || lng > MALAYSIA_BOUNDS.east)
      ) {
        toast.error("Longitude must be within Malaysia bounds.");
        return;
      }
    }

    // Prepare the turtle data
    const turtleData = {
      microchip_id: formData.microchipId || null,
      species_id: parseInt(formData.species), 
      gender: formData.gender,
      status: formData.status || "Alive", 
      remarks: formData.capturedBy || "",
    };

    // Dispatch the createTurtle thunk
    dispatch(createTurtle(turtleData))
      .unwrap()
      .then((turtleResponse) => {
        // Extract the turtle_id from the response
        const turtle_id = turtleResponse.id;

        if (recordType === 'terrapin') {
          // Create hatchling record for terrapin
          const hatchlingData = {
            turtle_id,
            year_hatched: parseInt(formData.yearHatched) || new Date().getFullYear(),
            date_first_release: formData.dateOfFirstRelease || new Date().toISOString().split('T')[0],
            weight_kg: formData.weight ? parseFloat(formData.weight) : 0,
            notes: formData.notes || "",
            scl: formData.scl ? parseFloat(formData.scl) : 0,
            scw: formData.scw ? parseFloat(formData.scw) : 0,
            ccl: formData.ccl ? parseFloat(formData.ccl) : 0,
            ccw: formData.ccw ? parseFloat(formData.ccw) : 0,
          };

          console.log("Creating hatchling with data:", hatchlingData);

          dispatch(createHatchling(hatchlingData))
            .unwrap()
            .then(() => {
              toast.success("Terrapin record added successfully!");
              dispatch(fetchHeatmapData());
              dispatch(fetchStatsSummary());
              dispatch(fetchSpeciesDistribution());
              dispatch(fetchConservationProgress());
              dispatch(fetchNestingEventsVsBank());
              dispatch(fetchHatchlings());
              dispatch(fetchHatchlingsPerYear());
              dispatch(fetchAllCaptures()); 
              handleClose();
            })
            .catch((error) => {
              console.error("Failed to create hatchling record:", error);
              console.error("Error details:", error.detail);
              toast.error("Failed to add terrapin record. Please try again.");
            });
        } else {
          // Prepare the capture data for regular turtle
          const captureData = {
            turtle_id,
            date_of_capture: formData.date,
            captured_by: formData.capturedBy || "",
            area_of_capture: formData.area || "",
            further_action: formData.furtherAction || "Released",
            notes: formData.notes || "",
            weight_kg: formData.weight ? parseFloat(formData.weight) : null,
            scl: formData.scl ? parseFloat(formData.scl) : null,
            scw: formData.scw ? parseFloat(formData.scw) : null,
            ccl: formData.ccl ? parseFloat(formData.ccl) : null,
            ccw: formData.ccw ? parseFloat(formData.ccw) : null,
            latitude: Number(formData.latitude) || 0,
            longitude: Number(formData.longitude) || 0
          };

          // Dispatch the createCapture thunk
          dispatch(createCapture(captureData))
            .unwrap()
            .then((captureResponse) => {
              console.log("Capture record created successfully:", captureResponse);

              // If this is a nesting turtle, create a nesting event
              if (isNester) {
                const parseNum = (val, fallback = 0) =>
                  val === "" || val === null || val === undefined ? fallback : Number(val);

                const nestingEventData = {
                  turtle_id: turtle_id,
                  nesting_date: formData.date || null,
                  nesting_bank_id: parseNum(formData.nestingBank),
                  num_of_eggs: parseNum(formData.numberOfEggs),
                  num_of_eggs_hatched: 0,
                  notes: formData.notes || "",
                  weight_kg: parseNum(formData.weight),
                  scl: parseNum(formData.scl),
                  scw: parseNum(formData.scw),
                  ccl: parseNum(formData.ccl),
                  ccw: parseNum(formData.ccw),
                  latitude: Number(formData.latitude) || 0,
                  longitude: Number(formData.longitude) || 0,
                };

                console.log("Creating nesting event with data:", nestingEventData);

                dispatch(createNestingEvent(nestingEventData))
                  .unwrap()
                  .then(() => {
                    toast.success("Nesting turtle record added successfully!");
                    dispatch(fetchHeatmapData());
                    dispatch(fetchStatsSummary());
                    dispatch(fetchSpeciesDistribution());
                    dispatch(fetchConservationProgress());
                    dispatch(fetchNestingEventsVsBank());
                    dispatch(fetchNestingEvents());
                    handleClose();
                  })
                  .catch((error) => {
                    console.error("Failed to create nesting event record:", error);
                    console.error("Error details:", error.detail);
                    toast.error("Failed to add nesting turtle record. Please try again.");
                  });
              } else {
                toast.success("Turtle record added successfully!");
                dispatch(fetchHeatmapData());
                dispatch(fetchStatsSummary());
                dispatch(fetchSpeciesDistribution());
                dispatch(fetchConservationProgress());
                dispatch(fetchNestingEventsVsBank());
                dispatch(fetchAllCaptures()); 
                handleClose();
              }
            })
            .catch((error) => {
              console.error("Failed to create capture record:", error);
              toast.error("Failed to add turtle record. Please try again.");
            });
        }
      })
      .catch((error) => {
        console.error("Failed to create turtle record:", error);
        toast.error("Failed to add record. Please try again.");
      });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1100]">
      <div className="bg-white rounded-lg p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-gray-700">
            {existingRecord ? "Edit record" : "Add a new record"}
          </h2>
          <button onClick={handleClose} className="text-white ">
            ✕
          </button>
        </div>

        {/* Record Type Toggle */}
        <div className="flex gap-4 mb-6">
          <button
            type="button"
            className={`px-4 py-2 rounded-md ${
              recordType === 'turtle'
                ? 'bg-[#666639] text-white'
                : 'bg-white text-[#666639] border border-[#666639]'
            }`}
            onClick={() => setRecordType('turtle')}
          >
            {existingRecord ? "Edit Turtle" : "Add Turtle"}
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-md ${
              recordType === 'terrapin'
                ? 'bg-[#666639] text-white'
                : 'bg-white text-[#666639] border border-[#666639]'
            }`}
            onClick={() => setRecordType('terrapin')}
          >
            {existingRecord ? "Edit Terrapin" : "Add Terrapin"}
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Species</label>
                <select 
                  name="species"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                  value={formData.species}
                  onChange={handleChange}
                >
                  <option value="">Select Species</option>
                  {speciesLoading ? (
                    <option>Loading...</option>
                  ) : (
                    turtleSpecies.map((species) => (
                      <option key={species.id} value={species.id}>
                        {species.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {recordType === 'terrapin' && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Year Hatched</label>
                  <input 
                    type="number" 
                    name="yearHatched"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                    placeholder="YYYY"
                    value={formData.yearHatched}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Microchip ID</label>
                <input 
                  type="text" 
                  name="microchipId"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                  value={formData.microchipId}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Gender</label>
                <div className="flex gap-4">
                  {GENDER_OPTIONS.map(option => (
                    <label key={option} className="inline-flex items-center">
                      <input 
                        type="radio" 
                        name="gender" 
                        value={option} 
                        className="mr-2"
                        checked={formData.gender === option}
                        onChange={handleChange}
                      />
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              {recordType === 'terrapin' ? (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Date of First Release</label>
                  <input 
                    type="date" 
                    name="dateOfFirstRelease"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                    value={formData.dateOfFirstRelease}
                    onChange={handleChange}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Date of sighting/capture</label>
                    <input 
                      type="date" 
                      name="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                      value={formData.date}
                      onChange={handleChange}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Captured/Surrendered by</label>
                    <input 
                      type="text" 
                      name="capturedBy"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                      placeholder="Enter details about capture or surrender"
                      value={formData.capturedBy}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Area of sighting/capture</label>
                    <input 
                      type="text" 
                      name="area"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                      placeholder="Enter location of sighting or capture"
                      value={formData.area}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}
            </div>
            
            {/* Right Column */}
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Weight (kg)</label>
                <input 
                  type="number" 
                  name="weight"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
                    formData.weight && !isValidNumber(formData.weight) 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-300'
                  }`}
                  step="0.001"
                  value={formData.weight}
                  onChange={handleChange}
                />
                {formData.weight && !isValidNumber(formData.weight) && (
                  <p className="text-xs text-red-500 mt-1">Please enter a valid positive number</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">SCL (cm)</label>
                  <input 
                    type="number" 
                    name="scl"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
                      formData.scl && !isValidNumber(formData.scl) 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-300'
                    }`}
                    step="0.1"
                    value={formData.scl}
                    onChange={handleChange}
                  />
                  {formData.scl && !isValidNumber(formData.scl) && (
                    <p className="text-xs text-red-500 mt-1">Please enter a valid positive number</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">SCW (cm)</label>
                  <input 
                    type="number" 
                    name="scw"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
                      formData.scw && !isValidNumber(formData.scw) 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-300'
                    }`}
                    step="0.1"
                    value={formData.scw}
                    onChange={handleChange}
                  />
                  {formData.scw && !isValidNumber(formData.scw) && (
                    <p className="text-xs text-red-500 mt-1">Please enter a valid positive number</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">CCL (cm)</label>
                  <input 
                    type="number" 
                    name="ccl"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
                      formData.ccl && !isValidNumber(formData.ccl) 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-300'
                    }`}
                    step="0.1"
                    value={formData.ccl}
                    onChange={handleChange}
                  />
                  {formData.ccl && !isValidNumber(formData.ccl) && (
                    <p className="text-xs text-red-500 mt-1">Please enter a valid positive number</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">CCW (cm)</label>
                  <input 
                    type="number" 
                    name="ccw"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
                      formData.ccw && !isValidNumber(formData.ccw) 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-300'
                    }`}
                    step="0.1"
                    value={formData.ccw}
                    onChange={handleChange}
                  />
                  {formData.ccw && !isValidNumber(formData.ccw) && (
                    <p className="text-xs text-red-500 mt-1">Please enter a valid positive number</p>
                  )}
                </div>
              </div>

              {recordType === 'turtle' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Latitude</label>
                    <input 
                      type="number" 
                      name="latitude"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                      step="0.000001"
                      value={formData.latitude}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Longitude</label>
                    <input 
                      type="number" 
                      name="longitude"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                      step="0.000001"
                      value={formData.longitude}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}

              {recordType === 'terrapin' && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Point of Release</label>
                  <input 
                    type="text" 
                    name="pointOfRelease"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                    placeholder="Enter release location"
                    value={formData.pointOfRelease}
                    onChange={handleChange}
                  />
                </div>
              )}

              {recordType === 'turtle' && (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Status</label>
                    <div className="flex gap-4">
                      <label className="inline-flex items-center">
                        <input 
                          type="radio" 
                          name="status" 
                          value="Alive" 
                          className="mr-2"
                          checked={formData.status === "Alive"}
                          onChange={handleChange}
                        />
                        Alive
                      </label>
                      <label className="inline-flex items-center">
                        <input 
                          type="radio" 
                          name="status" 
                          value="Dead" 
                          className="mr-2"
                          checked={formData.status === "Dead"}
                          onChange={handleChange}
                        />
                        Dead
                      </label>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2"
                        checked={isNester}
                        onChange={() => {
                          setIsNester(!isNester);
                          if (!isNester) {
                            // When checked, set gender to Female and status to Alive
                            setFormData((prev) => ({
                              ...prev,
                              gender: "Female",
                              status: "Alive",
                            }));
                          }
                        }}
                      />
                      <span className="text-gray-700">Is this a nesting turtle?</span>
                    </label>
                    {isNester && (
                      <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                        <p className="text-xs text-blue-700">
                          ✓ Nesting turtles are automatically set to Female and Alive status
                        </p>
                      </div>
                    )}
                  </div>

                  {isNester && (
                    <>
                      <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Number of Eggs</label>
                        <input 
                          type="number" 
                          name="numberOfEggs"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                          value={formData.numberOfEggs}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Nesting Bank</label>
                        <select 
                          name="nestingBank"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                          value={formData.nestingBank}
                          onChange={handleChange}
                        >
                          <option value="">Select Nesting Bank</option>
                          {nestingBanksLoading ? (
                            <option>Loading...</option>
                          ) : (
                            nestingBanks.map(bank => (
                              <option key={bank.id} value={bank.id}>
                                {bank.name}
                              </option>
                            ))
                          )}
                        </select>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-gray-700 mb-2">Notes</label>
            <textarea 
              name="notes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none h-24" 
              placeholder="Enter any additional notes or observations"
              value={formData.notes}
              onChange={handleChange}
            ></textarea>
          </div>

          {recordType === 'turtle' && !isNester && (
            <div className="mt-6">
              <label className="block text-gray-700 mb-2">Further action</label>
              <select 
                name="furtherAction"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                value={formData.furtherAction}
                onChange={handleChange}
              >
                <option value="">Select action</option>
                {ACTION_OPTIONS.map(action => {
                  // Disable invalid combinations
                  const isDisabled = 
                    (formData.status === "Dead" && (action === "Released" || action === "Rehab")) ||
                    (formData.status === "Alive" && action === "Buried");
                  
                  return (
                    <option 
                      key={action} 
                      value={action}
                      disabled={isDisabled}
                      className={isDisabled ? "text-gray-400" : ""}
                    >
                      {action}
                      {isDisabled && " (Invalid for current status)"}
                    </option>
                  );
                })}
              </select>
              {formData.status && formData.furtherAction && (
                <p className="text-xs text-gray-500 mt-1">
                  {formData.status === "Dead" && formData.furtherAction === "Released" && "⚠️ Dead turtles cannot be released"}
                  {formData.status === "Dead" && formData.furtherAction === "Rehab" && "⚠️ Dead turtles cannot be sent to rehabilitation"}
                  {formData.status === "Alive" && formData.furtherAction === "Buried" && "⚠️ Alive turtles cannot be buried"}
                </p>
              )}
            </div>
          )}
          
          <div className="flex justify-end gap-4 mt-6">
            <button 
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700  rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="bg-[#666639] text-white px-4 py-2 rounded-md hover:opacity-90"
            >
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FullRecordFormModal;