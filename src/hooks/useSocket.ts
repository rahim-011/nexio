'use client'

import { socket } from "@/lib/socket"
import { useEffect } from "react"

export function useSocket() {
    useEffect(() => {
        const handleConnect = () => {
            console.log("Socket connected:", socket.id);
        };

        const handleConnectError = (error: Error) => {
            console.error("Socket connection error:", error.message);
        };

        const handleDisconnect = (reason: string) => {
            console.log("Socket disconnected:", reason);
        };

        socket.on("connect", handleConnect);
        socket.on("connect_error", handleConnectError);
        socket.on("disconnect", handleDisconnect);

        if (!socket.connected) {
            socket.connect();
        }

        return () => {
            socket.off("connect", handleConnect);
            socket.off("connect_error", handleConnectError);
            socket.off("disconnect", handleDisconnect);
        };
    }, []);
}