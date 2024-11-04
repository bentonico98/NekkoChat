
import Swal from 'sweetalert2';
import VideocallServerServices from '../../../../Utils/VideoCallService';
import { MutableRefObject } from 'react';

const user = JSON.parse(localStorage.getItem("user") || '{}');
const user_id = user.id;

export type VideoCallHandlerCallbacksType = {
    onOfferStateChange: (isOffer: boolean) => void;
    onConnectionEstablished: (isEstablished: boolean) => void;
    onRenegotiated: (isRenegotiated: boolean) => void;
    connection: any;
    peerConnection: RTCPeerConnection;
}

export class VideoCallComnicationHandler {
    public static instance: VideoCallComnicationHandler | null = null;
    private peerConnection: RTCPeerConnection | null = null;
    private isOfferState: boolean = false;
    private isConnectionEstablished: boolean = false;
    private localStream: MediaStream | null = null;
    private callbacks: VideoCallHandlerCallbacksType;
    private connection: any;
    private AnswerCandidate: RTCIceCandidateInit | null = null;
    private offerCandidate: RTCIceCandidateInit | null = null;
    private answer: RTCSessionDescriptionInit | null = null;
    private receiverId: string = "";

    constructor(callbacks: VideoCallHandlerCallbacksType) {

        this.callbacks = callbacks;
        this.peerConnection = 
        this.connection = callbacks.connection;
        this.peerConnection = callbacks.peerConnection;
        this.setupListeners();
    }

    public static getInstance(callbacks: VideoCallHandlerCallbacksType): VideoCallComnicationHandler {
        if (!VideoCallComnicationHandler.instance) {
            VideoCallComnicationHandler.instance = new VideoCallComnicationHandler(callbacks);
        }
        return VideoCallComnicationHandler.instance;
    }

    private setupListeners() {

      this.connection.on('answericecandidate',async (candidate: string) => {
          console.log("pase por aqui");
         this.AnswerCandidate = JSON.parse(candidate);
         console.log("answer ice candidate", this.AnswerCandidate)
         await this.handleStablishIce();
      });
        

    this.connection.on('offericecandidate', async (candidate: string) => {
        this.offerCandidate = JSON.parse(candidate);
        await this.handleStablishIce();
    });

        
        this.connection.on('offer', async (sdp: string) => {
            try {
                if (this.peerConnection) {
                    this.answer = JSON.parse(sdp);
                }
            } catch (error) {
                console.error('Error al actualizar la descripción de sesión SDP:', error);
            }
        });
    }

    public async handleCall(sender_id: string, receiver_id: string) {
        if (this.peerConnection) {
            try {
                if (this.peerConnection.signalingState === 'have-remote-offer') {
                    console.error('La conexion ya tiene una descripcion de sesión SDP remota establecida');
                    return;
                }
                this.receiverId = receiver_id;
                this.isOfferState = true;
                this.callbacks.onOfferStateChange(this.isOfferState);

                const offer: RTCLocalSessionDescriptionInit = await this.peerConnection.createOffer();
                await this.peerConnection.setLocalDescription({ type: 'offer', sdp: offer.sdp });

                this.peerConnection.onicecandidate = async (event) => {
                    if (event.candidate) {
                         await VideocallServerServices.SendOfferIceCandidate(sender_id, receiver_id, JSON.stringify(event.candidate));
                    }
                };
                await VideocallServerServices.SendOffer(sender_id, receiver_id, JSON.stringify(offer));

                const offerAnswer: string = await new Promise((resolve) => {
                    this.connection.on('answer', (sdp: string) => {
                        resolve(sdp);
                    });
                });

                const answerDescription = JSON.parse(offerAnswer);
                await this.peerConnection.setRemoteDescription(answerDescription);

                this.isConnectionEstablished = true;
                this.callbacks.onConnectionEstablished(this.isConnectionEstablished); 
                return
            } catch (error) {
                console.error('Error creando la oferta:', error);
            }
        }
    }

