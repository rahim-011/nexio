"use client";

import { useEffect, useState,useRef } from "react";
import MessageSubMain from "./MessageSubMain";
import MessageSubFooter from "./MessageSubFooter";
import {  getLatestMessages, newMessageValue } from "@/lib/services/message";
import { User } from "@prisma/client";
import { toast } from "sonner";
import { socket, verifyConnection } from "@/lib/socket";


export type DisplayMessage = newMessageValue & {
    status: "sending" | "sent";
};

export default function MessageSub({ chatId,currentUserId }: { chatId: string,currentUserId:User['id'] }) {
    const [messages, setMessages] = useState<DisplayMessage[]>([]);
    const containerRef = useRef<HTMLDivElement | null>(null);   
    
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
    return (
        <>
            <div className="min-h-0 flex-1">
                <MessageSubMain
                    containerRef={containerRef}
                    messages={messages}
                    setMessages={setMessages}
                    chatId={chatId}
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