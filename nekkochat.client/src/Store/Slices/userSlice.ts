import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../userStore";
import UserAuthServices from "../../Utils/UserAuthServices";

export interface UserState {
    value: object,
    modalOpened: boolean,
    modalGroupOpened: boolean,
    errorModalOpened: boolean,
    msjModalOpened: boolean,
    notificationModal: boolean,
    notificationCount: string,
    profileModal: boolean,
    settingModal: boolean,
    error: string | null | undefined
    message: string | null | undefined
    notification: string | null | undefined,
    isLoading: boolean | undefined,
}

const initialState: UserState = {
    value: JSON.parse(localStorage.getItem("user") || '{}'),
    modalOpened: false,
    modalGroupOpened: false,
    errorModalOpened: false,
    msjModalOpened: false,
    notificationModal: false,
    notificationCount: "0",
    profileModal: false,
    settingModal: false,
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
        refreshUserData:  (state, action: PayloadAction<string>) => {
            if (action.payload) {
                UserAuthServices.RefreshUserById(action.payload).then((res) => {
                    if (res.success) {
                        localStorage.setItem("user", JSON.stringify(res.singleUser));
                        state.value = res.singleUser;
                    }
                })
            }
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
            localStorage.removeItem('rmrUser');
            state.value = {};
        },
        openModal: (state) => {
            state.modalOpened = true;
        },
        closeModal: (state) => {
            state.modalOpened = false;
        },
        openGroupModal: (state) => {
            state.modalGroupOpened = true;
        },
        closeGroupModal: (state) => {
            state.modalGroupOpened = false;
        },
        openProfileModal: (state) => {
            state.profileModal = true;
        },
        closeProfileModal: (state) => {
            state.profileModal = false;
        },
        openSettingModal: (state) => {
            state.settingModal = true;
        },
        closeSettingModal: (state) => {
            state.settingModal = false;
        },
        toggleMsjModal: (state, action: PayloadAction<{ status: boolean, message: string | null | undefined }>) => {
            state.msjModalOpened = action.payload.status;

            if (!action.payload.status) return;
            if (!action.payload.message) return;
            if (action.payload.message === undefined) return;

            state.message = action.payload.message;
        },
        toggleErrorModal: (state, action: PayloadAction<{ status: boolean, message: string | null | undefined }>) => {
            state.errorModalOpened = action.payload.status;

            if (!action.payload.status) return;
            if (!action.payload.message) return;
            if (action.payload.message === undefined) return;

            state.error = action.payload.message;
        },
        toggleNotification: (state, action: PayloadAction<{ status: boolean, message: string | null | undefined }>) => {
            state.notificationModal = action.payload.status;

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
        setNotificationCount: (state, action: PayloadAction<string>) => {
            if (!action.payload) return
            state.notificationCount = action.payload;
        },
    }
});

export const {
    getUserData,
    refreshUserData,
    login,
    logout,
    openModal,
    closeModal,
    closeGroupModal,
    openGroupModal,
    openProfileModal,
    closeProfileModal,
    openSettingModal,
    closeSettingModal,
    toggleMsjModal,
    toggleErrorModal,
    toggleNotification,
    toggleLoading,
    setNotificationCount
} = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;