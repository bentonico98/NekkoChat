import { configureStore } from "@reduxjs/toolkit"

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { videocallUserSliceReducer } from "./VideocallUserRedux";

const persistConfig = {
    key: "videocallUser",
    storage,
};

const persistedReducer = persistReducer(persistConfig, videocallUserSliceReducer);

export const videocallStore = configureStore({
    reducer: {
        videocallUser: persistedReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }),
});

export const persistor = persistStore(videocallStore);

export type RootState = ReturnType<typeof videocallStore.getState>