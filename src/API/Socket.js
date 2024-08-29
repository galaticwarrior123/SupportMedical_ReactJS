import { io } from "socket.io-client";

const initSocket = () => {
    return io('http://localhost:4000', {
        extraHeaders: {
            token: `${localStorage.getItem('token')}`
        }
    });
}

export const socket = initSocket();