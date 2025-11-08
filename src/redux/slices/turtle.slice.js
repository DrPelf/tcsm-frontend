import { createSlice } from "@reduxjs/toolkit";
import { createTurtle, fetchTurtleByMicrochip } from "../thunks/turtle.thunk";

const initialState = {
  turtle: null,
  loading: false,
  error: null,
};

const turtleSlice = createSlice({
  name: "turtle",
  initialState,
  reducers: {
    setTurtle: (state, action) => {
      state.turtle = action.payload;
      state.error = null;
    },
    clearTurtle: (state) => {
      state.turtle = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create turtle cases
      .addCase(createTurtle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTurtle.fulfilled, (state, action) => {
        state.loading = false;
        state.turtle = action.payload;
      })
      .addCase(createTurtle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch turtle by microchip cases
      .addCase(fetchTurtleByMicrochip.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.turtle = null;
      })
      .addCase(fetchTurtleByMicrochip.fulfilled, (state, action) => {
        state.loading = false;
        state.turtle = action.payload;
        state.error = null;
      })
      .addCase(fetchTurtleByMicrochip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.turtle = null;
      });
  },
});

export const { setTurtle, clearTurtle } = turtleSlice.actions;
export default turtleSlice.reducer;