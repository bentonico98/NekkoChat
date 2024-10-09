import { configureStore } from "@reduxjs/toolkit"
import{ userSliceReducer } from "./UserRedux"

export const store = configureStore({
    reducer: ({
        user: userSliceReducer
    })
});

export type RootState = ReturnType<typeof store.getState>