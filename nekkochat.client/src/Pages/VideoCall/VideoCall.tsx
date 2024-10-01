import { useRef, useEffect } from 'react';

export const VideoCall: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const localStream = useRef<MediaStream | null>(null);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(stream => {
            localStream.current = stream;
            const video = videoRef.current;
            if (video) {
                video.srcObject = stream;
                video.play();
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
    }, []);

    const handleCall = async () => {
        //oferta para establecer la conexion
        //como zoom cuando pides que te acepten
        const offer = await peerConnection.current?.createOffer();
        await peerConnection.current?.setLocalDescription({ type: 'offer', sdp: offer?.sdp });
        console.log('Enviando offer:', offer);
    };

    return (
        <div>
            <video autoPlay ref={videoRef} />
            <button onClick={handleCall}>Llamar</button>
        </div>
    );
}