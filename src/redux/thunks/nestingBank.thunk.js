import { createAsyncThunk } from "@reduxjs/toolkit";

const apiUrl = "https://api.turtleconservation.site/"; 

// Fetch nesting banks
export const fetchNestingBanks = createAsyncThunk(
  "nestingBanks/fetchNestingBanks",
  async (_, thunkAPI) => {
    const url = `${apiUrl}nesting-banks/`; 

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
      return respData.data.nesting_banks;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: "Failed to fetch nesting banks" });
    }
  }
);

// Create nesting bank
export const createNestingBank = createAsyncThunk(
  "nestingBanks/createNestingBank",
  async (name, thunkAPI) => {
    const url = `${apiUrl}admin/nesting-banks`;
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
      return thunkAPI.rejectWithValue({ error: "Failed to create nesting bank" });
    }
  }
);

// Update nesting bank
export const updateNestingBank = createAsyncThunk(
  "nestingBanks/updateNestingBank",
  async ({ id, name }, thunkAPI) => {
    const url = `${apiUrl}admin/nesting-banks/${id}`;
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
      return thunkAPI.rejectWithValue({ error: "Failed to update nesting bank" });
    }
  }
);

// Delete nesting bank
export const deleteNestingBank = createAsyncThunk(
  "nestingBanks/deleteNestingBank",
  async (id, thunkAPI) => {
    const url = `${apiUrl}admin/nesting-banks/${id}`;
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
      return thunkAPI.rejectWithValue({ error: "Failed to delete nesting bank" });
    }
  }
);