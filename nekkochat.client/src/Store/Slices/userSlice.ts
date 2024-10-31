import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../userStore";

export interface UserState {
    value: object,
    modalOpened: boolean,
    errorModalOpened: boolean,
    msjModalOpened: boolean,
    notificationModal: boolean,
    error: string | null | undefined
    message: string | null | undefined
    notification: string | null | undefined,
    isLoading: boolean | undefined,
}

const initialState: UserState = {
    value: JSON.parse(localStorage.getItem("user") || '{}'),
    modalOpened: false,
    errorModalOpened: false,
    msjModalOpened: false,
    notificationModal: false,
    isLoading: false,
    error: null,
    message: null,
    notification: null,
    
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
        },
        toggleMsjModal: (state, action: PayloadAction<{ status: boolean, message: string | null | undefined }>) => {
            state.msjModalOpened = action.payload.status;
            console.log("msj");

            if (!action.payload.status) return;
            if (!action.payload.message) return;
            if (action.payload.message === undefined) return;

            state.message = action.payload.message;
        },
        toggleErrorModal: (state, action: PayloadAction<{ status: boolean, message: string | null | undefined }>) => {
            state.errorModalOpened = action.payload.status;
            console.log("error");
            if (!action.payload.status) return;
            if (!action.payload.message) return;
            if (action.payload.message === undefined) return;

            state.error = action.payload.message;
        },
        toggleNotification: (state, action: PayloadAction<{ status: boolean, message: string | null | undefined }>) => {
            state.notificationModal = action.payload.status;
            console.log("notif");

            if (!action.payload.status) return;
            if (!action.payload.message) return;
            if (action.payload.message === undefined) return;

            state.notification = action.payload.message;
        },
        toggleLoading: (state, action: PayloadAction<boolean | undefined>) => {
            if (action.payload === undefined) return;

            state.isLoading = action.payload;
        },
        toggleUILoading: (state, action: PayloadAction<boolean | undefined>) => {
            if (action.payload === undefined) return;

            state.isLoading = action.payload;
        },

    }
});

export const {
    getUserData,
    login,
    logout,
    openModal,
    closeModal,
    toggleMsjModal,
    toggleErrorModal,
    toggleNotification,
    toggleLoading,
    toggleUiLoading
} = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;