"use client";

import { useEffect, useState,useRef } from "react";
import MessageSubMain from "./MessageSubMain";
import MessageSubFooter from "./MessageSubFooter";
import {  getLatestMessages, newMessageValue } from "@/lib/services/message";
import { Chat, User } from "@prisma/client";
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

export default function MessageSub({ chatId,currentUserId }: { chatId: string,currentUserId:User['id'] }) {
    const [messages, setMessages] = useState<DisplayMessage[]>([]);
    const containerRef = useRef<HTMLDivElement | null>(null);
    useSocket();   
    
    useEffect(()=>{
        async function fetchMessages(){
            try{
                const result = await getLatestMessages(chatId);
                if (!result.success || !result.latestMessages){
                    toast.error('Failed to fetch messages!');
                    return;
                }
                setMessages(result.latestMessages)
            }
            catch(error){
                toast.error('Somthing went wrong, please try again.')
            }
        }
        fetchMessages();
    },[chatId])
    const scrollToBottom = () => {
        const container = containerRef.current;

        if (container) {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: "smooth"
            });
        }
    };
    useEffect(() => {
        if (messages.length > 0) {
            requestAnimationFrame(() => {
                scrollToBottom();
            });
        }
    }, [messages.length]);

    //here we are joining the chat socket directly when connecting
    useEffect(()=>{
        const joinChat = () =>{
            socket.emit("chat:join",chatId,(response:JoinChatResponse)=>{
                if (!response.success){
                    console.log(response.error);
                    return;
                }
                console.log("Successfully joined chat:", chatId);
            })
        }
        socket.on("connect",joinChat);
        if (socket.connected){
            joinChat();
        }
        return () =>{
            socket.off("connect",joinChat);
            if (socket.connected){
                socket.emit("chat:leave",chatId)
            }
        }
    },[chatId])
    return (
        <>
            <div className="min-h-0 flex-1">
                <MessageSubMain
                    containerRef={containerRef}
                    messages={messages}
                    setMessages={setMessages}
                    chatId={chatId}
                    currentUserId={currentUserId}
                />
            </div>

            <MessageSubFooter
                chatId={chatId}
                setMessages={setMessages}
                currentUserId={currentUserId}
                scrollToBottom={()=>scrollToBottom()}
            />
        </>
    );
}