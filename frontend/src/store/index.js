import { configureStore } from "@reduxjs/toolkit";
import roomReducer from "./slices/roomSlice";

const store = configureStore({
  reducer: {
    rooms: roomReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
