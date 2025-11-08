import { createSlice } from "@reduxjs/toolkit";
import { fetchHeatmapData } from "../thunks/map.thunk";

const initialState = {
  captures: [],
  recaptures: [],
  markers: [],
  loading: false,
  error: null
};

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    addMarker: (state, action) => {
      state.markers.push(action.payload);
    },
    clearMarkers: (state) => {
      state.markers = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHeatmapData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHeatmapData.fulfilled, (state, action) => {
        state.loading = false;
        state.captures = action.payload.captures;
        state.recaptures = action.payload.recaptures;
        state.error = null;
      })
      .addCase(fetchHeatmapData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { addMarker, clearMarkers } = mapSlice.actions;
export default mapSlice.reducer;