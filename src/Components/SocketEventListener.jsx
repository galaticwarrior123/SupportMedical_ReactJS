
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useSocket } from '../context/SocketProvider';
import YesNoDialog from './YesNoDialog/YesNoDialog';
import { UserAPI } from '../API/UserAPI';
import { MessageType } from '../API/ChatAPI';
import { peerConnection } from '../Common/PeerConnection';
import { useDispatch } from 'react-redux';
import { fetchNotifications } from '../redux/slices/notificationSlice';
import { getUnreadCount } from '../redux/slices/chatSlice';
import { useNavigate } from 'react-router-dom';

const SocketEventListener = () => {
    const dispatch = useDispatch();
    // listen socket event
    const socket = useSocket();
    const [showCallModal, setShowCallModal] = useState(false);
    const [caller, setCaller] = useState(null);
    const [offer, setOffer] = useState(null);
    const navigate = useNavigate();

    const handleReceiveMessage = (message) => {
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
            autoClose: 5000,
        });

        if (Notification.permission === 'granted') {
            const noti = new Notification(title, options);
            noti.onclick = () => {
                if (document.visibilityState === 'hidden') {
                    window.focus();
                }
                navigate(`/chat/${message.chat}`);
            }
        }

        dispatch(getUnreadCount());
    }

    const handleReceiveCall = async (data) => {
        const { from } = data;
        const callUser = (await UserAPI.getUserById(from)).data;
        if (Notification.permission === 'granted') {
            const noti = new Notification(`Cuộc gọi đến từ ${callUser.lastName}`, {
                body: 'Nhấn để xem',
                vibrate: [200, 100, 200],
            });

            noti.onclick = () => {
                if (document.visibilityState === 'hidden') {
                    window.focus();
                }
            }
        }
        setCaller(callUser);
        setOffer(data.offer);
        setShowCallModal(true);
    }



    useEffect(() => {
        const handleNewNotification = (notification) => {
            const title = 'Thông báo mới';
            const body = notification.content;
            const options = {
                body: body,
                vibrate: [200, 100, 200],
            };

            toast.info(body, {
                autoClose: 5000,
            });

            if (Notification.permission === 'granted') {
                const noti = new Notification(title, options);
                noti.onclick = () => {
                    if (document.visibilityState === 'hidden') {
                        window.focus();
                    }
                }
            }

            // fetch notification again on new notification
            dispatch(fetchNotifications());
        }

        if (!socket) return;

        socket.on('receive-message', (message) => handleReceiveMessage(message));
        socket.on('new-notification', (notification) => handleNewNotification(notification));
        socket.on('call', (data) => handleReceiveCall(data));
        socket.on('end-call', (data) => {
            setShowCallModal(false);
        });


        return (() => {
            socket.off('receive-message');
            socket.off('call');
            socket.off('end-call');
            socket.off('new-notification');
        });
    }, [socket]);

    return (
        <YesNoDialog
            isOpen={showCallModal}
            onCancel={() => {
                setShowCallModal(false);
                socket.emit('end-call', { to: caller._id });
            }}
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