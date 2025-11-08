import { createAsyncThunk } from "@reduxjs/toolkit";

const apiUrl = "https://api.turtleconservation.site/hatchlings";

// Thunk to fetch all hatchling records
export const fetchHatchlings = createAsyncThunk(
  "hatchling/fetchHatchlings",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(apiUrl, {
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
      return respData.data.hatchlings; // Return the hatchlings array
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: "Failed to fetch hatchling records" });
    }
  }
);

// Thunk to create a new hatchling record
export const createHatchling = createAsyncThunk(
  "hatchling/createHatchling",
  async (hatchlingData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().Auth?.token || localStorage.getItem("token");

      if (!token) {
        throw new Error("Token is missing. Please log in again.");
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(hatchlingData),
      });

      if (!response.ok) {
        const respObj = await response.json();
        return thunkAPI.rejectWithValue(respObj);
      }

      const respData = await response.json();
      return respData.data; // Return the created hatchling record
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: "Failed to create hatchling record" });
    }
  }
);

// Thunk to delete a hatchling record
export const deleteHatchling = createAsyncThunk(
  "hatchling/deleteHatchling",
  async (hatchlingId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().Auth?.token || localStorage.getItem("token");

      if (!token) {
        throw new Error("Token is missing. Please log in again.");
      }

      const response = await fetch(`${apiUrl}/${hatchlingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 204) {
        // Return the ID of the deleted hatchling for frontend state updates
        return hatchlingId;
      }

      if (!response.ok) {
        const respObj = await response.json();
        return thunkAPI.rejectWithValue(respObj);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: "Failed to delete hatchling record" });
    }
  }
);

// Thunk to update a hatchling record
export const updateHatchling = createAsyncThunk(
  "hatchling/updateHatchling",
  async ({ hatchlingId, updateData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().Auth?.token || localStorage.getItem("token");

      if (!token) {
        throw new Error("Token is missing. Please log in again.");
      }

      const response = await fetch(`${apiUrl}/${hatchlingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const respObj = await response.json();
        return thunkAPI.rejectWithValue(respObj);
      }

      const respData = await response.json();
      return respData.data; // Return the updated hatchling record
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: "Failed to update hatchling record" });
    }
  }
);