import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useRef, useEffect, useState } from 'react';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
//import { useParams } from 'react-router-dom';
import { HubConnectionBuilder } from '@microsoft/signalr';

export const VideoCall: React.FC = () => {

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const localStream = useRef<MediaStream | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

    const [isVideoOn, setIsVideoOn] = useState<boolean>(false);
    const [isMicOn, setIsMicOn] = useState<boolean>(false);
    // [offer2, setIsOffer2] = useState<RTCSessionDescriptionInit | undefined>(undefined);

    //const { id } = useParams();
    //const [isOffer, setIsOffer] = useState(false);

    const connection = new HubConnectionBuilder()
        .withUrl("https://localhost:7198/privatechathub", { withCredentials: false })
        .withAutomaticReconnect()
        .build();

    connection.start().catch((err) => console.error(err));

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

    connection.on('icecandidate', (candidate) => {
        console.log('Recibiendo ice candidate:', candidate);
        if (peerConnection.current) {
            peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
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

    useEffect(() => {
        peerConnection.current = new RTCPeerConnection()
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: isMicOn,
        })
            .then(stream => {
                localStream.current = stream;
                const video = videoRef.current;
                if (video && isVideoOn) {
                    if (video.srcObject) {
                        video.pause();
                        if (video.srcObject instanceof MediaStream) {
                            video.srcObject.getVideoTracks().forEach(track => track.stop());
                            video.srcObject.getAudioTracks().forEach(track => track.stop());
                        }
                    }
                    video.srcObject = stream;
                    setTimeout(() => {
                        video.play();
                    }, 100); // Agregar un retardo de 100ms
                }
                if (!peerConnection.current) {
                    peerConnection.current = new RTCPeerConnection();
                }
                stream.getTracks().forEach(track => {
                    peerConnection.current?.addTrack(track, stream);
                });
            })
            .catch(error => console.error('Error obteniendo los datos del video:', error));

        
        peerConnection.current.onconnectionstatechange = event => {
            if (peerConnection.current?.connectionState === 'failed') {
                console.log('La conexión WebRTC ha fallado', event);
            } else if (peerConnection.current?.connectionState === 'closed') {
                console.log('La conexión WebRTC ha sido cerrada', event);
            }
        };

        peerConnection.current.onicecandidate = event => {
            if (event.candidate) {
                console.log('Enviando ice candidate:', event.candidate);
                connection.invoke('SendIceCandidate', event.candidate.candidate).catch((err) => console.error(err));
            }
        };
      
        peerConnection.current.oniceconnectionstatechange = (event) => {
            console.log('Cambio de estado de la conexión ICE: ' + event, peerConnection.current?.iceConnectionState);
        };

       
        peerConnection.current.onconnectionstatechange = (event) => {
            console.log('Cambio de estado de la conexión: ' + event, peerConnection.current?.connectionState);
        };

        peerConnection.current.ontrack = event => {
            console.log('Se estableció la conexión');
            if (event.streams.length > 0) {
                const stream = event.streams[0];
                console.log('Se recibió el flujo de video remoto');
                const remoteVideo = remoteVideoRef.current;
                if (remoteVideo) {
                    if (remoteVideo.srcObject) {
                        remoteVideo.pause();
                        if (remoteVideo.srcObject instanceof MediaStream) {
                            remoteVideo.srcObject.getVideoTracks().forEach(track => track.stop());
                            remoteVideo.srcObject.getAudioTracks().forEach(track => track.stop());
                        }
                    }
                    remoteVideo.srcObject = stream;
                    setTimeout(() => {
                        remoteVideo.play();
                    }, 100); // Agregar un retardo de 100ms
                    console.log('Se reprodujo el video remoto');
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

    }, [isVideoOn, isMicOn, connection]);

    const handleVideoState = () => {
        setIsVideoOn(() => !isVideoOn);
        console.log('Referencia del video local:', videoRef.current);
        console.log('Referencia del video remoto:', remoteVideoRef.current);
    };

    const handleMicState = () => {
        setIsMicOn(() => !isMicOn);
    };

    const handleCall = async () => {
        if (peerConnection.current) {
            try {
                if (peerConnection.current.signalingState === 'have-remote-offer') {
                    console.error('La conexión ya tiene una descripción de sesión SDP remota establecida');
                    return;
                }
                const offer: RTCLocalSessionDescriptionInit = await peerConnection.current.createOffer();

                await peerConnection.current.setLocalDescription({ type: 'offer', sdp: offer.sdp });
                console.log('Enviando offer:', offer);

                console.log("HANDLE CALL", peerConnection.current.signalingState);
                    
                connection.invoke('Offer', JSON.stringify(offer)).catch((err) => console.error(err));

                const offerAnswer:string = await new Promise((resolve) => {
                    connection.on('answer', (sdp) => {
                        resolve(sdp);
                    });
                });
                console.log("HANDLE CALL 2", peerConnection.current.signalingState);
                // Set the remote description with the answer
                const answerDescription = JSON.parse(offerAnswer);
                await peerConnection.current.setRemoteDescription(answerDescription);
                console.log("HANDLE CALL 3", peerConnection.current.signalingState);
            } catch (error) {
                console.error('Error creando la oferta:', error);
            }
        }
    };

    const handleAnswer = async () => {
        if (peerConnection.current && answer) {
            try {
                console.log("HANDLE ANSWER 1", peerConnection.current.signalingState);
                await peerConnection.current.setRemoteDescription(answer);
                console.log("HANDLE ANSWER 2", peerConnection.current.signalingState);
                const answerAnswer: RTCLocalSessionDescriptionInit = await peerConnection.current.createAnswer()
                console.log("HANDLE ANSWER 3", peerConnection.current.signalingState);
                await peerConnection.current.setLocalDescription(answerAnswer);
                console.log("HANDLE ANSWER 4", peerConnection.current.signalingState);
                
                connection.invoke('Answer', JSON.stringify(answerAnswer)).catch((err) => console.error(err));
            } catch (error) {
                console.error('Error enviando la respuesta:', error);
            }
        }
    };

    
    return (
        <>
            <Box sx={{ height: "100vh", width: "100vw", backgroundColor: "#555" }}>
                <Box sx={{
                    height: "90vh",
                    width: "90vw",
                    display: "block",
                    backgroundColor: "white",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "1rem"

                }}>
                    {isVideoOn ?
                        < video id="local" style={{ borderRadius: "1rem" }} autoPlay ref={videoRef} />
                        :
                        <Box sx={{
                            backgroundColor: "#555",
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
                    <Box sx={{
                        display: "grid",
                        alignItems: "center",
                        justifyContent: "center",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: "0.5rem"
                    }}>
                        <Button variant="contained" onClick={handleCall}>enviar</Button>
                        <Button variant="contained" onClick={handleAnswer}>recibir</Button>
                        <Button variant="contained" onClick={handleMicState}>{isMicOn ? < MicIcon /> : <MicOffIcon />}</Button>
                        <Button variant="contained" onClick={handleVideoState}>{isVideoOn ? < VideocamIcon /> : <VideocamOffIcon />}</Button>
                        <Button variant="contained">salir</Button>
                    </Box>
                </Box>

                <Box sx={{
                    height: "90vh",
                    width: "90vw",
                    display: "block",
                    backgroundColor: "white",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "1rem"

                }}>
                    {isVideoOn ?
                        <video id='remoto' style={{ borderRadius: "1rem", width: "100%", height: "100%", zIndex: "2" }} autoPlay ref={remoteVideoRef} onPlay={() => console.log('Se reprodujo el video remoto')} />
                        :
                        <Box sx={{
                            backgroundColor: "#555",
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
                    <Box sx={{
                        display: "grid",
                        alignItems: "center",
                        justifyContent: "center",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: "0.5rem"
                    }}>
                        <Button variant="contained" onClick={handleCall}>enviar</Button>
                        <Button variant="contained" onClick={handleAnswer}>recibir</Button>
                        <Button variant="contained" onClick={handleMicState}>{isMicOn ? < MicIcon /> : <MicOffIcon />}</Button>
                        <Button variant="contained" onClick={handleVideoState}>{isVideoOn ? < VideocamIcon /> : <VideocamOffIcon />}</Button>
                        <Button variant="contained">salir</Button>
                    </Box>
                </Box>
            </Box>
        </>
    );
}


/*peerConnection.current.onnegotiationneeded = async () => {
           try {
               console.log('Negotiation needed');
               const offer = await peerConnection.current?.createOffer();
               await peerConnection.current?.setLocalDescription(new RTCSessionDescription({ type: 'offer', sdp: offer?.sdp }));
               // Send the offer to the remote peer
               connection.invoke('Offer', offer?.sdp).catch((err) => console.error(err));
           } catch (error) {
               console.error('Error creating offer:', error);
           }
       };*/

/* connection.on('answer', (sdp) => {
       try {
           
           if (peerConnection.current) {
               peerConnection.current.setRemoteDescription({ type: 'answer', sdp });
           }
       } catch (error) {
           console.error('Error al actualizar la descripción de sesión SDP:', error);
       }
   });*/