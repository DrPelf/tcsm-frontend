import { createAsyncThunk } from "@reduxjs/toolkit";

const apiUrl = "https://api.turtleconservation.site/";

// Fetch turtle species
export const fetchTurtleSpecies = createAsyncThunk(
  "species/fetchTurtleSpecies",
  async (_, thunkAPI) => {
    const url = `${apiUrl}species/`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const respObj = await response.json();
        return thunkAPI.rejectWithValue(respObj);
      }

      const respData = await response.json();
      return respData.data.species; 
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: "Failed to fetch turtle species" });
    }
  }
);

// Create species
export const createSpecies = createAsyncThunk(
  "species/createSpecies",
  async (name, thunkAPI) => {
    const url = `${apiUrl.replace(/\/$/, "")}/admin/species`;
    const token = thunkAPI.getState().Auth?.token || localStorage.getItem("token");
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        const respObj = await response.json();
        return thunkAPI.rejectWithValue(respObj);
      }
      const respData = await response.json();
      return respData.data; 
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: "Failed to create species" });
    }
  }
);

// Update species
export const updateSpecies = createAsyncThunk(
  "species/updateSpecies",
  async ({ id, name }, thunkAPI) => {
    const url = `${apiUrl.replace(/\/$/, "")}/admin/species/${id}`;
    const token = thunkAPI.getState().Auth?.token || localStorage.getItem("token");
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        const respObj = await response.json();
        return thunkAPI.rejectWithValue(respObj);
      }
      const respData = await response.json();
      return respData.data; 
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: "Failed to update species" });
    }
  }
);

// Delete species
export const deleteSpecies = createAsyncThunk(
  "species/deleteSpecies",
  async (id, thunkAPI) => {
    const url = `${apiUrl.replace(/\/$/, "")}/admin/species/${id}`;
    const token = thunkAPI.getState().Auth?.token || localStorage.getItem("token");
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const respObj = await response.json();
        return thunkAPI.rejectWithValue(respObj);
      }
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: "Failed to delete species" });
    }
  }
);