import { createAsyncThunk } from "@reduxjs/toolkit";
const apiUrl = "https://api.turtleconservation.site/";

export const fetchCaptureByMicrochipId = createAsyncThunk(
  "recapture/fetchCaptureByMicrochipId",
  async (microchipId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().Auth?.token || localStorage.getItem("token");
      const response = await fetch(`${apiUrl}captures/by-microchip/${microchipId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok || data.status !== "success") {
        return thunkAPI.rejectWithValue(data.message || "Not found");
      }
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch capture");
    }
  }
);

export const fetchRecapturesByTurtleId = createAsyncThunk(
  "recapture/fetchRecapturesByTurtleId",
  async (turtleId, thunkAPI) => {
    try {
      if (!turtleId) {
        return thunkAPI.rejectWithValue("No turtle ID provided");
      }

      const token = thunkAPI.getState().Auth?.token || localStorage.getItem("token");
      const response = await fetch(`${apiUrl}recaptures/${turtleId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok || data.status !== "success") {
        return thunkAPI.rejectWithValue(data.message || "Failed to fetch recaptures");
      }

      return data.data.recaptures;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch recaptures");
    }
  }
);

export const updateRecapture = createAsyncThunk(
  "recapture/updateRecapture",
  async ({ recaptureId, data }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().Auth?.token || localStorage.getItem("token");
      const response = await fetch(`${apiUrl}recaptures/${recaptureId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      if (!response.ok || responseData.status !== "success") {
        return thunkAPI.rejectWithValue(responseData.message || "Failed to update recapture");
      }

      return responseData.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to update recapture");
    }
  }
);

// Create recapture
export const createRecapture = createAsyncThunk(
  "recapture/createRecapture",
  async (recaptureData, thunkAPI) => {
    const apiUrl = "https://api.turtleconservation.site/recaptures";
    const token = thunkAPI.getState().Auth?.token || localStorage.getItem("token");
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(recaptureData),
      });
      const data = await response.json();
      if (!response.ok) {
        return thunkAPI.rejectWithValue(data.message || "Failed to create recapture record");
      }
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Failed to create recapture record");
    }
  }
);