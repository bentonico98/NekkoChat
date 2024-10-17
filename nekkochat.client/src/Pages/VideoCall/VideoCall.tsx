import Box from '@mui/material/Box';
import React, { useRef, useEffect, useState } from 'react';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import SendIcon from '@mui/icons-material/Send';
//import { useParams } from 'react-router-dom';
import { useSelector } from "react-redux"
import VideocallServerServices from '../../Utils/VideoCallService'
import { VideoCallButton } from './Components/VideoCallButtom';
import { IUserData, SendModal } from './Components/SendModal';
import { RootState } from '../../Store/userStore';
import useVideocallSignalServer from '../../Hooks/useVideocallSignalR';
//import { useAppSelector } from '../../Hooks/storeHooks';
//import useGetUser from '../../Hooks/useGetUser';

/// CADA CONNECTION ID CAMBIA, ver como mantenerlo
export const VideoCall: React.FC = () => {

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const localStream = useRef<MediaStream | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

    let [isOfferState] = useState<boolean>(true);
    let [isConnectionStablish] = useState<boolean>(false);

    const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
    const [isMicOn, setIsMicOn] = useState<boolean>(true);

    const user = JSON.parse(localStorage.getItem("user") || '{}')

    const user_id = user.id;

    const { connected, conn } = useVideocallSignalServer();

    let connection: any

    //Cambiar por fetch
    const userMock: IUserData[] = [
        {
            ProfileImage: "",
            username: "Manuel",
            id: "19a6819f-d3fa-45cd-823c-ff2938ae6900"
        },
        {
            ProfileImage: "",
            username: "Lenny",
            id: "8c96b919-5494-4b1d-8d7f-78880e30fc0a"
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
    const isAnsweredByUser = useSelector((state: RootState) => state.videocall.isVideocallAnswered)
    let offerCandidate: RTCIceCandidateInit | null = null;
    let AnswerCandidate: RTCIceCandidateInit | null = null;
    //Busca guardar el answer de la conexion para usarlo cuando sea necesario
    //Este dato busca guardar los datos del offer del dispositivo 1 para ser usado en el dispositivo 2, viene de HandleCall
;

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

            connection.on('offervideonotification', async (sender_id: string, receiver_id: string) => {
                console.log("lo mando");
                setTimeout(() => {
                    VideocallServerServices.SendConnectedVideoNotification(sender_id, receiver_id);
                }, 5000);
            });

            connection.on('connectedvideonotification', (sender_id: string, receiver_id: string) => {
                console.log("llegue aqui despues de mandar");
                if (user_id === receiver_id) {
                    console.log("yo conteste ");
                    setTimeout(() => {
                        handleAnswer(sender_id, receiver_id);
                    }, 1000);
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

            // Cleanup function to remove event listeners
            return () => {
                connection.off('offer');
                connection.off('offervideonotification');
                connection.off('connectedvideonotification');
                connection.off('offericecandidate');
                connection.off('answericecandidate');
            };
        }
    }, [connected, connection]);

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
        console.log(user)
        console.log(user_id)
        console.log("connection ", connection.connectionId)
        setIsVideoOn(() => !isVideoOn);
    };

    const handleMicState = () => {
        console.log(user_id)
        setIsMicOn(() => !isMicOn);
    };


    const handleCall = async (sender_id: string, receiver_id: string) => {
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
                        VideocallServerServices.SendOfferIceCandidate(sender_id, receiver_id, JSON.stringify(event.candidate));
                    }
                };

                //se invoca el offer con los datos de la oferta, esta busca enviarle la offerta al segundo dispositivo
                await VideocallServerServices.SendOffer(sender_id, receiver_id, JSON.stringify(offer));

                //Este se mantiene escuchando hasta que handleAnswer envie la respuesta de la conexion
                const offerAnswer:string = await new Promise((resolve) => {
                    connection?.on('answer', (sdp: string) => {
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

    const handleAnswer = async (sender_id: string, receiver_id: string) => {
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
                        VideocallServerServices.SendAnswerIceCandidate(sender_id, receiver_id, JSON.stringify(event.candidate));
                    }
                };

                //Se envia la respuesta creada a create answer
                await VideocallServerServices.SendAnswer(sender_id, receiver_id, JSON.stringify(answerAnswer));

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
            <Box sx={{ margin: 0, padding:0, height: "auto", width: "100vw", backgroundColor: "#555",  }}>
                <Box sx={{
                    height: "80vh",
                    position:"relative",
                    width: "80vw",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "1rem",
                    margin: "3rem 5rem 0.5rem 5rem",


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
                <VideoCallButton onClick={() => handleCall("8c96b919-5494-4b1d-8d7f-78880e30fc0a", "19a6819f-d3fa-45cd-823c-ff2938ae6900")}><SendIcon></SendIcon></VideoCallButton>
                <VideoCallButton onClick={() => handleAnswer("8c96b919-5494-4b1d-8d7f-78880e30fc0a", "19a6819f-d3fa-45cd-823c-ff2938ae6900")}>recibir</VideoCallButton>
                    <VideoCallButton onClick={handleMicState}>{isMicOn ? < MicIcon /> : <MicOffIcon />}</VideoCallButton>
                    <VideoCallButton onClick={handleVideoState}>{isVideoOn ? < VideocamIcon /> : <VideocamOffIcon />}</VideoCallButton>
                    <VideoCallButton>salir</VideoCallButton>
                </Box>

                <Box sx={{
                    height: "15rem",
                    width: "15rem",
                    position:"absolute",
                    top: "5vh",
                    left: "75vw",
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