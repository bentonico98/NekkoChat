import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Slices/userSlice";
import { videocallSliceReducer } from "./Slices/videocallSlice";

export const userStore = configureStore({
    reducer: {
        user: userReducer,
        videocall: videocallSliceReducer
    }
});

export type RootState = ReturnType<typeof userStore.getState>;

export type AppDispatch = typeof userStore.dispatch;