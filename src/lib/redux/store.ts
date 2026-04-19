import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./root-reducer";

export const asciiStore = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof asciiStore.getState>;
export type AppDispatch = typeof asciiStore.dispatch;
