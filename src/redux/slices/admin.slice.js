import { createSlice } from "@reduxjs/toolkit";
import { fetchUsers, deleteUser, toggleBlockUser } from "../thunks/admin.thunk";

const initialState = {
  users: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload); 
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(toggleBlockUser.fulfilled, (state, action) => {
        const { userId, isBlocked } = action.payload;
        const user = state.users.find((user) => user.id === userId);
        if (user) {
          user.status = isBlocked ? "Blocked" : "Active"; 
        }
      })
      .addCase(toggleBlockUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;