import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { useSocket } from "../../../context/SocketProvider";
import { peerConnection } from "../../../Common/PeerConnection";
import './Call.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faMicrophoneSlash, faPhoneSlash, faVideo, faVideoSlash } from "@fortawesome/free-solid-svg-icons";
import InformDialog from "../../../Components/InformDialog/InformDialog";

const Call = () => {
    const { to } = useParams();
    const [searchParams] = useSearchParams();
    const isAnswer = searchParams.get('answer');
    console.log(isAnswer);
    const socket = useSocket();
    const from = JSON.parse(localStorage.getItem('user'))._id;
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [showCallEnded, setShowCallEnded] = useState(false);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                setLocalStream(stream);
                stream.getTracks().forEach(track => {
                    peerConnection.addTrack(track, stream);
                });
            });

        peerConnection.addEventListener('track', (event) => {
            console.log(event.streams[0]);
            setRemoteStream(event.streams[0]);
        });

        peerConnection.onnegotiationneeded = async () => {
            console.log('Negotiation needed');
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(new RTCSessionDescription(offer));
            socket.emit('nego-needed', { to, from, offer });
        }

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                console.log('Sending ice candidate');
                socket.emit('ice-candidate', { candidate: event.candidate, to });
            }
        };

        if (!isAnswer) {
            peerConnection.createOffer().then((offer) => {
                return peerConnection.setLocalDescription(new RTCSessionDescription(offer));
            }).then(() => {
                socket.emit('call', { to, from, offer: peerConnection.localDescription });
            });
        }

        socket.on('ice-candidate', (data) => {
            peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
        });

        socket.on('answer', (data) => {
            console.log(data.answer);
            peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
        });

        socket.on('nego-needed', async (data) => {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
            socket.emit('nego-answer', { to: data.from, answer });
            console.log(peerConnection.localDescription);
            console.log(peerConnection.remoteDescription);
        });

        socket.on('nego-answer', async (data) => {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
            console.log(peerConnection.localDescription);
            console.log(peerConnection.remoteDescription);
        });

        socket.on('end-call', () => {
            peerConnection.close();
            setShowCallEnded(true);
        });

        window.onbeforeunload = handleEndCall;


        return () => {
            peerConnection.close();
            socket.off('answer');
            socket.off('ice-candidate');
            socket.off('nego-needed');
            socket.off('nego-answer');
            socket.off('ice-candidate');
        }
    }, [from, to, socket, isAnswer]);

    const handleToggleMic = () => {
        localStream.getAudioTracks().forEach(track => {
            track.enabled = !track.enabled;
            setIsMicOn(track.enabled);
        });
    }

    const handleToggleCam = () => {
        localStream.getVideoTracks().forEach(track => {
            track.enabled = !track.enabled;
            setIsCameraOn(track.enabled);
        });
    }

    const handleEndCall = () => {
        socket.emit('end-call', { from,to });
        setShowCallEnded(true);
    }

    return (
        <div className="call-container">
            <InformDialog 
                title="Cuộc gọi đã kết thúc" 
                message="Cuộc gọi đã kết thúc, cửa sổ này sẽ đóng." 
                isOpen={showCallEnded}
                okText="Đóng"
                onOk={() => window.close()}
            />
            {localStream && <ReactPlayer className="local-stream" url={localStream} playing muted />}
            {<ReactPlayer className="remote-stream" url={remoteStream} playing />}
            <div className="controls">
                <button onClick={handleToggleMic}>
                    {isMicOn ? <FontAwesomeIcon icon={faMicrophone} /> : <FontAwesomeIcon icon={faMicrophoneSlash} />}
                </button>
                <button onClick={handleToggleCam}>
                    {isCameraOn ? <FontAwesomeIcon icon={faVideo} /> : <FontAwesomeIcon icon={faVideoSlash} />}
                </button>
                <button onClick={handleEndCall} className="end-call">
                <   FontAwesomeIcon icon={faPhoneSlash} />
                </button>
            </div>
        </div>
    );
};

export default Call;
