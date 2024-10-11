import { configureStore } from "@reduxjs/toolkit"

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { videocallUserSliceReducer } from "./VideocallUserRedux";


const persistConfig = {
    key: "root",
    storage,
};

const persistedReducer = persistReducer(persistConfig, videocallUserSliceReducer);

export const videocallStore = configureStore({
    reducer: {
        videocallUser: persistedReducer,
    },
});

export const persistor = persistStore(videocallStore);

export type RootState = ReturnType<typeof videocallStore.getState>