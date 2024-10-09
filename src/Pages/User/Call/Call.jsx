import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { useSocket } from "../../../context/SocketProvider";
import { peerConnection } from "../../../Common/PeerConnection";

const Call = () => {
    const { to } = useParams();
    const [searchParams] = useSearchParams();
    const isAnswer = searchParams.get('answer');
    console.log(isAnswer);
    const socket = useSocket();
    const from = JSON.parse(localStorage.getItem('user'))._id;
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                setLocalStream(stream);
                // localVideoRef.current.srcObject = stream;
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

        // socket.on('call', async (data) => {
        //     await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
        //     const answer = await peerConnection.createAnswer();
        //     await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
        //     socket.emit('answer', { to: data.from, answer: peerConnection.localDescription });
        // });

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

        return () => {
            peerConnection.close();
            socket.off('call');
            socket.off('answer');
            socket.off('ice-candidate');
            socket.off('nego-needed');
            socket.off('nego-answer');
        }
    }, [from, to, socket, isAnswer]);

    return (
        <div>
            <h1>Call</h1>
            {/* <video ref={localVideoRef} autoPlay muted></video> */}
            <ReactPlayer url={localStream} playing muted />
            {/* <video ref={remoteVideoRef} autoPlay></video> */}
            {remoteStream && <ReactPlayer url={remoteStream} playing />}
        </div>
    );
};

export default Call;
