import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import React, { useRef, useEffect, useState } from 'react';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
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
import { AlertSnackbar, AlertSnackbarType } from './Components/AlertSnackbar';
import { VideoCallComnicationHandler } from './Components/Handlers/VideoComunicationHandler';
import { HubConnection } from '@microsoft/signalr';

export const VideoCall: React.FC = () => {

    const navigate = useNavigate();

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const localStream = useRef<MediaStream | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const receiverId = useRef<string>("");
    const [isOfferState, setIsOfferState] = useState<boolean>(true);
    const [isConnectionStablish, setIsConnectionStablish] = useState<boolean>(false);
    const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
    const [isMicOn, setIsMicOn] = useState<boolean>(true);
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

    const [position, setPosition] = useState({ top: '5vh', left: isMediumScreen? '75vw' : '0' });
    
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
            });

            connection.on('offervideonotification', async (sender_id: string, receiver_id: string, isAccepted:boolean) => {
                if (isAccepted) {
                    receiverId.current = receiver_id;
                    setTimeout(() => {
                        VideocallServerServices.SendConnectedVideoNotification(sender_id, receiver_id);
                    }, 5000);
                }
                else {
                    if (user_id === sender_id) {
                        handleAlertSnackbar("REJECTION");
                    }
                    
                }
            });

            connection.on('connectedvideonotification', async (sender_id: string, receiver_id: string) => {
                console.log(receiver_id + " " + sender_id)
                if (user_id === receiver_id) {
                    setTimeout( async () => {
                        await videocallComunicationHandlerRef.current!.handleAnswer(sender_id, receiver_id);
                    }, 2000);
                } else if (user_id === sender_id) {
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
            .catch(error => console.error('Error obteniendo los datos del video:', error));

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
                        });
            }
        };

        peerConnection.current.ontrack = event => {
            event.streams.forEach(stream => {
                const remoteVideo = remoteVideoRef.current;
                if (remoteVideo) {
                    if (remoteVideo.srcObject) {
                        remoteVideo.pause(); 
                        remoteVideo.srcObject = stream;
                        
                    } else {

                        remoteVideo.srcObject = stream;
                        remoteVideo.addEventListener('loadedmetadata', () => {
                            remoteVideo.play().catch(error => {
                                console.error("Error al intentar reproducir el video:", error);
                            });
                        }, { once: true });
                    }
                }
            });
        };
        
       

    }, [isVideoOn, isMicOn, isOfferState, isConnectionStablish, user_id, probando, isRenegotiated]);

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
                    }
                }
            }
            setIsVideoOn(!isVideoOn);
        }
    };

    const handleAlertSnackbar = (type:string) => {
        if (type == "DISCONNECTED") {
            setAlertSnackbarData({ message: "El usuario se ha desconectado", isOpen: true, severity: "warning" })
        }
        if (type == "REJECTION") {
            setAlertSnackbarData({ message: "La conexion ha sido rechazada", isOpen: true, severity: "error" })
        }
    }

    const handleSnackbarClose = () => {
        setAlertSnackbarData((prevState) => ({ ...prevState, isOpen:false}));
    };

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
    
    return (
        <Box sx={{
            margin: 0,
            padding: 0,
            height: "105vh",
            width: "100vw",
            backgroundColor: "#DBDBDB",
            overflowY: "hidden",
        }}>
            <AlertSnackbar message={alertSnackbarData!.message} isOpen={alertSnackbarData!.isOpen} severity={alertSnackbarData!.severity} onClose={handleSnackbarClose} /> 
                <Box sx={{
                    height: "80vh",
                    position:"relative",
                    width: "80vw",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                borderRadius: "1rem",
                margin: isMediumScreen? "3rem 5rem 0.5rem 5rem": "-1rem 0 0 2.4rem",


                }}>
                {isVideoOn ?
                    < video id="local" style={{ borderRadius: "1rem", height: isMediumScreen ? "90vh" : "auto", width: isMediumScreen ? "auto" : "100vw", }} autoPlay ref={videoRef} onClick={() => { console.log(remoteVideoRef.current?.srcObject); remoteVideoRef.current!.play(); }} />
                        :
                        <Box sx={{
                        backgroundColor: "#777",
                        height: isMediumScreen ? "75vh" : "60vh",
                        width: isMediumScreen ?"60vw" : "110vw",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "1rem"
                        }}>
                            <VideocamOffIcon sx={{
                                fontSize: "4rem",
                                color: "white"
                            }} /></Box>
                    }
                   
                </Box>
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    
            }}>
                <SendModal Users={data} loading={loading} error={error} data={user_data} />
                <VideoCallButton  onClick={handleMicState}>{isMicOn ? < MicIcon /> : <MicOffIcon />}</VideoCallButton>
                <VideoCallButton onClick={handleVideoState}>{isVideoOn ? < VideocamIcon /> : <VideocamOffIcon />}</VideoCallButton>
                <VideoCallButton bgcolor={"#ff4343"} bgcolorHover={"#ff6666"} onClick={(() => {
                    if (videocallComunicationHandlerRef.current) {
                        videocallComunicationHandlerRef.current?.handleLeaveCall(videoRef, remoteVideoRef)
                    }
                    else {
                        navigate("/")
                    }
                    
                })}>salir</VideoCallButton>
                </Box>

            <Box sx={{
                height: "15rem",
                width: "15rem",
                position: "absolute",
                top: position.top,
                left: position.left,
                zIndex: "10",
                display: "block",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "1rem",
                cursor: isDragging ? 'grabbing' : 'grab',
            }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
            >
                <video
                    id='remoto'
                    style={{ borderRadius: "1rem", width: "100%", height: "100%", zIndex: "2" }}
                    autoPlay
                    ref={remoteVideoRef}
                />
            </Box>
            </Box>
    );
}