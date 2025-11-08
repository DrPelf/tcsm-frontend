import { createAsyncThunk } from "@reduxjs/toolkit";

const apiUrl = "https://api.turtleconservation.site/"; 

// Fetch all users
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, thunkAPI) => {
    const url = `${apiUrl}admin/users`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, 
        },
      });

      if (!response.ok) {
        const respObj = await response.json();
        return thunkAPI.rejectWithValue(respObj);
      }

      const respData = await response.json();
      console.log("API Success Response:", respData); // Debugging

      if (!respData.data || !Array.isArray(respData.data.users)) {
        throw new Error("Invalid response format: data.users is not an array");
      }

      return respData.data.users; // Return the list of users
    } catch (error) {
      console.error("Fetch Users Error:", error); // Debugging
      return thunkAPI.rejectWithValue({ error: error.message || "Failed to fetch users" });
    }
  }
);

// Delete a user
export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId, thunkAPI) => {
    const url = `${apiUrl}admin/users/${userId}`; 

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, 
        },
      });

      if (!response.ok) {
        const respObj = await response.json();
        return thunkAPI.rejectWithValue(respObj);
      }

      return userId; 
    } catch (error) {
      console.error("Delete User Error:", error);
      return thunkAPI.rejectWithValue({ error: error.message || "Failed to delete user" });
    }
  }
);

// Block or unblock a user
export const toggleBlockUser = createAsyncThunk(
  "admin/toggleBlockUser",
  async ({ userId, isBlocked }, thunkAPI) => {
    const url = `${apiUrl}admin/users/${userId}/block`;

    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ is_blocked: isBlocked }),
      });

      if (!response.ok) {
        const respObj = await response.json();
        return thunkAPI.rejectWithValue(respObj);
      }

      const respData = await response.json();
      return { userId, isBlocked }; 
    } catch (error) {
      console.error("Block/Unblock User Error:", error);
      return thunkAPI.rejectWithValue({ error: error.message || "Failed to block/unblock user" });
    }
  }
);