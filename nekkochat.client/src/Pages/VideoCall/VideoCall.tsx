import Box from '@mui/material/Box';
import React, { useRef, useEffect, useState } from 'react';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import SendIcon from '@mui/icons-material/Send';
//import { useParams } from 'react-router-dom';
import VideocallServerServices from '../../Utils/VideoCallService'
import { VideoCallButton } from './Components/VideoCallButtom';
import { IUserData, SendModal } from './Components/SendModal';
import useVideocallSignalServer from '../../Hooks/useVideocallSignalR';
import ServerLinks from '../../Constants/ServerLinks';
import axios from 'axios';
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
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [data, setData] = useState<IUserData[]>([{ id: "", profilePhotoUrl: null, userName: "" }]);
    const [videoTrackState, setVideoTrackState] = useState<MediaStreamTrack | undefined>(undefined);
    const [audioTrackState, setAudioTrackState] = useState<MediaStreamTrack | undefined>(undefined);
    //const [isRemoteVideoSender, setIsRemoteVideoSender] = useState<boolean>(false);
    

    const user = JSON.parse(localStorage.getItem("user") || '{}')

    const user_id = user.id;

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

            connection.on('offervideonotification', async (sender_id: string, receiver_id: string) => {
                console.log("lo mando, MANDO EL CONNECT NOTIFICATION");
                setTimeout(() => {
                    VideocallServerServices.SendConnectedVideoNotification(sender_id, receiver_id);
                }, 5000);
            });

            connection.on('connectedvideonotification', (sender_id: string, receiver_id: string) => {
                console.log("llegue aqui despues de mandar AQUI EL CONNECTED");
                console.log(receiver_id + " " + sender_id)
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

    const handleMicState = () => {
        if (localStream.current) {
            const audioTrack = localStream.current.getAudioTracks()[0];
            setAudioTrackState(audioTrack);
            if (audioTrack && isMicOn == true) {
                localStream.current.removeTrack(audioTrack)
                setIsMicOn(!isMicOn);
                audioTrack.stop();
                return
            }
            setIsMicOn(!isMicOn);
            if (audioTrackState != undefined) {
                localStream.current.addTrack(audioTrackState);
            }


        }
    };

    const handleVideoState = async () => {
        
        if (localStream.current) {
            const videoTrack = localStream.current.getVideoTracks()[0];
            setVideoTrackState(videoTrack);
            if (videoTrack && isVideoOn == true) {
                localStream.current.removeTrack(videoTrack)
                setIsVideoOn(!isVideoOn);
                videoTrack.stop();
                return
            }
            setIsVideoOn(!isVideoOn);
            if (videoTrackState != undefined) {
                localStream.current.addTrack(videoTrackState);
            }
            
           
        }
    };

    const handleCall = async (sender_id: string, receiver_id: string) => {
        console.log("HANDLE CALLLLLLLL INICIAL")
        if (peerConnection.current) {
            try {
                
                console.log("HANDLE CALLLLLLLL")
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
        console.log("HANDLE ANSWER INICIAL")
        if (peerConnection.current && answer) {
            try {
                console.log("HANDLE ANSWER")
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
                    < video id="local" style={{ borderRadius: "1rem", height: "90vh", }} autoPlay ref={videoRef}/>
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
                <SendModal Users={data} loading={loading} error={error} />
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