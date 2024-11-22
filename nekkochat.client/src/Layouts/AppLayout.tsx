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
import { closeProfileModal, closeSettingModal, logout, toggleNotification } from "../Store/Slices/userSlice";
import Modal from "react-modal";
import ProfileManager from "../Pages/Shared/Forms/ProfileManager";
import SettingsManager from "../Pages/Shared/Forms/SettingsManager";

import customStyles from "../Constants/Styles/ModalStyles";
import NotificationServerServices from "../Utils/NotificationServerServices";
import UserAuthServices from "../Utils/UserAuthServices";
import SimpleSnackbar from "../Pages/VideoCall/Components/AnswerButtom";

export default function AppLayout() {
    const { setDisplayInfo } = useDisplayMessage();

    const { established } = useServer();

    const ListenningForNotifications = async () => {
        NotificationServerServices.Listen(setDisplayInfo);
    }

    const dispatch = useAppDispatch();
    const modalOpened = useAppSelector(state => state.user.profileModal);
    const settingOpened = useAppSelector(state => state.user.settingModal);

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
    }

    return (
        <>
            <NekkoNavbar />
            {established && <Outlet />}
            <Modal
                isOpen={modalOpened}
                onAfterOpen={afterOpenModal}
                onRequestClose={close}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <ProfileManager />
            </Modal>
            <Modal
                isOpen={settingOpened}
                onAfterOpen={afterOpenModal}
                onRequestClose={close}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <SettingsManager />
            </Modal>
            <NekkoSpinner />
            <RegularSnackbar />
            <ErrorSnackbar />
            <NotificationSnackbar />
            <SimpleSnackbar />
        </>
    );
}