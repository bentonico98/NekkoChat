import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../userStore";

export interface UserState {
    value: object,
    modalOpened: boolean
}

const initialState: UserState = {
    value: {},
    modalOpened : false
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        getUserData: (state) => {
            const user = JSON.parse(localStorage.getItem("user") || '{}');
            state.value = user;
        },
        login: (state, action: PayloadAction<{ success: boolean, user: object }>) => {
            if (action.payload.success) {
                localStorage.setItem("user", JSON.stringify(action.payload.user));
                state.value = action.payload.user;
            } else {
                state.value = {};
            }
        },
        logout: (state) => {
            localStorage.removeItem("user");
            state.value = {};
        }, 
        openModal: (state) => {
            state.modalOpened = true;
        },
        closeModal: (state) => {
            state.modalOpened = false;
        }
    }
});

export const { getUserData, login, logout, openModal, closeModal } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;