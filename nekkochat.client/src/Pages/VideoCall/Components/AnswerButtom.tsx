import React, {useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux"
import { RootState } from '../../../StateManagement/VideocallStore';
import { videocallUserSliceActions } from '../../../StateManagement/VideocallUserRedux';


export default function SimpleSnackbar() {
    const [open, setOpen] = useState(false);
    const peerConnection = useRef<RTCPeerConnection | null>(null);

    const navigate = useNavigate();


    peerConnection.current = new RTCPeerConnection()

    const connection = new HubConnectionBuilder()
        .withUrl("https://localhost:7198/videocallhub", { withCredentials: false })
        .withAutomaticReconnect()
        .build();

    connection.start().catch((err) => console.error(err));

    const userId = useSelector((state: RootState) => state.videocallUser.id)

    connection.on('videonotification',() => {
        try {
            if (userId == "1") {
                setOpen(true);
            }
        } catch (error) {
            console.error('Error en la notificacion:', error);
        }
    });

    const userDispatch = useDispatch();



    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (
        _event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleAnswer = async () => {
        setOpen(false);
        userDispatch(videocallUserSliceActions.setAnswered(true));
        connection.invoke('ConnectedVideoNotification').catch((err) => console.error(err));
        navigate("/chats/videocall/" + userId, { replace: true });
        navigate(0)
       
    };

    const action = (
        <React.Fragment>
            <Button color="secondary" size="small" onClick={handleClose}>
                UNDO
            </Button>
            <Button color="secondary" size="small" onClick={handleAnswer}>
                ANSWER
            </Button>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    return (
        <div>
            <Button onClick={handleClick}>Open Snackbar</Button>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                message="Note archived"
                action={action}
            />
        </div>
    );
}
