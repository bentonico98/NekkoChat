import { createSlice } from "@reduxjs/toolkit";

const initialState: { isVideocallAnswered:boolean } = {
    isVideocallAnswered:false,
}

const videocallSlice = createSlice({
    name: "videocallUser",
    initialState,
    reducers: {
        getAnsweredState: (state) => {
            const isAnswered = localStorage.getItem("videocall");
            state.isVideocallAnswered = Boolean(isAnswered);
        },
        setAnswered: (state, action) => {
            localStorage.setItem("videocall", action.payload.user);
            state.isVideocallAnswered = action.payload.user;
        }
    }
})

export const videocallSliceReducer = videocallSlice.reducer;
export const { getAnsweredState, setAnswered } = videocallSlice.actions;
