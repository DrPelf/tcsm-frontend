import { createAsyncThunk } from "@reduxjs/toolkit";

const apiUrl = "https://api.turtleconservation.site/";

// Thunk to fetch all nesting events
export const fetchNestingEvents = createAsyncThunk(
  "nestingEvent/fetchNestingEvents",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`${apiUrl}nesting-events`, {
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
      return respData.data.nesting_events;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: "Failed to fetch nesting events" });
    }
  }
);

// Thunk to create a new nesting event
export const createNestingEvent = createAsyncThunk(
  "nestingEvent/createNestingEvent",
  async (nestingData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().Auth?.token || localStorage.getItem("token");

      if (!token) {
        throw new Error("Token is missing. Please log in again.");
      }
      const nestingEventResponse = await fetch(`${apiUrl}nesting-events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nestingData),
      });

      if (!nestingEventResponse.ok) {
        const nestingError = await nestingEventResponse.json();
        return thunkAPI.rejectWithValue(nestingError);
      }

      const nestingEvent = await nestingEventResponse.json();
      return nestingEvent.data; // Return the created nesting event record
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: "Failed to create nesting event" });
    }
  }
);

// Thunk to update a nesting event
export const updateNestingEvent = createAsyncThunk(
  "nestingEvent/updateNestingEvent",
  async ({ id, updateData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().Auth?.token || localStorage.getItem("token");
      if (!token) throw new Error("Token is missing. Please log in again.");

      const response = await fetch(`${apiUrl}nesting-events/${id}`, {
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
      // The updated event is in respObj.data
      return respObj.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: "Failed to update nesting event" });
    }
  }
);

// Thunk to delete a nesting event
export const deleteNestingEvent = createAsyncThunk(
  "nestingEvent/deleteNestingEvent",
  async (eventId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().Auth?.token || localStorage.getItem("token");
      if (!token) throw new Error("Token is missing. Please log in again.");

      const response = await fetch(`${apiUrl}nesting-events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const respObj = await response.json();
      if (!response.ok) {
        return thunkAPI.rejectWithValue(respObj);
      }
      // Return the deleted event id for reducer
      return { id: eventId };
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: "Failed to delete nesting event" });
    }
  }
);

// Thunk to fetch species vs eggs data
export const fetchSpeciesVsEggs = createAsyncThunk(
  "nestingEvent/fetchSpeciesVsEggs",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().Auth?.token || localStorage.getItem("token");
      if (!token) throw new Error("Token is missing. Please log in again.");

      const response = await fetch(`${apiUrl}nesting-events/species-vs-eggs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const respData = await response.json();
      if (!response.ok || respData.status !== "success") {
        return thunkAPI.rejectWithValue(respData);
      }
      // Return the array of species_vs_eggs
      return respData.data.species_vs_eggs;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: "Failed to fetch species vs eggs data" });
    }
  }
);

// Remove token check for this public endpoint
export const fetchNestingEventsVsBank = createAsyncThunk(
  "nestingEvent/fetchNestingEventsVsBank",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`${apiUrl}analytics/nesting-events-vs-bank`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      });

      const respData = await response.json();
      if (!response.ok || respData.status !== "success") {
        return thunkAPI.rejectWithValue(respData);
      }
      return respData.data.nesting_events_vs_bank;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: "Failed to fetch nesting events vs bank data" });
    }
  }
);