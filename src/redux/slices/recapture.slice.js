import { createSlice } from "@reduxjs/toolkit";
import { fetchCaptureByMicrochipId, fetchRecapturesByTurtleId, updateRecapture, createRecapture } from "../thunks/recapture.thunk";

const initialState = {
  captureRecord: null,
  loading: false,
  error: null,
  recaptureCreated: false,
  recaptures: [],
  updateLoading: false,
};

const recaptureSlice = createSlice({
  name: "recapture",
  initialState,
  reducers: {
    resetRecaptureState: (state) => {
      state.captureRecord = null;
      state.loading = false;
      state.error = null;
      state.recaptureCreated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCaptureByMicrochipId.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.captureRecord = null;
      })
      .addCase(fetchCaptureByMicrochipId.fulfilled, (state, action) => {
        state.loading = false;
        state.captureRecord = action.payload;
      })
      .addCase(fetchCaptureByMicrochipId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.captureRecord = null;
      })
      .addCase(fetchRecapturesByTurtleId.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.recaptures = [];
      })
      .addCase(fetchRecapturesByTurtleId.fulfilled, (state, action) => {
        state.loading = false;
        state.recaptures = action.payload;
      })
      .addCase(fetchRecapturesByTurtleId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.recaptures = [];
      })
      .addCase(updateRecapture.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateRecapture.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.recaptures = state.recaptures.map(recapture => 
          recapture.id === action.payload.id ? action.payload : recapture
        );
      })
      .addCase(updateRecapture.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })
      .addCase(createRecapture.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.recaptureCreated = false;
      })
      .addCase(createRecapture.fulfilled, (state, action) => {
        state.loading = false;
        state.recaptureCreated = true;
        state.recaptures.push(action.payload);
      })
      .addCase(createRecapture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.recaptureCreated = false;
      });
  },
});

export const { resetRecaptureState } = recaptureSlice.actions;
export default recaptureSlice.reducer;