import { createSlice } from "@reduxjs/toolkit";
import { fetchAllCaptures } from "../thunks/captures.thunk";

const initialState = {
  captures: [],
  loading: false,
  error: null,
};

const capturesSlice = createSlice({
  name: "captures",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCaptures.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCaptures.fulfilled, (state, action) => {
        state.loading = false;
        state.captures = action.payload; // Store the captures array
      })
      .addCase(fetchAllCaptures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default capturesSlice.reducer;