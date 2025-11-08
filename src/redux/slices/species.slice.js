import { createSlice } from "@reduxjs/toolkit";
import { fetchTurtleSpecies, createSpecies, updateSpecies, deleteSpecies } from "../thunks/species.thunk";

const initialState = {
  turtleSpecies: [], 
  loading: false,
  error: null,
};

const speciesSlice = createSlice({
  name: "species",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTurtleSpecies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTurtleSpecies.fulfilled, (state, action) => {
        state.loading = false;
        state.turtleSpecies = action.payload; 
      })
      .addCase(fetchTurtleSpecies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create species
      .addCase(createSpecies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSpecies.fulfilled, (state, action) => {
        state.loading = false;
        state.turtleSpecies.push(action.payload);
        state.error = null;
      })
      .addCase(createSpecies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update species
      .addCase(updateSpecies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSpecies.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        state.turtleSpecies = state.turtleSpecies.map((species) =>
          species.id === updated.id ? updated : species
        );
        state.error = null;
      })
      .addCase(updateSpecies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete species
      .addCase(deleteSpecies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSpecies.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload;
        state.turtleSpecies = state.turtleSpecies.filter((species) => species.id !== deletedId);
        state.error = null;
      })
      .addCase(deleteSpecies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default speciesSlice.reducer;