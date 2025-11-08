import { createAsyncThunk } from "@reduxjs/toolkit";

const apiUrl = "https://api.turtleconservation.site/";

// Fetch conservation progress data
export const fetchConservationProgress = createAsyncThunk(
  "analysis/fetchConservationProgress",
  async (_, thunkAPI) => {
    const url = `${apiUrl}analytics/conservation-progress`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) {
        const respObj = await response.json();
        return thunkAPI.rejectWithValue(respObj);
      }

      const respData = await response.json();
      return respData.data.conservation_progress || [];
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message || "Failed to fetch conservation progress data" });
    }
  }
);

// Fetch species distribution data
export const fetchSpeciesDistribution = createAsyncThunk(
  "analysis/fetchSpeciesDistribution",
  async (_, thunkAPI) => {
    const url = `${apiUrl}analytics/species-distribution`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) {
        const respObj = await response.json();
        return thunkAPI.rejectWithValue(respObj);
      }

      const respData = await response.json();
      return respData.data.species_distribution || [];
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message || "Failed to fetch species distribution data" });
    }
  }
);

// Fetch stats summary data
export const fetchStatsSummary = createAsyncThunk(
  "analysis/fetchStatsSummary",
  async (_, thunkAPI) => {
    const url = `${apiUrl}analytics/stats-summary`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) {
        const respObj = await response.json();
        return thunkAPI.rejectWithValue(respObj);
      }

      const respData = await response.json();
      return respData.data.summary_stats || {};
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message || "Failed to fetch stats summary data" });
    }
  }
);

export const fetchNestingEventsVsBank = createAsyncThunk(
  "analysis/fetchNestingEventsVsBank",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`${apiUrl}analytics/nesting-events_vs_bank`, {
        headers: {
          "Content-Type": "application/json"
        },
      });
      const data = await response.json();
      if (!response.ok || data.status !== "success") {
        return thunkAPI.rejectWithValue(data.message || "Failed to fetch data");
      }
      return data.data.nesting_events_vs_bank;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch nesting events vs bank");
    }
  }
);

// Fetch captures summary
export const fetchCapturesSummary = createAsyncThunk(
  "analysis/fetchCapturesSummary",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`${apiUrl}analytics/captures-summary`, {
        headers: {
          "Content-Type": "application/json"
        },
      });
      
      const data = await response.json();
      if (!response.ok || data.status !== "success") {
        return thunkAPI.rejectWithValue(data.message || "Failed to fetch captures summary");
      }
      return data.data.captures_summary;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch captures summary");
    }
  }
);

// Fetch hatchlings per year data
export const fetchHatchlingsPerYear = createAsyncThunk(
  "analysis/fetchHatchlingsPerYear",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`${apiUrl}analytics/hatchlings-per-year`, {
        headers: {
          "Content-Type": "application/json"
        },
      });
      
      const data = await response.json();
      if (!response.ok || data.status !== "success") {
        return thunkAPI.rejectWithValue(data.message || "Failed to fetch hatchlings per year");
      }
      return data.data.hatchlings_per_year;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch hatchlings per year");
    }
  }
);

export const fetchSpeciesVsEggs = createAsyncThunk(
  "analysis/fetchSpeciesVsEggs",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`${apiUrl}analytics/species-vs-eggs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();
      
      if (!response.ok || data.status !== "success") {
        return thunkAPI.rejectWithValue(data.message || "Failed to fetch species vs eggs data");
      }
      
      return data.data.species_vs_eggs;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch species vs eggs data");
    }
  }
);