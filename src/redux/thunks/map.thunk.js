import { createAsyncThunk } from "@reduxjs/toolkit";

const apiUrl = "https://api.turtleconservation.site/";

export const fetchHeatmapData = createAsyncThunk(
  "map/fetchHeatmapData",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`${apiUrl}analytics/heatmap-data`, {
        headers: {
          "Content-Type": "application/json"
        },
      });
      
      const data = await response.json();
      
      if (!response.ok || data.status !== "success") {
        return thunkAPI.rejectWithValue(data.message || "Failed to fetch heatmap data");
      }

      // Filter out entries with null coordinates, allow 0 coordinates
      const validCaptures = data.data.captures.filter(c => 
        c.latitude !== null && c.longitude !== null && 
        c.latitude !== undefined && c.longitude !== undefined
      );

      const validRecaptures = data.data.recaptures.filter(r => 
        r.latitude !== null && r.longitude !== null && 
        r.latitude !== undefined && r.longitude !== undefined
      );

      return {
        captures: validCaptures,
        recaptures: validRecaptures
      };
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch heatmap data");
    }
  }
);