import React, {useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import { useNavigate } from 'react-router-dom';
import VideocallServerServices from '../../../Utils/VideoCallService';
import useVideocallSignalServer from '../../../Hooks/useVideocallSignalR';
import CallIcon from '@mui/icons-material/Call';
import CallEndIcon from '@mui/icons-material/CallEnd';
import Box from '@mui/material/Box';
import { IProfileData } from './SendModal';
import Typography from '@mui/material/Typography';

//import { useAppSelector } from '../../../Hooks/storeHooks';
//import useGetUser from '../../../Hooks/useGetUser';


export default function SimpleSnackbar() {
    const [open, setOpen] = useState(false);
    const peerConnection = useRef<RTCPeerConnection | null>(null);

    const navigate = useNavigate();

    const [senderId, setSenderId] = useState<string | null>();
    const [profileData, setProfileData] = useState<IProfileData | null>(null)

    peerConnection.current = new RTCPeerConnection()

    const user = JSON.parse(localStorage.getItem("user") || '{}')

    const Receiver_id: string = user.id;
    const { connected, conn } = useVideocallSignalServer();

    let connection: any;

    useEffect(() => {
        if (connected) {
            connection = conn?.connection;
            connection.on('videonotification', (sender_id: string, receiver_id: string, data:string) => {
                try {
                    if (Receiver_id == receiver_id) {
                        setSenderId(sender_id);
                        setOpen(true);
                        setProfileData(JSON.parse(data));
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

    const handleClose = async (
        _event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        await VideocallServerServices.SendOfferVideoNotification(String(senderId), Receiver_id, false);
        setOpen(false);
    };

    const handleAnswer = async () => {
        setOpen(false);
        navigate("/chats/videocall/", { replace: true });
        await VideocallServerServices.SendOfferVideoNotification(String(senderId), Receiver_id, true);
        navigate(0)
    };

    const action = (
        <React.Fragment>
            <Box
                sx={{ borderRadius:"50%", width:"3rem", height:"3rem"}}
                component="img"
                alt="User profile photo"
                src={profileData?.photo != null ? profileData.photo : "../../../../public/defaultAvatar.jpg"}
            />
            <Typography sx={{ margin: "0 4rem 0 1rem", }} variant="subtitle1">{profileData?.name != null ? profileData.name : "Unknown"}</Typography>
            <Button size="small" sx={{ margin: "0 1rem", borderRadius: "50%", width: "1rem", height: "3rem", backgroundColor: "#ff4343", color: "white", "&:hover": { backgroundColor: "#ff6666" } }} onClick={handleClose}>
                <CallEndIcon sx={{ color: "white", fontSize:"0.9rem" }}></CallEndIcon>
            </Button>
            <Button sx={{ borderRadius: "50%", width: "1rem", height: "3rem", backgroundColor: "#0083ff", color: "white", "&:hover": { backgroundColor: "#00b9ff" } }} size="small" onClick={handleAnswer}>
                <CallIcon sx={{ color: "white", fontSize:"0.9rem" }}></CallIcon>
            </Button>
        </React.Fragment>
    );

    return (
        <div>
            <Snackbar
                ContentProps={{
                    sx: {
                        background: "white",
                        color: "black",
                        zIndex: 100
                    }
                }}
                
                open={open}
                anchorOrigin={{ vertical: "top", horizontal:"right"}}
                autoHideDuration={6000}
                onClose={handleClose}
                message=""
                action={action}
            />
        </div>
    );
}
