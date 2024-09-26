import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Slices/userSlice";

export const userStore = configureStore({
    reducer: {
        user: userReducer,
    }
});

export type RootState = ReturnType<typeof userStore.getState>;

export type AppDispatch = typeof userStore.dispatch;