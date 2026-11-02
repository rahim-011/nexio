"use client";

import React, { useEffect, useState, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { socket } from "@/lib/socket";
import { getPostedTime } from "@/lib/utils";
import { getPreviousMessages, newMessageValue } from "@/lib/services/message";
import { DisplayMessage } from "./MessageSub";
import { Chat, User } from "@prisma/client";
import LoadingSpinner from "../LoadingSpinner";
import { ArrowDown } from "lucide-react";
import MessageSkeleton from "../EmptyCallbacks/MessageSkiliton";

interface MessageSubMainProps {
    messages: DisplayMessage[];
    setMessages: React.Dispatch<React.SetStateAction<DisplayMessage[]>>;
    chatId: Chat["id"];
    currentUserId: User['id'];
    containerRef: React.RefObject<HTMLDivElement | null>;
    scrollToButtom: () => void;
    isMessagesLoaded: boolean;
}

export default function MessageSubMain({
    messages,
    setMessages,
    chatId,
    currentUserId,
    containerRef,
    scrollToButtom,
    isMessagesLoaded
}: MessageSubMainProps) {
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [showScrollArrow, setShowScrollArrow] = useState<boolean>(false);
    const [newMessageReceived,setNewMessageReceived] = useState<boolean>(false);
    useEffect(() => {
        const handleNewMessages = (newMessage: newMessageValue) => {
            setMessages(prev =>
                prev.some(message => message.id === newMessage.id)
                    ? prev
                    : [...prev, {
                        ...newMessage,
                        status: "sent",
                        isMine: newMessage.senderId === currentUserId
                    }]
            );
            if (newMessage.senderId !== currentUserId){
                setNewMessageReceived(true);
            }
        };
        socket.on("message:new", handleNewMessages);

        return () => {
            socket.off("message:new", handleNewMessages);
        };
    }, [setMessages,currentUserId]);


    //this is used to indicate that if user received a message and his reading the previous one he got notifated by an under arrow!
    useEffect(() => {
        if (newMessageReceived) {
            setShowScrollArrow(true);
            setNewMessageReceived(false);
        }
    }, [newMessageReceived]);
    useEffect(() => {
        if (isMessagesLoaded) {
            scrollToButtom();
        }
    }, [isMessagesLoaded]);

    const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop } = e.currentTarget;

        if (scrollTop === 0 && !isLoadingMore && messages.length > 0 && hasMore) {
            setIsLoadingMore(true);
            const currentCursor = messages[0].createdAt;

            try {
                const result = await getPreviousMessages(chatId, currentCursor);

                if (!result.success || !result.loadedMessages) {
                    console.log("Failed to load previous messages!");
                    return;
                }

                if (result.loadedMessages.length === 0) {
                    setHasMore(false);
                }

                setMessages(prev => [...result.loadedMessages, ...prev]);
            } catch (error) {
                console.log("Something went wrong, please try again.");
            } finally {
                setIsLoadingMore(false);
            }
        }
    };

    const handleScrollToBottom = () => {
        scrollToButtom();
        setShowScrollArrow(false);
    };

    return (
        <div className="relative min-h-0 h-full w-full">
            <div
                className="flex min-h-0 h-full flex-col gap-2 overflow-y-auto px-2 py-3 sm:gap-3 sm:p-4"
                onScroll={handleScroll}
                ref={containerRef}
            >
                {isLoadingMore && (
                    <div className="flex w-full justify-center py-2">
                        <LoadingSpinner />
                    </div>
                )}
                {!isMessagesLoaded ? <MessageSkeleton/> : messages.map(message => {
                    if (!message) return null;

                    return (
                        <MessageBubble
                            key={message.id}
                            readAt={message.readAt}
                            messageId={message.id}
                            onDelete={() =>
                                setMessages(prev =>
                                    prev.filter(prevMessage => prevMessage.id !== message.id)
                                )
                            }
                            isMine={currentUserId === message.senderId}
                            createdTime={message.createdAt ? getPostedTime(message.createdAt) : ""}
                            media={message.images}
                            content={message.content}
                        />
                    );
                })}
            </div>

            {showScrollArrow && (
                <button
                    type="button"
                    onClick={handleScrollToBottom}
                    aria-label="Scroll to bottom"
                    className="absolute bottom-5 right-5 z-10 flex size-11 items-center justify-center rounded-full border border-primary5/40 bg-primary5 text-grey1 shadow-xl transition-all duration-200 hover:scale-110 hover:brightness-110 active:scale-95"
                >
                    <ArrowDown size={21} strokeWidth={2.5} />
                </button>
            )}
        </div>
    );
}