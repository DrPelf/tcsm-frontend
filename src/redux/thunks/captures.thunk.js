import { createAsyncThunk } from "@reduxjs/toolkit";

const apiUrl = "https://api.turtleconservation.site/";

export const createCapture = createAsyncThunk(
  "captures/createCapture",
  async (captureData, thunkAPI) => {
    const url = `${apiUrl}captures`;

    try {
      const token = thunkAPI.getState().Auth?.token || localStorage.getItem("token");

      if (!token) {
        throw new Error("Token is missing. Please log in again.");
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(captureData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to create capture record");
      }

      return data.data; // Return the created capture record data
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message || "Failed to create capture record" });
    }
  }
);

// Fetch all captures
export const fetchAllCaptures = createAsyncThunk(
  "captures/fetchAllCaptures",
  async (_, thunkAPI) => {
    const url = `${apiUrl}captures`;

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
      return respData.data.captures || []; // Return the list of captures
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: "Failed to fetch captures" });
    }
  }
);

export const deleteCapture = createAsyncThunk(
  "captures/deleteCapture",
  async (captureId, thunkAPI) => {
    const url = `${apiUrl}captures/${captureId}`;
    try {
      const token = thunkAPI.getState().Auth?.token || localStorage.getItem("token");
      if (!token) throw new Error("Token is missing. Please log in again.");

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const respObj = await response.json();
      if (!response.ok) {
        return thunkAPI.rejectWithValue(respObj);
      }
      return { id: captureId, ...respObj };
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: "Failed to delete capture" });
    }
  }
);

export const updateCapture = createAsyncThunk(
  "captures/updateCapture",
  async ({ id, updateData }, thunkAPI) => {
    const url = `${apiUrl}captures/${id}`; 
    try {
      const token = thunkAPI.getState().Auth?.token || localStorage.getItem("token");
      if (!token) throw new Error("Token is missing. Please log in again.");

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const respObj = await response.json();
      if (!response.ok) {
        return thunkAPI.rejectWithValue(respObj);
      }
      // The updated capture is in respObj.data
      return respObj.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: "Failed to update capture" });
    }
  }
);