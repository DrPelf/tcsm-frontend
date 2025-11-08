import { createSlice } from "@reduxjs/toolkit";
import { createHatchling, fetchHatchlings, deleteHatchling, updateHatchling } from "../thunks/hatchling.thunk";

const initialState = {
  hatchlings: [],
  hatchling: null,
  loading: false,
  error: null,
};

const hatchlingSlice = createSlice({
  name: "hatchling",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch hatchlings
      .addCase(fetchHatchlings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHatchlings.fulfilled, (state, action) => {
        state.loading = false;
        state.hatchlings = action.payload;
      })
      .addCase(fetchHatchlings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create hatchling
      .addCase(createHatchling.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHatchling.fulfilled, (state, action) => {
        state.loading = false;
        state.hatchling = action.payload;
        state.hatchlings.push(action.payload);
      })
      .addCase(createHatchling.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete hatchling
      .addCase(deleteHatchling.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHatchling.fulfilled, (state, action) => {
        state.loading = false;
        state.hatchlings = state.hatchlings.filter(hatchling => hatchling.id !== action.payload);
      })
      .addCase(deleteHatchling.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update hatchling
      .addCase(updateHatchling.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHatchling.fulfilled, (state, action) => {
        state.loading = false;
        state.hatchlings = state.hatchlings.map(hatchling => 
          hatchling.id === action.payload.id ? action.payload : hatchling
        );
      })
      .addCase(updateHatchling.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default hatchlingSlice.reducer;