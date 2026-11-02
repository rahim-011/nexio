"use client";

import { useEffect, useState, useRef } from "react";
import MessageSubMain from "./MessageSubMain";
import MessageSubFooter from "./MessageSubFooter";
import { getLatestMessages, newMessageValue } from "@/lib/services/message";
import { User } from "@prisma/client";
import { toast } from "sonner";
import { useSocket } from "@/hooks/useSocket";
import { socket } from "@/lib/socket";
import { JoinChatResponse } from "../../../socket-server";

export type DisplayMessage = newMessageValue & {
    sender: {
        username: string;
    };
    status: "sending" | "sent";
};

export default function MessageSub({ chatId, currentUserId }: { chatId: string, currentUserId: User["id"] }) {
    const [messages, setMessages] = useState<DisplayMessage[]>([]);
    const [isMessagesLoaded, setIsMessagesLoaded] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useSocket();

    useEffect(() => {
        let isMounted = true;

        async function fetchMessages() {
            setIsMessagesLoaded(false);
            setMessages([]);

            try {
                const result = await getLatestMessages(chatId);

                if (!isMounted) return;

                if (!result.success || !result.latestMessages) {
                    toast.error("Failed to fetch messages!");
                    return;
                }

                setMessages(result.latestMessages);
                setIsMessagesLoaded(true);
            } catch (error) {
                if (isMounted) {
                    toast.error("Somthing went wrong, please try again.");
                }
            }
        }

        fetchMessages();

        return () => {
            isMounted = false;
        };
    }, [chatId]);

    const scrollToBottom = () => {
        const container = containerRef.current;

        if (container) {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: "instant"
            });
        }
    };

    //*here we are joining the chat socket directly when connecting*
    useEffect(() => {
        const joinChat = () => {
            socket.emit("chat:join", chatId, (response: JoinChatResponse) => {
                if (!response.success) {
                    console.log(response.error);
                    return;
                }
                setMessages(prev => prev.map(message => message.readAt === null ? {...message,readAt: new Date()} : message));
                console.log("Successfully joined chat:", chatId);
            });
        };

        socket.on("connect", joinChat);

        if (socket.connected) {
            joinChat();
        }

        return () => {
            socket.off("connect", joinChat);

            if (socket.connected) {
                socket.emit("chat:leave", chatId);
            }
        };
    }, [chatId]);

    return (
        <>
            <div className="min-h-0 flex-1">
                <MessageSubMain
                    containerRef={containerRef}
                    messages={messages}
                    setMessages={setMessages}
                    chatId={chatId}
                    currentUserId={currentUserId}
                    isMessagesLoaded={isMessagesLoaded}
                    scrollToButtom={scrollToBottom}
                />
            </div>

            <MessageSubFooter
                chatId={chatId}
                setMessages={setMessages}
                currentUserId={currentUserId}
                scrollToBottom={scrollToBottom}
            />
        </>
    );
}