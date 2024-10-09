import Box from '@mui/material/Box';
import React, { useRef, useEffect, useState } from 'react';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import SendIcon from '@mui/icons-material/Send';
//import { useParams } from 'react-router-dom';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { useParams } from 'react-router-dom';
import { useDispatch } from "react-redux"
import { userSliceActions } from '../../StateManagement/UserRedux';
import { VideoCallButton } from './Components/VideoCallButtom';
import { IUserData, SendModal } from './Components/SendModal';



export const VideoCall: React.FC = () => {

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const localStream = useRef<MediaStream | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

    let [isOfferState] = useState<boolean>(true);
    let [isConnectionStablish] = useState<boolean>(false);

    const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
    const [isMicOn, setIsMicOn] = useState<boolean>(true);


    const { videoId } = useParams();

    const userDispatch = useDispatch();

    userDispatch(userSliceActions.setState(videoId))

    const connection = new HubConnectionBuilder()
        .withUrl("https://localhost:7198/videocallhub", { withCredentials: false })
        .withAutomaticReconnect()
        .build();

    connection.start().catch((err) => console.error(err));

    const userMock: IUserData[] = [
        {
            ProfileImage: "",
            username: "jhon",
            id: "1"
        },
        {
            ProfileImage: "",
            username: "Doe",
            id: "2"
        },
        {
            ProfileImage: "",
            username: "Jane",
            id: "3"
        },
        {
            ProfileImage: "",
            username: "Doena",
            id: "4"
        },
        {
            ProfileImage: "",
            username: "Lenny",
            id: "5"
        },
    ]

    let answer: RTCSessionDescriptionInit;

    connection.on('offer', async (sdp) => {
        try {
            if (peerConnection.current) {
                answer = JSON.parse(sdp); 
            }
        } catch (error) {
            console.error('Error al actualizar la descripción de sesión SDP:', error);
        }
    });

    connection.on("connectionStarted", () => {
        console.log('Conexión establecida');
        if (peerConnection.current) {
            peerConnection.current.onicecandidate = event => {
                if (event.candidate) {
                    console.log('Enviando ice candidate:', event.candidate);
                    connection.invoke('SendIceCandidate', event.candidate).catch((err) => console.error(err));
                }
            };
        }  
    });

    let offerCandidate: RTCIceCandidateInit | null = null;

    connection.on('offericecandidate', (candidate) => {
        console.log("offericecandidate")
        offerCandidate = JSON.parse(candidate)
    });

    let AnswerCandidate: RTCIceCandidateInit | null = null;

    connection.on('answericecandidate', (candidate) => {
        console.log("answericecanidate")
         AnswerCandidate = JSON.parse(candidate);
       
    });

    useEffect(() => {
      
        peerConnection.current = new RTCPeerConnection()
        navigator.mediaDevices.getUserMedia({
            video: isVideoOn,
            audio: isMicOn,
        })
            .then(stream => {
                localStream.current = stream;
                const video = videoRef.current;
                if (video && isVideoOn) {
                    video.srcObject = stream;
                   
                    video.play();
                   
                }
                if (!peerConnection.current) {
                    peerConnection.current = new RTCPeerConnection();
                }
                stream.getTracks().forEach(track => {
                    peerConnection.current?.addTrack(track, stream);
                });
            })
            .catch(error => console.error('Error obteniendo los datos del video:', error));

       /* peerConnection.current.onconnectionstatechange = event => {
           console.log("connection state", event)
        };*/
      
        peerConnection.current.oniceconnectionstatechange = (event) => {
            console.log('Cambio de estado de la conexión ICE: ' + event, peerConnection.current?.iceConnectionState);
        };

        peerConnection.current.onicecandidateerror = (event) => {
            console.log('error conexión ICE: ', event);
        };

        

        peerConnection.current.ontrack = event => {
            if (event.streams.length > 0) {
                const stream = event.streams[0];

                const remoteVideo = remoteVideoRef.current;
                if (remoteVideo) {
                    remoteVideo.srcObject = stream;
                    setTimeout(() => {
                        remoteVideo.play();
                    }, 100);
                }
            }
        };

        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                localStream.current = stream;
                stream.getTracks().forEach(track => {
                    peerConnection.current?.addTrack(track, stream);
                });
            })
            .catch(error => console.error('Error obteniendo los datos del video:', error));

    }, [isVideoOn, isMicOn, connection, isOfferState, isConnectionStablish, AnswerCandidate, offerCandidate]);

    const handleVideoState = () => {
        setIsVideoOn(() => !isVideoOn);
    };

    const handleMicState = () => {
        setIsMicOn(() => !isMicOn);
    };

    const handleCall = async () => {
        if (peerConnection.current) {
            try {
                if (peerConnection.current.signalingState === 'have-remote-offer') {
                    console.error('La conexion ya tiene una descripcion de sesión SDP remota establecida');
                    return;
                }

                isOfferState = true;

                const offer: RTCLocalSessionDescriptionInit = await peerConnection.current.createOffer();

                await peerConnection.current.setLocalDescription({ type: 'offer', sdp: offer.sdp });

                peerConnection.current.onicecandidate = event => {
                    if (event.candidate) {
                        console.log("SendOfferIceCandidate")
                        connection.invoke('SendOfferIceCandidate', JSON.stringify(event.candidate)).catch((err) => console.error(err));
                    }
                };

                await connection.invoke('Offer', JSON.stringify(offer)).catch((err) => console.error(err));

                const offerAnswer:string = await new Promise((resolve) => {
                    connection.on('answer', (sdp) => {
                        resolve(sdp);
                    });
                });

                const answerDescription = JSON.parse(offerAnswer);
                await peerConnection.current.setRemoteDescription(answerDescription);

                isConnectionStablish = true;
                handleStablishIce();

                console.log("ALL STATE OF THE CONNECTION IN OFFER: " +
                    peerConnection.current.connectionState + " " +
                    peerConnection.current.iceConnectionState + " " +
                    peerConnection.current.iceGatheringState
                );
            } catch (error) {
                console.error('Error creando la oferta:', error);
            }
        }
    };

    const handleAnswer = async () => {
        if (peerConnection.current && answer) {
            try {

                isOfferState = false;

                await peerConnection.current.setRemoteDescription(answer);
                const answerAnswer: RTCLocalSessionDescriptionInit = await peerConnection.current.createAnswer()
                await peerConnection.current.setLocalDescription(answerAnswer);

                peerConnection.current.onicecandidate = event => {
                    if (event.candidate) {
                        console.log("SendAnswerIceCandidate")
                        connection.invoke('SendAnswerIceCandidate', JSON.stringify(event.candidate)).catch((err) => console.error(err));
                    }
                };

                await connection.invoke('Answer', JSON.stringify(answerAnswer)).catch((err) => console.error(err));

                isConnectionStablish = true;
                handleStablishIce();

            } catch (error) {
                console.error('Error enviando la respuesta:', error);
            }
        }
    };

    const handleStablishIce = () => {
        if (isConnectionStablish == true) {
            if (isOfferState == true) {
                console.log("aplique el offer ice que necesito", AnswerCandidate)
                peerConnection.current?.addIceCandidate(new RTCIceCandidate(AnswerCandidate!));
            }
            else {
                console.log("aplique el answer ice que necesito", offerCandidate)
                peerConnection.current?.addIceCandidate(new RTCIceCandidate(offerCandidate!));
            }
        }
    }
    
    return (
            <Box sx={{ margin: 0, padding:0, height: "100vh", width: "100vw", backgroundColor: "#555", overflow: "hidden" }}>
                <Box sx={{
                    height: "80vh",
                    position:"relative",
                    width: "80vw",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "1rem",
                    margin:"2rem",


                }}>
                    {isVideoOn ?
                    < video id="local" style={{ borderRadius: "1rem", height: "90vh", }} autoPlay ref={videoRef} >
                        {!isVideoOn && <Box sx={{
                            backgroundColor: "#555",
                            height: "15rem",
                            width: "15rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "1rem"
                        }}>
                            <VideocamOffIcon sx={{
                                fontSize: "4rem",
                                color: "white"
                            }} />
                        </Box>}
                    </video>
                        :
                        <Box sx={{
                            backgroundColor: "#777",
                            height: "75vh",
                            width: "60vw",
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
                    <SendModal Users={userMock}/>
                    <VideoCallButton onClick={handleCall}><SendIcon></SendIcon></VideoCallButton>
                    <VideoCallButton onClick={handleAnswer}>recibir</VideoCallButton>
                    <VideoCallButton onClick={handleMicState}>{isMicOn ? < MicIcon /> : <MicOffIcon />}</VideoCallButton>
                    <VideoCallButton onClick={handleVideoState}>{isVideoOn ? < VideocamIcon /> : <VideocamOffIcon />}</VideoCallButton>
                    <VideoCallButton>salir</VideoCallButton>
                </Box>

                <Box sx={{
                    height: "15rem",
                    width: "15rem",
                    position:"absolute",
                    top: "5vh",
                    left: "70vw",
                    zIndex:"10",
                    display: "block",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "1rem"

                }}>
                    {remoteVideoRef ?
                    <video id='remoto' style={{ borderRadius: "1rem", width: "15rem", height: "15rem", zIndex: "2" }} autoPlay ref={remoteVideoRef}> </video>
                        :
                        <Box sx={{
                            backgroundColor: "#555",
                            height: "15rem",
                            width: "15rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "1rem"
                        }}>
                            <VideocamOffIcon sx={{
                                fontSize: "4rem",
                                color: "white"
                        }} />
                    </Box>
                    }
                   
                </Box>
            </Box>
    );
}
/* await new Promise((resolve: (Promise:void) => void) => {
                   connection.on('icecandidate', (candidate) => {
                       if (peerConnection.current) {
                           peerConnection.current.addIceCandidate(candidate);
                           resolve();
                       }
                   });
               });*/

/* peerConnection.current.onicecandidate = event => {
    if (event.candidate) {
         console.log("SendOfferIceCandidate")
         connection.invoke('SendOfferIceCandidate', event.candidate.candidate).catch((err) => console.error(err));
    }
};

await new Promise((resolve: (value: void) => void) => {
    connection.on('answericecandidate', (candidate) => {
            console.log("answericecanidate")
            peerConnection.current?.addIceCandidate(new RTCIceCandidate(candidate));
            resolve()
    });
});*/

/* await new Promise((resolve: (value: void) => void) => {
    connection.on('offericecandidate', (candidate) => {
            console.log("offericecandidate")
            peerConnection.current?.addIceCandidate(new RTCIceCandidate(candidate));
            resolve()
    });
});

peerConnection.current.onicecandidate = event => {
    if (event.candidate) {
        console.log("SendAnswerIceCandidate")
        connection.invoke('SendAnswerIceCandidate', event.candidate.candidate).catch((err) => console.error(err));
    }
};*/