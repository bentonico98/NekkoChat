import React, {useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import {  useDispatch } from "react-redux"
import { setAnswered } from '../../../Store/Slices/videocallSlice';
import VideocallServerServices from '../../../Utils/VideoCallService';
import useVideocallSignalServer from '../../../Hooks/useVideocallSignalR';

//import { useAppSelector } from '../../../Hooks/storeHooks';
//import useGetUser from '../../../Hooks/useGetUser';


export default function SimpleSnackbar() {
    const [open, setOpen] = useState(false);
    const peerConnection = useRef<RTCPeerConnection | null>(null);

    const navigate = useNavigate();

    const [senderId, setSenderId] = useState<string | null>();


    peerConnection.current = new RTCPeerConnection()

    const user = JSON.parse(localStorage.getItem("user") || '{}')

    const Receiver_id: string = user.id;
    const { connected, conn } = useVideocallSignalServer();

    let connection: any;

    useEffect(() => {
        if (connected) {
            connection = conn?.connection;
            connection.on('videonotification', (sender_id: string, receiver_id: string) => {
                console.log("esta es la videonotificacion");
                try {
                    if (Receiver_id == receiver_id) {
                        setSenderId(sender_id);
                        setOpen(true);
                    }
                } catch (error) {
                    console.error('Error en la notificacion:', error);
                }
            });

            return () => {
                connection.off('videonotification');
            };
        }
    }, [connected, connection]);

    const userDispatch = useDispatch();

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
        userDispatch(setAnswered(true));
        console.log("invoco SEND OFFER")
        //navigate("/chats/videocall/", { replace: true });
        console.log(senderId, Receiver_id);
        await VideocallServerServices.SendOfferVideoNotification(String(senderId), Receiver_id);
       // navigate(0)
       
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
