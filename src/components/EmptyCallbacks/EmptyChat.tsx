'use client'

import { Send } from "lucide-react";
import { useState } from "react";
import Overlay from "../Overlay";
import NewMessageModel from "../ChatComponents/NewMessageModel";
import { FilteredFriendsValues } from "@/lib/services/friend";

export default function EmptyChat({filtredFriends}:{filtredFriends:FilteredFriendsValues[]}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex w-full flex-col items-center justify-center gap-3 p-3 sm:gap-4 sm:p-4">
            <div className="mb-1 flex items-center justify-center rounded-full border border-grey1 p-5 text-grey1 sm:mb-2 sm:p-8">
                <Send size={42} strokeWidth={1} className="sm:h-[60px] sm:w-[60px] lg:h-[75px] lg:w-[75px]" />
            </div>

            <div className="flex flex-col gap-1 text-center">
                <h1 className="text-2xl text-grey1 sm:text-3xl">
                    Your Messages
                </h1>

                <p className="text-sm text-grey4 sm:text-base">
                    Send a message to start a chat
                </p>
            </div>

            <button
                className="mt-1 cursor-pointer rounded-lg bg-grey1 px-6 py-2 text-sm text-grey7 transition-all hover:brightness-95 sm:mt-2 sm:px-7 sm:text-base"
                onClick={() => setIsOpen(true)}
            >
                Send Message
            </button>

            {isOpen && (
                <div>
                    <Overlay closeModel={() => setIsOpen(false)} />
                    <NewMessageModel closeModel={() => setIsOpen(false)} filtredFriends={filtredFriends}/>
                </div>
            )}
        </div>
    );
}