import React, {useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { useNavigate } from 'react-router-dom';
import { useSelector} from "react-redux"
import { RootState } from '../../../StateManagement/store';

export default function SimpleSnackbar() {
    const [open, setOpen] = useState(false);
    const peerConnection = useRef<RTCPeerConnection | null>(null);

    const navigate = useNavigate();


    peerConnection.current = new RTCPeerConnection()

    const connection = new HubConnectionBuilder()
        .withUrl("https://localhost:7198/privatechathub", { withCredentials: false })
        .withAutomaticReconnect()
        .build();

    connection.start().catch((err) => console.error(err));

    //let answer: RTCSessionDescriptionInit;

   /* connection.on('offer', async (sdp) => {
        try {
            if (peerConnection.current) {
                answer = JSON.parse(sdp);
            }
        } catch (error) {
            console.error('Error al actualizar la descripción de sesión SDP:', error);
        }
    });*/

    const userId = useSelector((state: RootState) => state.user.id)

    connection.on('videonotification',() => {
        try {
            if (userId == "1") {
                setOpen(true);
            }
        } catch (error) {
            console.error('Error en la notificacion:', error);
        }
    });

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
        navigate("/chats/videocall", { replace: true });
        navigate(0)
       /* if (peerConnection.current && answer) {
            try {
               await peerConnection.current.setRemoteDescription(answer);
                const answerAnswer: RTCLocalSessionDescriptionInit = await peerConnection.current.createAnswer()
                await peerConnection.current.setLocalDescription(answerAnswer);

                await connection.invoke('Answer', JSON.stringify(answerAnswer)).catch((err) => console.error(err));

                navigate("/chats/videocall");

            } catch (error) {
                console.error('Error enviando la respuesta:', error);
            }
        }*/
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
