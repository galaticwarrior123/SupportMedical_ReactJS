import React, { createContext, useMemo, useContext } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthProvider";

const SocketContext = createContext();

export const useSocket = () => {
    const socket = useContext(SocketContext);
    console.log('SocketProvider', socket);
    if (!socket) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return socket;
};

export const SocketProvider = (props) => {
    const { token } = useAuth();
    const socket = useMemo(() => io(process.env.REACT_APP_API_URL, {
        extraHeaders: {
            token: token
        }
    }), [token]);
    console.log('token', token);

    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    );
};