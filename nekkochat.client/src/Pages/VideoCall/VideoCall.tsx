import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import React, { useRef, useEffect, useState } from 'react';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import SettingsIcon from '@mui/icons-material/Settings';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocallServerServices from '../../Utils/VideoCallService'
import { VideoCallButton } from './Components/VideoCallButtom';
import { IUserData, SendModal, IProfileData } from './Components/SendModal';
import useVideocallSignalServer from '../../Hooks/useVideocallSignalR';
import ServerLinks from '../../Constants/ServerLinks';
import axios from 'axios';
import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from '@mui/material/useMediaQuery';
import { AlertSnackbarType } from './Components/AlertSnackbar';
import { VideoCallComnicationHandler } from './Components/Handlers/VideoComunicationHandler';
import { HubConnection } from '@microsoft/signalr';
import { openVideoSettingModal, toggleErrorModal } from '../../Store/Slices/userSlice';
import { useAppDispatch } from '../../Hooks/storeHooks';
//import { Badge } from 'react-bootstrap';
//import FirstLetterUpperCase from '../../Utils/FirstLetterUpperCase';
import UserAuthServices from '../../Utils/UserAuthServices';
/* AlertSnackbar,*/
import incomingCall from "../../assets/Sounds/incomingCall.wav";

export const VideoCall: React.FC = () => {
    
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const localStream = useRef<MediaStream | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const receiverId = useRef<string>("");
    //const [receiverName, setReceiverName] = useState<string>("Unknown");
    const [isOfferState, setIsOfferState] = useState<boolean>(true);
    const [isConnectionStablish, setIsConnectionStablish] = useState<boolean>(false);
    const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
    const [isMicOn, setIsMicOn] = useState<boolean>(true);
    const [isOnCall, setIsOnCall] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [data, setData] = useState<IUserData[]>([{ id: "", profilePhotoUrl: null, userName: "" }]);
    const [audioTrackState, setAudioTrackState] = useState<MediaStreamTrack | undefined>(undefined);
    const [probando, setProbando] = useState<boolean>(false)
    const [isRenegotiated, setIsRenegotiated] = useState<boolean>(false);
    const [alertSnackbarData, setAlertSnackbarData] = useState<AlertSnackbarType>({ message: "", isOpen: false, severity: "info" });
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const videocallComunicationHandlerRef = useRef<VideoCallComnicationHandler | null>(null);

    const theme = useTheme();
    const isMediumScreen = useMediaQuery(theme.breakpoints.up('md'));

    const [position, setPosition] = useState({ top: '5vh', left: isMediumScreen ? '75vw' : '0' });

    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const user_name = user.userName;
    const user_photo = user.profilePhotoUrl
    const user_id = user.id;

    const user_data: IProfileData = { name: user_name, photo: user_photo };

    const { connected, conn } = useVideocallSignalServer();
    let connection: HubConnection;


    useEffect(() => {
        const url = ServerLinks.getVideocallUsersUrl(user_id);

        axios.get(url).then((res) => {
            setLoading(false);
            setData(res.data);
        }).catch((err) => {
            setError(true);
            setLoading(false);
            console.warn(err);
        });
    }, [user_id])

    useEffect(() => {
        if (connected) {
            connection = conn?.connection;
            if (peerConnection.current) {
                if (!videocallComunicationHandlerRef.current) {
                    videocallComunicationHandlerRef.current = VideoCallComnicationHandler.getInstance({
                        onOfferStateChange: setIsOfferState,
                        onConnectionEstablished: setIsConnectionStablish,
                        onRenegotiated: setIsRenegotiated,
                        connection: connection,
                        peerConnection: peerConnection.current
                    });
                }
            }

            connection.on('renegotiation', async (sender_id: string, receiver_id: string, sdp: string) => {
                videocallComunicationHandlerRef.current!.handleRenegotiation(sender_id, receiver_id, sdp);
            });

            connection.on('callexit', async () => {
                handleAlertSnackbar("DISCONNECTED");
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = null;
                }

                if (peerConnection.current) {
                    peerConnection.current.close();
                    peerConnection.current = null;
                }
                setIsOnCall(false);
            });

            connection.on('offervideonotification', async (sender_id: string, receiver_id: string, isAccepted: boolean) => {
                const callSound = new Audio(incomingCall);
                callSound.play();

                if (isAccepted) {
                    receiverId.current = receiver_id;
                    const res = await UserAuthServices.SearchUserById(receiver_id, sender_id);
                    if (res.success) {
                        //setReceiverName(res.singleUser.userName);
                    }
                    setTimeout(() => {
                        VideocallServerServices.SendConnectedVideoNotification(sender_id, receiver_id);
                        callSound.pause();
                    }, 5000);
                }
                else {
                    if (user_id === sender_id) {
                        handleAlertSnackbar("REJECTION");
                        setIsOnCall(false);
                        callSound.pause();
                    }

                }
            });

            connection.on('connectedvideonotification', async (sender_id: string, receiver_id: string) => {
                console.log(receiver_id + " " + sender_id)
                if (user_id === receiver_id) {
                    const res = await UserAuthServices.SearchUserById(sender_id, receiver_id);
                    if (res.success) {
                        //setReceiverName(res.singleUser.userName);
                    }
                    setTimeout(async () => {
                        setIsOnCall(true);
                        await videocallComunicationHandlerRef.current!.handleAnswer(sender_id, receiver_id);
                    }, 2000);
                } else if (user_id === sender_id) {
                    const res = await UserAuthServices.SearchUserById(receiver_id, sender_id);
                    if (res.success) {
                        //setReceiverName(res.singleUser.userName);
                    }
                    setIsOnCall(true);
                    await videocallComunicationHandlerRef.current!.handleCall(sender_id, receiver_id);
                }
            });

            return () => {
                connection.off('callexit');
                connection.off('offervideonotification');
                connection.off('connectedvideonotification');
                connection.off('offericecandidate');
                connection.off('answericecandidate');
                connection.off('renegotiation');

            };
        }
    }, [connected, conn, isRenegotiated]);

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isDragging]);

    useEffect(() => {
        peerConnection.current = new RTCPeerConnection()
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        })
            .then(stream => {
                localStream.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    // videoRef.current.play();
                }
                if (peerConnection.current) {
                    stream.getTracks().forEach(track => {
                        peerConnection.current!.addTrack(track, stream);
                    });
                }
            })
            .catch(error => {
                console.error('Error obteniendo los datos del video:', error);
                dispatch(toggleErrorModal({ status: true, message: "The Camara/Mic Already In Use." }));
            });

        peerConnection.current.onnegotiationneeded = async () => {
            if (probando) {
                peerConnection.current!.createOffer()
                    .then((offer) => peerConnection.current!.setLocalDescription(offer))
                    .then(() =>
                        VideocallServerServices.SendRenegotiation(user_id, receiverId.current, JSON.stringify({
                            type: peerConnection.current!.localDescription?.type,
                            sdp: peerConnection.current!.localDescription?.sdp,
                        })
                        )).catch((err) => {
                            console.log(err);
                            dispatch(toggleErrorModal({ status: true, message: "Call Failed." }));
                        });
            }
        };

        peerConnection.current.ontrack = event => {
            event.streams.forEach(stream => {
                const remoteVideo = remoteVideoRef.current;
                if (remoteVideo) {
                    if (remoteVideo.srcObject) {
                        setIsOnCall(true);
                        remoteVideo.pause();
                        remoteVideo.srcObject = stream;
                    } else {
                        setIsOnCall(true);
                        remoteVideo.srcObject = stream;
                        remoteVideo.addEventListener('loadedmetadata', () => {
                            remoteVideo.play().catch(error => {
                                setIsOnCall(false);
                                console.error("Error al intentar reproducir el video:", error);
                                dispatch(toggleErrorModal({ status: true, message: "Video Playback Error." }));
                            });
                        }, { once: true });
                    }
                }
            });
        };
    }, [isVideoOn, isMicOn, isOfferState, isConnectionStablish, user_id, probando, isRenegotiated]);


    useEffect(() => {
        if (alertSnackbarData.isOpen && alertSnackbarData.message) {
            if (alertSnackbarData.severity === "warning" || alertSnackbarData.severity === "error") {
                dispatch(toggleErrorModal({ status: true, message: alertSnackbarData.message }));
            }
        }
    }, [])
    const handleMicState = () => {
        if (localStream.current) {
            const audioTrack = localStream.current.getAudioTracks()[0];
            setAudioTrackState(audioTrack);
            if (audioTrack && isMicOn) {
                localStream.current.removeTrack(audioTrack);
                setIsMicOn(!isMicOn);
                audioTrack.stop();
                return;
            }
            setIsMicOn(!isMicOn);
            if (audioTrackState) {
                localStream.current.addTrack(audioTrackState);
            }
        }
    };

    const handleVideoState = async () => {
        if (localStream.current) {
            const videoTrack = localStream.current.getVideoTracks()[0];
            setProbando(true);
            if (videoTrack) {
                if (isVideoOn) {
                    const senders = peerConnection.current!.getSenders();
                    const videoSender = senders.find(sender => sender.track!.kind === 'video');

                    if (videoSender) {
                        await videoSender.replaceTrack(null);
                    }

                    localStream.current.removeTrack(videoTrack);
                    videoTrack.stop();
                    videoRef.current!.srcObject = null;
                } else {
                    try {
                        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                        const newVideoTrack = stream.getVideoTracks()[0];

                        if (newVideoTrack) {
                            const senders = peerConnection.current!.getSenders();
                            const videoSender = senders.find(sender => sender.track!.kind === 'video');

                            if (videoSender) {
                                await videoSender.replaceTrack(newVideoTrack);
                            }

                            localStream.current.addTrack(newVideoTrack);
                        }
                    } catch (error) {
                        console.error('Error obteniendo video:', error);
                        dispatch(toggleErrorModal({ status: true, message: "Unable To Connect To Camara." }));
                    }
                }
            }
            setIsVideoOn(!isVideoOn);
        }
    };

    const handleAlertSnackbar = (type: string) => {
        if (type == "DISCONNECTED") {
            setAlertSnackbarData({ message: "El usuario se ha desconectado", isOpen: true, severity: "warning" })
            dispatch(toggleErrorModal({ status: true, message: "User Disconnected." }));

        }
        if (type == "REJECTION") {
            setAlertSnackbarData({ message: "La conexion ha sido rechazada", isOpen: true, severity: "error" })
            dispatch(toggleErrorModal({ status: true, message: "Connection Not Established." }));
        }
    }

    /*const handleSnackbarClose = () => {
        setAlertSnackbarData((prevState) => ({ ...prevState, isOpen: false }));
    };*/

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setOffset({
            x: e.clientX - parseInt(position.left),
            y: e.clientY - parseInt(position.top),
        });
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length > 0) {
            setIsDragging(true);
            setOffset({
                x: e.touches[0].clientX - parseInt(position.left),
                y: e.touches[0].clientY - parseInt(position.top),
            });
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) {
            setPosition({
                top: `${e.clientY - offset.y}px`,
                left: `${e.clientX - offset.x}px`,
            });
        }
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (isDragging && e.touches.length > 0) {
            setPosition({
                top: `${e.touches[0].clientY - offset.y}px`,
                left: `${e.touches[0].clientX - offset.x}px`,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    const { state } = useLocation();
    const [searchParams] = useSearchParams();
    const [externalCall] = useState(searchParams.get("externalCall") || false);

    useEffect(() => {
        if (externalCall) {
            const data = { name: state.name, photo: state.photo }
            VideocallServerServices.SendVideoNotification(user_id, state.id, JSON.stringify(data));
        }
    }, []);

    return (
        <Box id="Video-Main-Container">
            <Box id="Video-Container">
                {isVideoOn ?
                    <Box id="Video-Main-Container-Child">
                        <video
                            id="local"
                            style={{
                                borderRadius: "1rem",
                                maxWidth: '100%',
                                height:'auto'
                            }}
                            autoPlay
                            ref={videoRef}
                            onClick={() => {
                                console.log(remoteVideoRef.current?.srcObject); remoteVideoRef.current!.play();
                            }} />
                       
                    </Box>
                    :
                    <Box id="Video-Main-Container-No-Camera">
                        <VideocamOffIcon sx={{
                            fontSize: "4rem",
                            color: "white"
                        }} /></Box>
                }

                {isOnCall && <Box id="Video-Main-Container-Floaty"
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                >
                    <video
                        id='remoto'
                        style={{
                            borderRadius: "1rem",
                            maxWidth: '100%',
                            height: 'auto' }}
                        autoPlay
                        ref={remoteVideoRef}
                    />
                </Box>}
            </Box>

            <Box id="Video-Button">
                <VideoCallButton onClick={handleMicState}>{isMicOn ? < MicIcon /> : <MicOffIcon />}</VideoCallButton>
                <VideoCallButton onClick={handleVideoState}>{isVideoOn ? < VideocamIcon /> : <VideocamOffIcon />}</VideoCallButton>
                <VideoCallButton onClick={() => { dispatch(openVideoSettingModal()); }}>{<SettingsIcon />}</VideoCallButton>
                <SendModal Users={data} loading={loading} error={error} data={user_data} />
                {isOnCall &&
                    <VideoCallButton bgcolor={"#ff4343"} bgcolorHover={"#ff6666"} onClick={(() => {
                        if (videocallComunicationHandlerRef.current) {
                            videocallComunicationHandlerRef.current?.handleLeaveCall(videoRef, remoteVideoRef)
                        }
                        else {
                            navigate("/chats/videocall")
                        }
                    })}>END</VideoCallButton>}
            </Box>
        </Box>
    );
}

/** {alertSnackbarData!.isOpen &&
<AlertSnackbar
message={alertSnackbarData!.message}
isOpen={alertSnackbarData!.isOpen}
severity={alertSnackbarData!.severity}
onClose={handleSnackbarClose} />}   <Badge
                            bg="primary"
                            style={{
                                position: "absolute",
                                top: "1rem",
                                left: "1rem",
                                zIndex: "1000"
                            }}>{FirstLetterUpperCase(user_name)}</Badge> */