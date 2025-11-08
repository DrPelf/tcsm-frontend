import { createSlice } from "@reduxjs/toolkit";
import { fetchNestingBanks, createNestingBank, updateNestingBank, deleteNestingBank } from "../thunks/nestingBank.thunk";

const initialState = {
  nestingBanks: [],
  loading: false,
  error: null
};

const nestingBankSlice = createSlice({
  name: "nestingBank",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNestingBanks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNestingBanks.fulfilled, (state, action) => {
        state.loading = false;
        state.nestingBanks = action.payload;
        state.error = null;
      })
      .addCase(fetchNestingBanks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create nesting bank
      .addCase(createNestingBank.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNestingBank.fulfilled, (state, action) => {
        state.loading = false;
        state.nestingBanks.push(action.payload);
        state.error = null;
      })
      .addCase(createNestingBank.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update nesting bank
      .addCase(updateNestingBank.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNestingBank.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        state.nestingBanks = state.nestingBanks.map((bank) =>
          bank.id === updated.id ? updated : bank
        );
        state.error = null;
      })
      .addCase(updateNestingBank.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete nesting bank
      .addCase(deleteNestingBank.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNestingBank.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload;
        state.nestingBanks = state.nestingBanks.filter((bank) => bank.id !== deletedId);
        state.error = null;
      })
      .addCase(deleteNestingBank.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default nestingBankSlice.reducer;