    public async handleAnswer(sender_id: string, receiver_id: string, sdp?: string ) {
        if (this.peerConnection) {
            try {
                if (!sdp) {
                    this.isOfferState = false;
                    this.receiverId = receiver_id;
                    this.callbacks.onOfferStateChange(this.isOfferState); 

                    await this.peerConnection.setRemoteDescription(this.answer!);
                    const answerAnswer: RTCLocalSessionDescriptionInit = await this.peerConnection.createAnswer();
                    await this.peerConnection.setLocalDescription(answerAnswer);

                    this.peerConnection.onicecandidate = async (event) => {
                        console.log(event.candidate)
                        if (event.candidate) {
                            await VideocallServerServices.SendAnswerIceCandidate(sender_id, receiver_id, JSON.stringify(event.candidate));
                        }
                    };

                    await VideocallServerServices.SendAnswer(sender_id, receiver_id, JSON.stringify(answerAnswer));

                    this.isConnectionEstablished = true;
                    this.callbacks.onConnectionEstablished(this.isConnectionEstablished); 
                    return

                } else if (sdp){
                    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(JSON.parse(sdp)));
                    const answerAnswer: RTCLocalSessionDescriptionInit = await this.peerConnection.createAnswer();
                    await this.peerConnection.setLocalDescription(answerAnswer);

                    this.peerConnection.onicecandidate = async event => {
                        if (event.candidate) {
                            await VideocallServerServices.SendAnswerIceCandidate(sender_id, receiver_id, JSON.stringify(event.candidate));
                        }
                    };

                    await VideocallServerServices.SendAnswer(sender_id, receiver_id, JSON.stringify(answerAnswer));
                    return
                }

            } catch (error) {
                console.error('Error enviando la respuesta:', error);
            }
        }
    }

    public async SendRenegotiatedOffer() {
        try {
            const offerAnswer: string = await new Promise((resolve) => {
                this.connection?.on('answer', (sdp: string) => {
                    resolve(sdp);
                });
            });
            const answerDescription = JSON.parse(offerAnswer);
            await this.peerConnection?.setRemoteDescription(new RTCSessionDescription(answerDescription));
        } catch (error) {
            console.error("Error creando y enviando la oferta:", error);
        }
    };

    public async handleRenegotiation(sender_id: string, receiver_id: string, sdp: string) {
        if (user_id == sender_id) {
            this.callbacks.onRenegotiated(true);
            await this.SendRenegotiatedOffer();
        } else {
            setTimeout(() => {
                this.handleAnswer(sender_id, receiver_id, sdp);
            }, 2000);
        }
    };

    private async handleStablishIce() {
        console.log("HANDLESTABLISHICE", this.isOfferState +" "+ this.AnswerCandidate)
            if (this.isOfferState && this.AnswerCandidate) {
                console.log("ESTE ES EL ANSWER CANDIDATE ",this.AnswerCandidate)
                await this.peerConnection?.addIceCandidate(new RTCIceCandidate(this.AnswerCandidate));
            } else if (!this.isOfferState && this.offerCandidate) {
                console.log("ESTE ES EL OFFER CANDIDATE ", this.offerCandidate)
                await this.peerConnection?.addIceCandidate(new RTCIceCandidate(this.offerCandidate));
            }
    }

    public async handleLeaveCall(videoRef: MutableRefObject<HTMLVideoElement | null>, remoteVideoRef: MutableRefObject<HTMLVideoElement | null>) {
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
            if (this.localStream) {
                this.localStream.getTracks().forEach(track => {
                    track.stop();
                });
            }

            if (this.peerConnection) {
                this.peerConnection.close();
                this.peerConnection = null;
            }

            if (videoRef) {
                videoRef.current!.srcObject = null;
            }
            if (remoteVideoRef) {
                remoteVideoRef.current!.srcObject = null;
            }

            await VideocallServerServices.SendCallExit(user_id, this.receiverId);

            window.location.href = "/";
        }
    }
}