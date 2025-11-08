import { createAsyncThunk } from "@reduxjs/toolkit";

const apiUrl = "https://api.turtleconservation.site/";

// Create a new turtle record
export const createTurtle = createAsyncThunk(
  "turtle/createTurtle",
  async (turtleData, thunkAPI) => {
    const url = `${apiUrl}turtles`;

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
        body: JSON.stringify(turtleData),
      });

      if (!response.ok) {
        const respObj = await response.json();
        return thunkAPI.rejectWithValue(respObj);
      }

      const respData = await response.json();
      return respData.data; 
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: "Failed to create turtle record" });
    }
  }
);

// Fetch a turtle record by microchip ID
export const fetchTurtleByMicrochip = createAsyncThunk(
  "turtle/fetchTurtleByMicrochip",
  async (microchipId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().Auth?.token || localStorage.getItem("token");
      if (!token) throw new Error("Token is missing. Please log in again.");

      const response = await fetch(`${apiUrl}turtles/by-microchip/${microchipId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Turtle API response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to find turtle");
      }

      // The API returns the turtle data in the 'data' field
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Failed to fetch turtle");
    }
  }
);