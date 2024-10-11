import { createSlice } from "@reduxjs/toolkit";

const initialState: { id: string, sender_id:string, isVideocallAnswered:boolean } = {
    id: "",
    sender_id: "",
    isVideocallAnswered:false,
}

const videocallUserSlice = createSlice({
    name: "videocallUser",
    initialState,
    reducers: {
        getState: (state) => {
            return state
        },
        setId: (state, action) => {
            state.id = action.payload
        },
        setSenderId: (state, action) => {
            state.sender_id = action.payload
        },
        setAnswered: (state, action) => {
            state.isVideocallAnswered = action.payload
        }
    }
})

export const videocallUserSliceReducer = videocallUserSlice.reducer;
export const videocallUserSliceActions = videocallUserSlice.actions;