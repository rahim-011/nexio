import {io} from 'socket.io-client'




export const socket = io("http://localhost:3001", {
    autoConnect: false,
    withCredentials: true,
});




export function verifyConnection(): Promise<void> {// checking if connected
    return new Promise((resolve, reject) => {
        if (socket.connected) {
            resolve();
            return;
        }

        socket.connect();

        socket.once("connect", () => resolve());

        socket.once("connect_error", (error) => {
            reject(error);
        });
    });
}

