import { useEffect } from 'react';

const NotificationRequest = () => {
    useEffect(() => {
        // Yêu cầu quyền hiển thị thông báo
        if (Notification.permission !== 'granted') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('User granted the notification permission');
                } else {
                    console.log('User denied the notification permission');
                }
            });
        }
    }, []);

    return null; // Component này chỉ yêu cầu quyền, không cần render gì
};

export default NotificationRequest;
