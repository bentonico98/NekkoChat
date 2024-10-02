import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useRef, useEffect, useState } from 'react';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import { useParams } from 'react-router-dom';
import { HubConnectionBuilder } from '@microsoft/signalr';


export const VideoCall: React.FC = () => {

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const localStream = useRef<MediaStream | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteStream = useRef<MediaStream | null>(null);

    const [isVideoOn, setIsVideoOn] = useState<boolean>(false);
    const [isMicOn, setIsMicOn] = useState<boolean>(false);
    const [offer2, setIsOffer2] = useState<RTCSessionDescriptionInit | undefined>(undefined);

    const { id } = useParams();
    const [isOffer, setIsOffer] = useState(false); 

    const connection =  new HubConnectionBuilder()
        .withUrl("https://localhost:7198/privatechathub", { withCredentials: false })
        .withAutomaticReconnect()
        .build();

    connection.start().catch((err) => console.error(err));

    connection.on('offer', (sdp) => {
        try {
            setIsOffer2(() => ({ type: 'offer', sdp }));
            if (peerConnection.current) {
                peerConnection.current.setRemoteDescription({ type: 'offer', sdp });
                peerConnection.current.createAnswer((answer: RTCSessionDescriptionInit) => {
                    if (answer && answer.sdp) {
                        peerConnection.current?.setLocalDescription({ type: 'answer', sdp: answer.sdp });
                        console.log('Enviando answer:', answer);
                    } else {
                        console.error('La descripción de sesión SDP no es válida');
                    }
                });
            }
        } catch (error) {
            console.error('Error al actualizar la descripción de sesión SDP:', error);
        }
    });

    connection.on('answer', (sdp) => {
        try {
            setIsOffer2(() => ({ type: 'answer', sdp }));
            if (peerConnection.current) {
                peerConnection.current.setRemoteDescription({ type: 'answer', sdp });
            }
        } catch (error) {
            console.error('Error al actualizar la descripción de sesión SDP:', error);
        }
    });



    useEffect(() => {
        if (id === '2') {
            setIsOffer(false);
        } else {
            setIsOffer(true);
        }
    }, [id]);

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

        peerConnection.current.onicecandidate = event => {
            if (event.candidate) {
                console.log('Enviando ice candidate:', event.candidate);
            }
        };

        peerConnection.current.ontrack = event => {
            if (event.streams.length > 0) {
                const stream = event.streams[0];
                const remoteVideo = remoteVideoRef.current;
                if (remoteVideo) {
                    remoteStream.current = stream;
                    remoteVideo.srcObject = remoteStream.current;
                    remoteVideo.play();
                }
            }
        };
    }, [isVideoOn, isMicOn, isOffer]);

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
                    console.error('La conexión ya tiene una descripción de sesión SDP remota establecida');
                    return;
                }
                const offer = await peerConnection.current.createOffer();
                setIsOffer2(() => offer);
                await peerConnection.current.setLocalDescription({ type: 'offer', sdp: offer.sdp });
                console.log('Enviando offer:', offer);
                connection.invoke('Offer', offer.sdp).catch((err) => console.error(err));
            } catch (error) {
                console.error('Error creando la oferta:', error);
            }
        }
    };

    const handleAnswer = async () => {
        if (peerConnection.current) {
            try {
                const offerSdp = offer2?.sdp;
                if (offerSdp && typeof offerSdp === 'string' && offerSdp.startsWith('v=')) {
                    await peerConnection.current.setRemoteDescription({ type: 'offer', sdp: offerSdp });
                    const answer = await peerConnection.current.createAnswer();
                    await peerConnection.current.setLocalDescription({ type: 'answer', sdp: answer.sdp });
                    console.log('Enviando answer:', answer);
                } else {
                    console.error('La descripción de sesión SDP no es válida', offerSdp);
                }
            } catch (error) {
                console.error('Error creando la respuesta:', error);
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
                        < video style={{ borderRadius: "1rem" }} autoPlay ref={videoRef} />
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
                        <Button variant="contained" onClick={handleCall}>invitar</Button>
                        <Button variant="contained" onClick={handleAnswer}>invitar</Button>
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
                        < video style={{ borderRadius: "1rem" }} autoPlay ref={remoteVideoRef} />
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
                        <Button variant="contained" onClick={handleCall}>invitar</Button>
                        <Button variant="contained" onClick={handleAnswer}>invitar</Button>
                        <Button variant="contained" onClick={handleMicState}>{isMicOn ? < MicIcon /> : <MicOffIcon />}</Button>
                        <Button variant="contained" onClick={handleVideoState}>{isVideoOn ? < VideocamIcon /> : <VideocamOffIcon />}</Button>
                        <Button variant="contained">salir</Button>
                    </Box>
                </Box>
            </Box>
        </>
    );
}