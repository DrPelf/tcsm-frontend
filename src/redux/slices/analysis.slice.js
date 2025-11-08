import { createSlice } from "@reduxjs/toolkit";
import { fetchConservationProgress, fetchSpeciesDistribution, fetchStatsSummary, fetchNestingEventsVsBank, fetchCapturesSummary, fetchHatchlingsPerYear, fetchSpeciesVsEggs } from "../thunks/analysis.thunk";

const initialState = {
  conservationProgress: [],
  speciesDistribution: [],
  statsSummary: {}, 
  loading: false,
  error: null,
  nestingEventsVsBank: [],
  nestingEventsVsBankLoading: false,
  nestingEventsVsBankError: null,
  capturesSummary: {
    total_captures: 0,
    by_species: {},
    by_gender: {},
    by_status: {},
    by_action: {}
  },
  hatchlingsPerYear: [],
  hatchlingsPerYearLoading: false,
  hatchlingsPerYearError: null,
  speciesVsEggs: []
};

const analysisSlice = createSlice({
  name: "analysis",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Conservation Progress
      .addCase(fetchConservationProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConservationProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.conservationProgress = action.payload;
      })
      .addCase(fetchConservationProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Species Distribution
      .addCase(fetchSpeciesDistribution.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpeciesDistribution.fulfilled, (state, action) => {
        state.loading = false;
        state.speciesDistribution = action.payload;
      })
      .addCase(fetchSpeciesDistribution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Stats Summary
      .addCase(fetchStatsSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatsSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.statsSummary = action.payload;
      })
      .addCase(fetchStatsSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Nesting Events Vs Bank
      .addCase(fetchNestingEventsVsBank.pending, (state) => {
        state.nestingEventsVsBankLoading = true;
        state.nestingEventsVsBankError = null;
      })
      .addCase(fetchNestingEventsVsBank.fulfilled, (state, action) => {
        state.nestingEventsVsBankLoading = false;
        state.nestingEventsVsBank = action.payload;
      })
      .addCase(fetchNestingEventsVsBank.rejected, (state, action) => {
        state.nestingEventsVsBankLoading = false;
        state.nestingEventsVsBankError = action.payload;
      })
      // Captures Summary
      .addCase(fetchCapturesSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCapturesSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.capturesSummary = action.payload;
      })
      .addCase(fetchCapturesSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Hatchlings Per Year
      .addCase(fetchHatchlingsPerYear.pending, (state) => {
        state.hatchlingsPerYearLoading = true;
        state.hatchlingsPerYearError = null;
      })
      .addCase(fetchHatchlingsPerYear.fulfilled, (state, action) => {
        state.hatchlingsPerYearLoading = false;
        state.hatchlingsPerYear = action.payload;
      })
      .addCase(fetchHatchlingsPerYear.rejected, (state, action) => {
        state.hatchlingsPerYearLoading = false;
        state.hatchlingsPerYearError = action.payload;
      })
      // Species Vs Eggs
      .addCase(fetchSpeciesVsEggs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpeciesVsEggs.fulfilled, (state, action) => {
        state.loading = false;
        state.speciesVsEggs = action.payload;
        state.error = null;
      })
      .addCase(fetchSpeciesVsEggs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default analysisSlice.reducer;