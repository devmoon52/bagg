import { createSlice } from "@reduxjs/toolkit";
import { notifications } from "../../data/notification.js";

const initialState = {
  notifications: notifications,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    add_notification: (state, action) => {
      state.notifications.unshift(action.payload);
    },
  },
});

export const { add_notification } = notificationSlice.actions;
export default notificationSlice.reducer;
