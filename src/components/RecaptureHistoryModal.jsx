import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecapturesByTurtleId, updateRecapture } from "../redux/thunks/recapture.thunk";
import { fetchStatsSummary, fetchSpeciesDistribution, fetchConservationProgress, fetchNestingEventsVsBank, fetchCapturesSummary } from "../redux/thunks/analysis.thunk";
import { X, Edit2 } from "lucide-react";
import { toast } from "sonner";

const RecaptureHistoryModal = ({ isOpen, onClose, turtleId }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const dispatch = useDispatch();
  const { recaptures, loading, updateLoading } = useSelector((state) => state.recapture);
  const { userData } = useSelector((state) => state.Auth);

  useEffect(() => {
    if (isOpen && turtleId) {
      dispatch(fetchRecapturesByTurtleId(turtleId));
    }
  }, [dispatch, turtleId, isOpen]);

  const handleEditClick = (recap) => {
    console.log('Full recapture object:', recap); 
    console.log('Recapture ID:', recap.id);
    
    setEditForm({
      id: recap.id,
      recapture_date: recap.recapture_date,
      weight_kg: recap.weight_kg,
      scl: recap.scl,
      scw: recap.scw,
      ccl: recap.ccl,
      ccw: recap.ccw,
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting edit form:', editForm);
    try {
      const result = await dispatch(updateRecapture({ 
        recaptureId: editForm.id,
        data: {
          recapture_date: editForm.recapture_date,
          weight_kg: editForm.weight_kg,
          scl: editForm.scl,
          scw: editForm.scw,
          ccl: editForm.ccl,
          ccw: editForm.ccw,
        }
      })).unwrap();
      console.log('Update response:', result);
      
      // Refresh recapture records after successful update
      await dispatch(fetchRecapturesByTurtleId(turtleId));
      
      dispatch(fetchStatsSummary());
      dispatch(fetchSpeciesDistribution());
      dispatch(fetchConservationProgress());
      dispatch(fetchNestingEventsVsBank());
      dispatch(fetchCapturesSummary());
      
      setEditModalOpen(false);
      toast.success("Recapture updated successfully");
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error || "Failed to update recapture");
    }
  };

  // Create a new sorted array instead of mutating the original
  const sortedRecaptures = recaptures ? [...recaptures].sort((a, b) => 
    new Date(a.recapture_date) - new Date(b.recapture_date)
  ) : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Recapture History</h2>
          <button 
            onClick={onClose}
            className="text-white-500 hover:text-white-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#666639]"></div>
          </div>
        )}

        {!loading && sortedRecaptures?.length > 0 ? (
          <div className="space-y-4">
            {sortedRecaptures.map((recap, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#666639] text-white text-sm font-medium">
                      {idx + 1}
                    </span>
                    <span className="text-lg font-medium text-[#666639]">
                      {new Date(recap.recapture_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  {userData?.role === "admin" && (
                    <button
                      onClick={() => handleEditClick(recap)}
                      className="p-1 bg-white hover:bg-white rounded-full transition-colors"
                    >
                      <Edit2 size={16} className="text-[#666639]" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-6 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Weight</p>
                    <p className="font-medium">{recap.weight_kg ? `${recap.weight_kg} kg` : "-"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">SCL</p>
                    <p className="font-medium">{recap.scl || "-"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">SCW</p>
                    <p className="font-medium">{recap.scw || "-"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">CCL</p>
                    <p className="font-medium">{recap.ccl || "-"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">CCW</p>
                    <p className="font-medium">{recap.ccw || "-"}</p>
                  </div>
                </div>

                {recap.notes && (
                  <div className="mt-3 border-t pt-2">
                    <p className="text-sm text-gray-500">Notes</p>
                    <p className="text-gray-700 text-sm">{recap.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-8 text-gray-500">
              No recapture records found
            </div>
          )
        )}

        {editModalOpen && userData?.role === "admin" && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Recapture Record</h3>
              <form onSubmit={handleEditSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Recapture</label>
                    <input
                      type="date"
                      value={editForm.recapture_date.split('T')[0]}
                      onChange={(e) => setEditForm({...editForm, recapture_date: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#666639] focus:ring-[#666639]"
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editForm.weight_kg}
                      onChange={(e) => setEditForm({...editForm, weight_kg: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#666639] focus:ring-[#666639]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">SCL</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editForm.scl}
                        onChange={(e) => setEditForm({...editForm, scl: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#666639] focus:ring-[#666639]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">SCW</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editForm.scw}
                        onChange={(e) => setEditForm({...editForm, scw: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#666639] focus:ring-[#666639]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">CCL</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editForm.ccl}
                        onChange={(e) => setEditForm({...editForm, ccl: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#666639] focus:ring-[#666639]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">CCW</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editForm.ccw}
                        onChange={(e) => setEditForm({...editForm, ccw: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#666639] focus:ring-[#666639]"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateLoading}
                    className="px-4 py-2 bg-[#666639] text-white rounded-md hover:opacity-90"
                  >
                    {updateLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecaptureHistoryModal;