import NekkoNavbar from "../Pages/Shared/NekkoNavbar";
import { Outlet, useNavigate } from "react-router-dom";
import RegularSnackbar from "../Pages/Shared/RegularSnackbar";
import ErrorSnackbar from "../Pages/Shared/ErrorSnackbar";
import NotificationSnackbar from "../Pages/Shared/NotificationSnackbar";
import NekkoSpinner from "../Pages/Shared/Skeletons/NekkoSpinner";
import useServer from "../Hooks/Server/useServer";
import { useEffect } from "react";
import useDisplayMessage from "../Hooks/useDisplayMessage";
import { useAppDispatch, useAppSelector } from "../Hooks/storeHooks";

import { closeGroupModal, closeModal, closeProfileModal, closeSettingModal, closeUserProfileModal, closeVideoSettingModal, logout, toggleNotification } from "../Store/Slices/userSlice";
import Modal from "react-modal";
import ProfileManager from "../Pages/Shared/Forms/ProfileManager";
import SettingsManager from "../Pages/Shared/Forms/SettingsManager";

import customStyles from "../Constants/Styles/ModalStyles";
import NotificationServerServices from "../Utils/NotificationServerServices";
import UserAuthServices from "../Utils/UserAuthServices";
import SimpleSnackbar from "../Pages/VideoCall/Components/AnswerButtom";
import NekkoChatSpeedDialer from "../Pages/Shared/NekkoSpeedDialer";
import PrivateChatManager from "../Pages/Shared/Forms/PrivateChatManager";
import GroupManager from "../Pages/Shared/Forms/GroupManager";
import VideoSettingsManager from "../Pages/Shared/Forms/VideoSettingsManager";
import UserProfileManager from "../Pages/Shared/Forms/UserProfileManager";

export default function AppLayout() {
    const { setDisplayInfo } = useDisplayMessage();

    const { established } = useServer();

    const ListenningForNotifications = async () => {
        NotificationServerServices.Listen(setDisplayInfo);
    }

    const dispatch = useAppDispatch();
    const profileOpened = useAppSelector(state => state.user.profileModal);
    const userProfileOpened = useAppSelector(state => state.user.userProfileModalOpened);
    const settingOpened = useAppSelector(state => state.user.settingModal);
    const privateOpened = useAppSelector(state => state.user.modalOpened);
    const groupOpened = useAppSelector(state => state.user.modalGroupOpened);
    const videoSettingsOpened = useAppSelector(state => state.user.videoSettingModal);

    const navigate = useNavigate();

    useEffect(() => {
        if (!established) {
            setDisplayInfo({
                isLoading: true
            });
        } else {
            ListenningForNotifications();
        }

        const isRemember = UserAuthServices.isRemembered();

        if (!isRemember) {
            setTimeout(() => {
                dispatch(toggleNotification({ status: true, message: "Logging Off In 5secs" }));
            }, 295000);

            setTimeout(() => {
                dispatch(logout());
                navigate("/login");
            }, 300000);
        }
    }, [established]);
    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        // subtitle.style.color = '#f00';
    }
    function close() {
        dispatch(closeProfileModal());
        dispatch(closeSettingModal());
        dispatch(closeModal());
        dispatch(closeGroupModal());
        dispatch(closeVideoSettingModal());
        dispatch(closeUserProfileModal());
    }
    return (
        <>
            <NekkoNavbar />
            {established && <Outlet />}
            <Modal
                isOpen={profileOpened}
                onAfterOpen={afterOpenModal}
                onRequestClose={close}
                style={customStyles}
                contentLabel="Profile Modal"
            >
                <ProfileManager />
            </Modal>
            <Modal
                isOpen={userProfileOpened}
                onAfterOpen={afterOpenModal}
                onRequestClose={close}
                style={customStyles}
                contentLabel="User Profile Modal"
            >
                <UserProfileManager />
            </Modal>
            <Modal
                isOpen={settingOpened}
                onAfterOpen={afterOpenModal}
                onRequestClose={close}
                style={customStyles}
                contentLabel="Settings Modal"
            >
                <SettingsManager />
            </Modal>
            <Modal
                isOpen={videoSettingsOpened}
                onAfterOpen={afterOpenModal}
                onRequestClose={close}
                style={customStyles}
                contentLabel="Settings Modal"
            >
                <VideoSettingsManager />
            </Modal>
            <Modal
                isOpen={privateOpened}
                onAfterOpen={afterOpenModal}
                onRequestClose={close}
                style={customStyles}
                contentLabel="Private Chat Modal"
            >
                <PrivateChatManager />
            </Modal>
            <Modal
                isOpen={groupOpened}
                onAfterOpen={afterOpenModal}
                onRequestClose={close}
                style={customStyles}
                contentLabel="Group Modal"
            >
                <GroupManager />
            </Modal>
            <NekkoSpinner />
            <RegularSnackbar />
            <ErrorSnackbar />
            <NotificationSnackbar />
            <SimpleSnackbar />
            <NekkoChatSpeedDialer />
        </>
    );
}