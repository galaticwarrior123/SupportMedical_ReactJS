
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useSocket } from '../context/SocketProvider';
import YesNoDialog from './YesNoDialog/YesNoDialog';
import { UserAPI } from '../API/UserAPI';
import { MessageType } from '../API/ChatAPI';
import { peerConnection } from '../Common/PeerConnection';

const SocketEventListener = () => {
    // listen socket event
    const socket = useSocket();
    const [showCallModal, setShowCallModal] = useState(false);
    const [caller, setCaller] = useState(null);
    const [offer, setOffer] = useState(null);

    const handleReceiveMessage = (message) => {
        console.log('receive-message default layout');

        // send notification
        const title = `Bạn có tin nhắn mới từ ${message.sender.lastName}`;
        let body;
        if (message.type === MessageType.TEXT) {
            body = message.content;
        } else if (message.type === MessageType.IMAGE) {
            body = 'Gửi ảnh';
        } else if (message.type === MessageType.APPOINTMENT) {
            body = 'Gửi lịch hẹn';
        }
        const options = {
            body: body,
            // icon: message.sender.avatar,
            vibrate: [200, 100, 200],
        };

        toast.info(title, {
            body: body,
            autoClose: 5000,
        });

        if (Notification.permission === 'granted') {
            new Notification(title, options);
        }
    }

    const handleReceiveCall = async (data) => {
        const { from } = data;
        const callUser = (await UserAPI.findUserById(from)).data;
        setCaller(callUser);
        setOffer(data.offer);
        setShowCallModal(true);
    }

    useEffect(() => {
        if (!socket) return;

        socket.on('receive-message', (message) => handleReceiveMessage(message));
        socket.on('call', (data) => handleReceiveCall(data));


        return (() => {
            socket.off('receive-message');
            socket.off('call');
        });
    }, [socket]);

    return (
        <YesNoDialog
            isOpen={showCallModal}
            onCancel={() => setShowCallModal(false)}
            onConfirm={async () => {
                setShowCallModal(false);
                await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
                console.log(peerConnection.localDescription);
                socket.emit('answer', { to: caller._id, answer: peerConnection.localDescription });
                window.open(`/call/${caller._id}?answer=true`, 'VideoCallWindow', 'width=800,height=600');
            }}
            yesText='Bắt máy'
            noText='Từ chối'
            title={`Cuộc gọi đến từ ${caller?.lastName}`}
            message='Bạn có muốn trả lời cuộc gọi này không?'
        />
    )
}

export default SocketEventListener;