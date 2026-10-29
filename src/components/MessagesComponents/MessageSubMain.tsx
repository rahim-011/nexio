'use client'

import { useEffect, useState } from "react";
import MessageBubble from "./MessageBubble";
import { MessageFormValue, SelectedImage } from "./MessageSubFooter";
import { socket } from "@/lib/socket";
import { getPostedTime } from "@/lib/utils";
import { newMessageValue } from "@/lib/services/message";





export default function MessageSubMain(){
    const [messages,setMessages] = useState<newMessageValue[]>([]);
    useEffect(()=>{
        const handleNewMessages = (newMessage:newMessageValue) =>{
            setMessages(prev => [...prev,newMessage]);
        }
        socket.on("message:new",handleNewMessages);
        return () =>{
            socket.off("message:new",handleNewMessages)
        }
    },[socket])
    return(
        <div className="flex items-center justify-center">
            {messages.map(message => {
                return(
                    <MessageBubble isMine={true} time={message?.createdAt ? getPostedTime(message?.createdAt) : '' } media={message?.images} key={message?.chatId} content={message?.content}/>
                )
            })}
        </div>
        // u have the bubble infos just build the bubble that receive it and show it ??  (the images separatly then content and the isMIne logique !!)
    )
}