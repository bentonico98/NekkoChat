import { Container } from "react-bootstrap";
import NekkoNavbar from "../Pages/Shared/NekkoNavbar";
import { Outlet } from "react-router-dom";
import RegularSnackbar from "../Pages/Shared/RegularSnackbar";
import ErrorSnackbar from "../Pages/Shared/ErrorSnackbar";
import NotificationSnackbar from "../Pages/Shared/NotificationSnackbar";
import NekkoSpinner from "../Pages/Shared/Skeletons/NekkoSpinner";
import useServer from "../Hooks/Server/useServer";
import { useEffect} from "react";
import useDisplayMessage from "../Hooks/useDisplayMessage";
import { useAppDispatch, useAppSelector } from "../Hooks/storeHooks";
import { closeProfileModal, closeSettingModal } from "../Store/Slices/userSlice";
import Modal from "react-modal";
import ProfileManager from "../Pages/Shared/Forms/ProfileManager";
import SettingsManager from "../Pages/Shared/Forms/SettingsManager";

import customStyles from "../Constants/Styles/ModalStyles";

export default function AppLayout() {
    const { setDisplayInfo } = useDisplayMessage();

    const { established } = useServer();

    useEffect(() => {
        if (!established) {
            setDisplayInfo({
                isLoading: true
            });
        }
    }, [established]);

    const dispatch = useAppDispatch();

    const modalOpened = useAppSelector(state => state.user.profileModal);
    const settingOpened = useAppSelector(state => state.user.settingModal);

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
            <Container style={{ minHeight: "100vh", minWidth: "100%" }}>
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
            </Container>
            <RegularSnackbar />
            <ErrorSnackbar />
            <NotificationSnackbar />
        </>
    );
}