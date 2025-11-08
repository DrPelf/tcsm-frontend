import { createSlice } from "@reduxjs/toolkit";
import {
  fetchNestingEvents,
  createNestingEvent,
  updateNestingEvent,
  deleteNestingEvent,
  fetchSpeciesVsEggs,
} from "../thunks/nestingEvent.thunk";

const initialState = {
  nestingEvents: [],
  nestingEvent: null,
  loading: false,
  error: null,
  speciesVsEggs: [],
  speciesVsEggsLoading: false,
  speciesVsEggsError: null,
};

const nestingEventSlice = createSlice({
  name: "nestingEvent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch nesting events
      .addCase(fetchNestingEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNestingEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.nestingEvents = action.payload;
      })
      .addCase(fetchNestingEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create nesting event
      .addCase(createNestingEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNestingEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.nestingEvents.unshift(action.payload);
      })
      .addCase(createNestingEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update nesting event
      .addCase(updateNestingEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNestingEvent.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.nestingEvents.findIndex(ev => ev.id === action.payload.id);
        if (idx !== -1) state.nestingEvents[idx] = action.payload;
      })
      .addCase(updateNestingEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete nesting event
      .addCase(deleteNestingEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNestingEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.nestingEvents = state.nestingEvents.filter(ev => ev.id !== action.payload.id);
      })
      .addCase(deleteNestingEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Species vs Eggs
      .addCase(fetchSpeciesVsEggs.pending, (state) => {
        state.speciesVsEggsLoading = true;
        state.speciesVsEggsError = null;
      })
      .addCase(fetchSpeciesVsEggs.fulfilled, (state, action) => {
        state.speciesVsEggsLoading = false;
        state.speciesVsEggs = action.payload;
      })
      .addCase(fetchSpeciesVsEggs.rejected, (state, action) => {
        state.speciesVsEggsLoading = false;
        state.speciesVsEggsError = action.payload?.message || action.payload?.error || "Failed to load species vs eggs data";
      });
  },
});

export default nestingEventSlice.reducer;
