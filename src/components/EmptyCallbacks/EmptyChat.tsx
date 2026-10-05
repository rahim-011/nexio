'use client'


import { Send } from "lucide-react";
import { useState } from "react";
import Overlay from "../Overlay";
import AddNewMessage from "../ChatComponents/AddNewMessage";
import NewMessageModel from "../ChatComponents/NewMessageModel";

export default function EmptyChat() {
    const [isOpen,setIsOpen] = useState<Boolean>(false);

    return (
        <div className="flex flex-col items-center justify-center p-4 gap-4 w-full">
            <div className="flex items-center justify-center text-grey1 border border-grey1 p-8 rounded-full mb-2">
                <Send size={75} strokeWidth={1} />
            </div>
            <div className="flex flex-col gap-1 text-center">
                <h1 className="text-3xl text-grey1">Your Messages</h1>
                <p className="text-grey4 text-[1rem]">Send a message to start a chat</p>
            </div>
            <button className="text-grey7 rounded-lg py-2 px-7 hover:brightness-95 transition-all bg-grey1 mt-2 cursor-pointer" onClick={()=>setIsOpen(true)}>
                Send Message
            </button>
            {isOpen && <div>
                <Overlay closeModel={() =>setIsOpen(false)}/>
                <NewMessageModel closeModel={()=>setIsOpen(false)}/>B
            </div>}
        </div>
    );
}