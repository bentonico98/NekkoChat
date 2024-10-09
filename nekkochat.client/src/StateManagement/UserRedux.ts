import { createSlice } from "@reduxjs/toolkit";

const initialState: { id: string } = {
    id:"0"
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        getState: (state) => {
            return state
        },
        setState: (state, action) => {
            state.id = action.payload
        }
    }
})

export const userSliceReducer = userSlice.reducer;
export const userSliceActions = userSlice.actions;