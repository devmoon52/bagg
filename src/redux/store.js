import { configureStore } from "@reduxjs/toolkit";

import productReducer from "./slices/productSlice.js";
import globalReducer from "./slices/globalSlice.js";
import notificationReducer from "./slices/notificationSlice.js";

export const store = configureStore({
  reducer: {
    products: productReducer,
    global: globalReducer,
    notifications: notificationReducer,
  },
});
