import './DefaultLayout.css';
import Header from '../Header/Header';
import { useSocket } from '../../context/SocketProvider';
import { useEffect } from 'react';
const DefaultLayout = ({ children }) => {
    // listen socket event
    const socket = useSocket();
    useEffect(() => {
        if (!socket) return;

        socket.on('receive-message', (message) => {
            
        });

        return (() => {
            socket.off('receive-message');
        });
    }, [socket]);
    return (
        <div className="default-layout">
            <Header />
            <div className="content">
                {children}
            </div>
        </div>
    )
}

export default DefaultLayout;