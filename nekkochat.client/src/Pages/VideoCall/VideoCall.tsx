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
import { useSelector, useDispatch } from "react-redux"

import { VideoCallButton } from './Components/VideoCallButtom';
import { IUserData, SendModal } from './Components/SendModal';
import { videocallUserSliceActions } from '../../StateManagement/VideocallUserRedux';
import { RootState } from '../../StateManagement/VideocallStore';

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

    userDispatch(videocallUserSliceActions.setId(videoId))

    const connection = new HubConnectionBuilder()
        .withUrl("https://localhost:7198/videocallhub", { withCredentials: false })
        .withAutomaticReconnect()
        .build();

    connection.start().catch((err) => console.error(err));

    //Cambiar por fetch
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
    //Busca guardar el answer de la conexion para usarlo cuando sea necesario
    //Este dato busca guardar los datos del offer del dispositivo 1 para ser usado en el dispositivo 2, viene de HandleCall
    connection.on('offer', async (sdp) => {
        try {
            if (peerConnection.current) {
                answer = JSON.parse(sdp); 
            }
        } catch (error) {
            console.error('Error al actualizar la descripción de sesión SDP:', error);
        }
    });

    //connection.invoke('ConnectedVideoNotification', event.candidate).catch((err) => console.error(err));

    const isAnsweredByUser = useSelector((state: RootState) => state.videocallUser.isVideocallAnswered)

    //esto estaria mal, buscar otra idea para arreglarlo
    connection.on('offervideonotification', async () => {
        console.log("lo mando")
        setTimeout(() => {
            connection.invoke('ConnectedVideoNotification').catch((err) => console.error(err));
        }, 5000);
    });

    //usaria el autenticacion pero es mejor asi para fines de prueba
    connection.on('connectedvideonotification', () => {
        console.log("llegue aqui despues de mandar")
        if (videoId == "1") {
            console.log("yo conteste ")
            setTimeout(() => {
                handleAnswer();
            }, 1000);
        }
        else if (videoId == "2") {
            console.log("hice la llamada")
            handleCall();
        }
    });

    let offerCandidate: RTCIceCandidateInit | null = null;
    //Guarda el offer candidate para utilizarlo despues del intercambio de offer y answer
    connection.on('offericecandidate', (candidate) => {
        console.log("offericecandidate")
        offerCandidate = JSON.parse(candidate)
    });

    let AnswerCandidate: RTCIceCandidateInit | null = null;
    //Guarda el answer candidate para utilizarlo despues del intercambio de offer y answer
    connection.on('answericecandidate', (candidate) => {
        console.log("answericecanidate")
         AnswerCandidate = JSON.parse(candidate);
    });

    useEffect(() => {
        //aqui los datos principales de video y sonido, aqui es donde se piden
        //TODO: no se pueden desactivar el sonido y el audio juntos, solo uno a la vez
        peerConnection.current = new RTCPeerConnection()
        navigator.mediaDevices.getUserMedia({
            video: isVideoOn,
            audio: isMicOn,
        })
            .then(stream => {
                //si hay un stream de video local lo establece
                localStream.current = stream;
                const video = videoRef.current;
                if (video && isVideoOn) {
                    //se pasa el src con el stream
                    video.srcObject = stream;
                    video.play();
                }
                if (!peerConnection.current) {
                    peerConnection.current = new RTCPeerConnection();
                }
                stream.getTracks().forEach(track => {
                    //se greagan los tracks, estos son los otros videos
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

        //Hacer un mejor manejo de errores y crear reconexion
        peerConnection.current.onicecandidateerror = (event) => {
            console.log('error conexión ICE: ', event);
        };

        //En este track se agrega el video remoto
        peerConnection.current.ontrack = event => {
            if (event.streams.length > 0) {
                const stream = event.streams[0];

                const remoteVideo = remoteVideoRef.current;
                if (remoteVideo) {
                    remoteVideo.srcObject = stream;
                    //seTimeOut es para esperar un poco para que el video remoto pueda cambiar
                    setTimeout(() => {
                        remoteVideo.play();
                    }, 100);
                }
            }
        };

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
                //Si esta en el estado de have-remote-offer no se vuelve a crear la oferta
                if (peerConnection.current.signalingState === 'have-remote-offer') {
                    console.error('La conexion ya tiene una descripcion de sesión SDP remota establecida');
                    return;
                }

                //identificador para saber quien es el ofertante
                isOfferState = true;

                //Se crea la oferta
                const offer: RTCLocalSessionDescriptionInit = await peerConnection.current.createOffer();

                // se establece la descripcion local
                await peerConnection.current.setLocalDescription({ type: 'offer', sdp: offer.sdp });

                //se toma el iceCandidate del dispostivo que llama,ICE es (Interactive Connectivity Establishment)
                //es necesario el ice al final del establecimiento de la oferta y respuesta
                peerConnection.current.onicecandidate = event => {
                    if (event.candidate) {
                        console.log("SendOfferIceCandidate")
                        connection.invoke('SendOfferIceCandidate', JSON.stringify(event.candidate)).catch((err) => console.error(err));
                    }
                };

                //se invoca el offer con los datos de la oferta, esta busca enviarle la offerta al segundo dispositivo
                await connection.invoke('Offer', JSON.stringify(offer)).catch((err) => console.error(err));

                //Este se mantiene escuchando hasta que handleAnswer envie la respuesta de la conexion
                const offerAnswer:string = await new Promise((resolve) => {
                    connection.on('answer', (sdp) => {
                        resolve(sdp);
                    });
                });

                //Se usa esa respuesta y se establece la conexion
                // Se establece la conexion remota
                //Ya aqui los dos dispositivos saben quienen son y como llamarse
                const answerDescription = JSON.parse(offerAnswer);
                await peerConnection.current.setRemoteDescription(answerDescription);

                //Se establecen los ICE candidate, mas informacion aqui https://developer.mozilla.org/en-US/docs/Glossary/ICE
                isConnectionStablish = true;
                handleStablishIce();

            } catch (error) {
                console.error('Error creando la oferta:', error);
            }
        }
    };

    const handleAnswer = async () => {
        if (peerConnection.current && answer) {
            try {
                console.log("answer", isAnsweredByUser);
                isOfferState = false;

                //Usa la respuesta del offertante que se paso por signal R
                //Se establece la descripcion remota del dispositivo 1 y se crea una respuesta
                //se establece la descripcion local con todos los datos
                await peerConnection.current.setRemoteDescription(answer);
                const answerAnswer: RTCLocalSessionDescriptionInit = await peerConnection.current.createAnswer()
                await peerConnection.current.setLocalDescription(answerAnswer);

                //Se envia el ice candidate, este se guarda para cuando sea necesario
                peerConnection.current.onicecandidate = event => {
                    if (event.candidate) {
                        console.log("SendAnswerIceCandidate")
                        connection.invoke('SendAnswerIceCandidate', JSON.stringify(event.candidate)).catch((err) => console.error(err));
                    }
                };

                //Se envia la respuesta creada a create answer
                await connection.invoke('Answer', JSON.stringify(answerAnswer)).catch((err) => console.error(err));

                isConnectionStablish = true;
                handleStablishIce();

            } catch (error) {
                console.error('Error enviando la respuesta:', error);
            }
        }
    };

    const handleStablishIce = () => {
        //Si la conexion esta establecida se aplican cada uno de los ice candidate
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


/*
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        localStream.current = stream;
        stream.getTracks().forEach(track => {
            peerConnection.current?.addTrack(track, stream);
        });
    })
    .catch(error => console.error('Error obteniendo los datos del video:', error));*/

//no hace nada realmente pero quiero usarlo para cuando la conexion este establecida
/*connection.on("connectionStarted", () => {
    console.log('Conexión establecida');
    if (peerConnection.current) {
        peerConnection.current.onicecandidate = event => {
            if (event.candidate) {
                console.log('Enviando ice candidate:', event.candidate);
                connection.invoke('SendIceCandidate', event.candidate).catch((err) => console.error(err));
            }
        };
    }
});*/