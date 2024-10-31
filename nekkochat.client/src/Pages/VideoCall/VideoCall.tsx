/* eslint-disable @typescript-eslint/no-unused-vars */
import Box from '@mui/material/Box';
import React, { useRef, useEffect, useState } from 'react';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
//import SendIcon from '@mui/icons-material/Send';
//import { useParams } from 'react-router-dom';
import VideocallServerServices from '../../Utils/VideoCallService'
import { VideoCallButton } from './Components/VideoCallButtom';
import { IUserData, SendModal, IProfileData } from './Components/SendModal';
import useVideocallSignalServer from '../../Hooks/useVideocallSignalR';
import ServerLinks from '../../Constants/ServerLinks';
import axios from 'axios';
import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AlertSnackbar, AlertSnackbarType } from './Components/AlertSnackbar';
//import { useAppSelector } from '../../Hooks/storeHooks';
//import useGetUser from '../../Hooks/useGetUser';

/// CADA CONNECTION ID CAMBIA, ver como mantenerlo
export const VideoCall: React.FC = () => {

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const localStream = useRef<MediaStream | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const receiverId = useRef<string>("");
    let [isOfferState] = useState<boolean>(true);
    let [isConnectionStablish] = useState<boolean>(false);
    const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
    const [isMicOn, setIsMicOn] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [data, setData] = useState<IUserData[]>([{ id: "", profilePhotoUrl: null, userName: "" }]);
   // const [videoTrackState, setVideoTrackState] = useState<MediaStreamTrack | undefined>(undefined);
    const [audioTrackState, setAudioTrackState] = useState<MediaStreamTrack | undefined>(undefined);
    const [probando, setProbando] = useState<boolean>(false)
    const [isRenegotiated, setIsRenegotiated] = useState<boolean>(false);
    //const [isRemoteVideoSender, setIsRemoteVideoSender] = useState<boolean>(false);
    const [alertSnackbarData, setAlertSnackbarData] = useState<AlertSnackbarType>({ message: "", isOpen: false, severity:"info" });
    const navigate = useNavigate();

    const theme = useTheme();
    const isMediumScreen = useMediaQuery(theme.breakpoints.up('md'));
    
    const user = JSON.parse(localStorage.getItem("user") || '{}');

    const user_name = user.userName;
    const user_photo = user.profilePhotoUrl
    const user_id = user.id;

    const user_data: IProfileData = { name: user_name, photo: user_photo };
    
    const { connected, conn } = useVideocallSignalServer();

    let connection: any

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

    }, [])

    let answer: RTCSessionDescriptionInit;
    let offerCandidate: RTCIceCandidateInit | null = null;
    let AnswerCandidate: RTCIceCandidateInit | null = null;

        useEffect(() => {
        if (connected) {
            connection = conn?.connection;
            connection.on('offer', async (sdp: string) => {
                try {
                    if (peerConnection.current) {
                        answer = JSON.parse(sdp);
                    }
                } catch (error) {
                    console.error('Error al actualizar la descripción de sesión SDP:', error);
                }
            });

            connection.on('renegotiation', async (sender_id: string, receiver_id: string, sdp: string) => {
                handleRenegotiation(sender_id, receiver_id, sdp);
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
                console.log("lo mando, MANDO EL CONNECT NOTIFICATION");
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

            connection.on('connectedvideonotification', (sender_id: string, receiver_id: string) => {
                console.log("llegue aqui despues de mandar AQUI EL CONNECTED");
                console.log(receiver_id + " " + sender_id)
                if (user_id === receiver_id) {
                    console.log("yo conteste ");
                    setTimeout(() => {
                        handleAnswer(sender_id, receiver_id);
                    }, 2000);
                } else if (user_id === sender_id) {
                    console.log("hice la llamada");
                    handleCall(sender_id, receiver_id);
                }
            });

            connection.on('offericecandidate', (candidate: string) => {
                console.log("offericecandidate");
                offerCandidate = JSON.parse(candidate);
            });

            connection.on('answericecandidate', (candidate: string) => {
                console.log("answericecandidate");
                AnswerCandidate = JSON.parse(candidate);
            });

            return () => {
                connection.off('offer');
                connection.off('callexit');
                connection.off('offervideonotification');
                connection.off('connectedvideonotification');
                connection.off('offericecandidate');
                connection.off('answericecandidate');
                connection.off('renegotiation');
                
            };
            }
        }, [connected, connection, isRenegotiated]);

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
                    videoRef.current.play();
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
                    console.log("Stream recibido:", stream);
                    console.log("Tracks del stream:", stream.getTracks());
                    console.log("Tracks de video:", stream.getVideoTracks());
                   
                    if (remoteVideo.srcObject) {
                        console.log("Reemplazando el stream remoto.");
                        remoteVideo.pause(); 
                        remoteVideo.srcObject = stream;
                        
                    } else {
                        console.log("Asignando el stream remoto por primera vez.");
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
        
       

    }, [isVideoOn, isMicOn, connection, isOfferState, isConnectionStablish, AnswerCandidate, offerCandidate, user_id, probando, isRenegotiated]);

    const createOfferAndSend = async () => {
        try {
            const offerAnswer: string = await new Promise((resolve) => {
                connection?.on('answer', (sdp: string) => {
                    resolve(sdp);
                });
            });
            const answerDescription = JSON.parse(offerAnswer);
            await peerConnection.current!.setRemoteDescription(new RTCSessionDescription(answerDescription));
        } catch (error) {
            console.error("Error creando y enviando la oferta:", error);
        }
    };

    const handleRenegotiation = async (sender_id: string, receiver_id: string, sdp: string) => {
        if (user_id == sender_id) {
            console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
            setIsRenegotiated(true);
            await createOfferAndSend();
        } else {
            setTimeout(() => {
                handleAnswer(sender_id, receiver_id, sdp);
            }, 2000);
        }
    };

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
                    videoTrack.enabled = false;
                } else {
                    videoTrack.enabled = true; 
                }
            }
            setIsVideoOn(!isVideoOn);
        }
    };

    const handleCall = async (sender_id: string, receiver_id: string) => {
        if (peerConnection.current) {
            try {
                if (peerConnection.current.signalingState === 'have-remote-offer') {
                    console.error('La conexion ya tiene una descripcion de sesión SDP remota establecida');
                    return;
                }

                isOfferState = true;
                const offer: RTCLocalSessionDescriptionInit = await peerConnection.current.createOffer();
                await peerConnection.current.setLocalDescription({ type: 'offer', sdp: offer.sdp });

                 peerConnection.current.onicecandidate = async (event) => {
                    if (event.candidate) {
                        console.log("SendOfferIceCandidate")
                       await VideocallServerServices.SendOfferIceCandidate(sender_id, receiver_id, JSON.stringify(event.candidate));
                    }
                };
                await VideocallServerServices.SendOffer(sender_id, receiver_id, JSON.stringify(offer));

                const offerAnswer:string = await new Promise((resolve) => {
                    connection?.on('answer', (sdp: string) => {
                        resolve(sdp);
                    });
                });
                const answerDescription = JSON.parse(offerAnswer);
                await peerConnection.current.setRemoteDescription(answerDescription);

                isConnectionStablish = true;
                console.log("FINALIZADO")
                handleStablishIce();

            } catch (error) {
                console.error('Error creando la oferta:', error);
            }
        }
    };

    const handleAnswer = async (sender_id: string, receiver_id: string, sdp:string | null = null) => {
        if (peerConnection.current ) {
            try {
                if (!sdp) {
                    isOfferState = false;
                    await peerConnection.current.setRemoteDescription(answer);
                    const answerAnswer: RTCLocalSessionDescriptionInit = await peerConnection.current.createAnswer()
                    await peerConnection.current.setLocalDescription(answerAnswer);

                    peerConnection.current.onicecandidate = async event => {
                        if (event.candidate) {
                            await VideocallServerServices.SendAnswerIceCandidate(sender_id, receiver_id, JSON.stringify(event.candidate));
                        }
                    };
                    await VideocallServerServices.SendAnswer(sender_id, receiver_id, JSON.stringify(answerAnswer));

                    isConnectionStablish = true;
                    handleStablishIce();
                }
                else {
                    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(JSON.parse(sdp)));
                    const answerAnswer: RTCLocalSessionDescriptionInit = await peerConnection.current.createAnswer()
                    await peerConnection.current.setLocalDescription(answerAnswer);

                    peerConnection.current.onicecandidate = async event => {
                        if (event.candidate) {
                            await VideocallServerServices.SendAnswerIceCandidate(sender_id, receiver_id, JSON.stringify(event.candidate));
                        }
                    };
                    await VideocallServerServices.SendAnswer(sender_id, receiver_id, JSON.stringify(answerAnswer));
                }

            } catch (error) {
                console.error('Error enviando la respuesta:', error);
            }
        }
    };

    const handleStablishIce = () => {
        if (isConnectionStablish) {
            if (isOfferState && AnswerCandidate) {
                peerConnection.current?.addIceCandidate(new RTCIceCandidate(AnswerCandidate));
            } else if (!isOfferState && offerCandidate) {
                peerConnection.current?.addIceCandidate(new RTCIceCandidate(offerCandidate));
            }
        }
    };


    const handleLeaveCall = async () => {
        const result = await Swal.fire({
            title: 'Estas seguro?',
            text: "Quieres salir de la llamada?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, salir',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            if (localStream.current) {
                localStream.current.getTracks().forEach(track => {
                    track.stop(); 
                });
            }

            if (peerConnection.current) {
                peerConnection.current.close();
                peerConnection.current = null; 
            }

            if (videoRef.current) {
                videoRef.current.srcObject = null; 
            }
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = null; 
            }

            await VideocallServerServices.SendCallExit(user_id, receiverId.current);

            navigate("/");
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

    
    return (
        <Box sx={{
            margin: 0,
            padding: 0,
            height: "100vh",
            width: "100vw",
            backgroundColor: "#DBDBDB",
            overflowY: "hidden",
        }}>
             <AlertSnackbar message={alertSnackbarData!.message} isOpen={alertSnackbarData!.isOpen} severity={alertSnackbarData!.severity}/> 
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
                    <VideoCallButton onClick={handleMicState}>{isMicOn ? < MicIcon /> : <MicOffIcon />}</VideoCallButton>
                <VideoCallButton onClick={handleVideoState}>{isVideoOn ? < VideocamIcon /> : <VideocamOffIcon />}</VideoCallButton>
                <VideoCallButton bgcolor={"#ff4343"} bgcolorHover={"#ff6666"} onClick={handleLeaveCall}>salir</VideoCallButton>
                </Box>

                <Box sx={{
                    height: "15rem",
                    width: "15rem",
                    position:"absolute",
                    top: "5vh",
                    left: isMediumScreen? "75vw": 0,
                    zIndex:"10",
                    display: "block",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "1rem"

            }}>
                
                
                    <video id='remoto' style={{ borderRadius: "1rem", width: "15rem", height: "15rem", zIndex: "2" }} autoPlay ref={remoteVideoRef}> </video>
                   
                </Box>
            </Box>
    );
}