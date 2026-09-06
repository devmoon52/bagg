import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  success: null,
  subscribed: false,
};

const globalSlice = createSlice({
  name: "global-slice",
  initialState,
  reducers: {
    setSuccessMessage: (state, action) => {
      state.success = action.payload;
    },

    getSubscribe: (state, action) => {
      state.subscribed = true;
    },
  },
});

export const { setSuccessMessage, getSubscribe } = globalSlice.actions;
export default globalSlice.reducer;
