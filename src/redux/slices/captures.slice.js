import { createSlice } from "@reduxjs/toolkit";
import { fetchAllCaptures, deleteCapture, updateCapture, createCapture } from "../thunks/captures.thunk";

const initialState = {
  captures: [], // Initialize as an empty array
  loading: false,
  error: null,
};

const capturesSlice = createSlice({
  name: "captures",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create capture
      .addCase(createCapture.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCapture.fulfilled, (state, action) => {
        state.loading = false;
        state.captures.push(action.payload);
        state.error = null;
      })
      .addCase(createCapture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch all captures
      .addCase(fetchAllCaptures.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCaptures.fulfilled, (state, action) => {
        state.loading = false;
        state.captures = action.payload;
      })
      .addCase(fetchAllCaptures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete capture
      .addCase(deleteCapture.fulfilled, (state, action) => {
        state.captures = state.captures.filter(c => c.id !== action.payload.id);
      })
      // Update capture
      .addCase(updateCapture.fulfilled, (state, action) => {
        state.captures = state.captures.map(c =>
          c.id === action.payload.id ? { ...c, ...action.payload } : c
        );
      });
  },
});

export default capturesSlice.reducer;