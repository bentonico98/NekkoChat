import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useRef, useEffect, useState } from 'react';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';

export const VideoCall: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const localStream = useRef<MediaStream | null>(null);

    const [isVideoOn, setIsVideoOn] = useState<boolean>(false)
    const [isMicOn, setIsMicOn] = useState<boolean>(false)

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: isMicOn
        }).then(stream => {
            localStream.current = stream;
            const video = videoRef.current;
            if (video && isVideoOn) {
                video.srcObject = stream;
                video.play();
            }
            if (video && !isVideoOn) {
                video.srcObject = stream;
                video.pause();
            }
        }).catch(error => console.error('Error obteniendo los datos del video:', error));

        peerConnection.current = new RTCPeerConnection();
        //Interactive Connectivity Establishment (ICE)
        //se enfoca en la establecimiento de la conexion de red
        peerConnection.current.onicecandidate = event => {
            if (event.candidate) {
                console.log('Enviando ice candidate:', event.candidate);
            }
        };
        //se dispara cuando se agrega un nuevo flujo
        //se enfoca en la transmision de los flujos de video y audio
        peerConnection.current.ontrack = event => {
            const video = videoRef.current;
            if (video) {
                //flujo de video que ve cada usuario, el primer usuario es flujo 0, el segundo 1 y asi
                video.srcObject = event.streams[0];
                video.play();
            }
        };
    }, [isVideoOn, isMicOn]);

    

    const handleVideoState = () => {
        setIsVideoOn(() => !isVideoOn)
    }

    const handleMicState = () => {
        setIsMicOn(() => !isMicOn)
    }

    const handleCall = async () => {
        //oferta para establecer la conexion
        //como zoom cuando pides que te acepten
        const offer = await peerConnection.current?.createOffer();
        await peerConnection.current?.setLocalDescription({ type: 'offer', sdp: offer?.sdp });
        console.log('Enviando offer:', offer);
    };

    return (
        <>
            <Box sx={{ backgroundColor: "#555", padding: "0.5rem", width: "100vw", height: "100vh", overflowX: "hidden" }}>
                <Box sx={{
                    height: "45vh",
                    width: "45vw",
                    display: "block",
                    backgroundColor:"white",
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
                        <Button variant="contained" onClick={handleMicState}>{isMicOn ? < MicIcon /> : <MicOffIcon />}</Button>
                        <Button variant="contained" onClick={handleVideoState}>{isVideoOn ? < VideocamIcon /> : <VideocamOffIcon />}</Button>
                        <Button variant="contained">salir</Button>
                    </Box>
                </Box>
            </Box>
        </>
    );
}