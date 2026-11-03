
import { io } from "socket.io-client";

export const socket = io("https://nexio-socket.onrender.com", {
    autoConnect: false,
    withCredentials: false,
    transports: ["websocket", "polling"],
    auth: (callback) => {
        fetch("/api/socket-token", {
            method: "POST",
            credentials: "same-origin",
            cache: "no-store",
        })
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error("Failed to get socket token");
                }

                return response.json();
            })
            .then(({ token }) => {
                callback({ token });
            })
            .catch((error) => {
                console.error("Socket authentication error:", error);
                callback({});
            });
    },
});

export function verifyConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (socket.connected) {
            resolve();
            return;
        }

        const handleConnect = () => {
            cleanup();
            resolve();
        };

        const handleError = (error: Error) => {
            cleanup();
            reject(error);
        };

        const cleanup = () => {
            socket.off("connect", handleConnect);
            socket.off("connect_error", handleError);
        };

        socket.once("connect", handleConnect);
        socket.once("connect_error", handleError);

        socket.connect();
    });
}
