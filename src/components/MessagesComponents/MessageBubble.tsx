"use client";

import {
    Check,
    CheckCheck,
    Clock,
    AlertCircle,
    Smile
} from "lucide-react";
import { MessageFormValue } from "./MessageSubFooter";
import DeleteModel from "../DeleteModel";
import { toast } from "sonner";
import { Message, User } from "@prisma/client";
import { createReaction, deleteMessage, deleteReaction } from "@/lib/services/message";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import InspectChatMedia from "./InspectChatMedia";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { DisplayMessage } from "./MessageSub";
import { socket, verifyConnection } from "@/lib/socket";

interface MessageBubbleProps {
    content: MessageFormValue["content"];
    createdTime: string;
    media: MessageFormValue["media"];
    isMine: boolean;
    status?: "sending" | "sent" | "failed";
    readAt: Message["readAt"];
    onDelete: () => void;
    messageId: Message["id"];
    username: string;
    userImage: string | null;
    currentUserId: User['id'];
    updateMessages: Dispatch<SetStateAction<DisplayMessage[]>>;
    reactions: DisplayMessage["reactions"];
}

export default function MessageBubble({
    content,
    createdTime,
    media,
    isMine,
    status = "sent",
    readAt,
    onDelete,
    messageId,
    username,
    userImage,
    updateMessages,
    currentUserId,
    reactions
}: MessageBubbleProps) {
    const router = useRouter();

    const [inspectedMedia, setInspectedMedia] = useState<{
        resourceType: typeof media[number]["resourceType"];
        url: string;
    } | null>(null);

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    const groupedReactions = reactions.reduce((groups, reaction) => {
        const existing = groups.find(item => item.emogie === reaction.emogie);

        if (existing) {
            existing.count++;
        } else {
            groups.push({
                emogie: reaction.emogie,
                count: 1
            });
        }

        return groups;
    }, [] as { emogie: string; count: number }[]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                emojiPickerRef.current &&
                !emojiPickerRef.current.contains(event.target as Node)
            ) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleDeleteMessage = async () => {
        try {
            onDelete();

            const result = await deleteMessage(messageId);

            if (!result.success) {
                toast.error("Failed to delete message");
                return;
            }
        } catch {
            toast.error("Something went wrong, please try again.");
        }
    };

    const handleReaction = async (reactionData: EmojiClickData) => {
        setShowEmojiPicker(false);
        const existingReaction = reactions.find(reaction => reaction.emogie === reactionData.emoji && reaction.userId === currentUserId);
        if (existingReaction){
            const prevReactions = reactions;
            try{
                updateMessages(prev => prev.map(message => message.id === messageId ? {
                    ...message,
                    reactions: message.reactions.some(reaction => reaction.userId === currentUserId) ? message.reactions.filter(reaction => !(reaction.userId === currentUserId && reaction.emogie === reactionData.emoji)) : reactions
                } : message))
                const result = await deleteReaction(messageId,existingReaction.id);
                console.log(result);
                if (!result.success){
                    updateMessages(prev => prev.map(message => message.id === messageId ? {
                        ...message,
                        reactions: prevReactions
                    } : message));
                    toast.error('Failed to delete reaction!');
                    return;
                }
                return;
            }
            catch(error){
                toast.error('Somthing went wrong, please try again!');
                updateMessages(prev => prev.map(message => message.id === messageId ? {
                        ...message,
                        reactions: prevReactions
                    } : message));
                return;
            }
        }
        try {
            const optimisticReaction = {
                id: crypto.randomUUID(),
                messageId,
                emogie: reactionData.emoji,
                userId: currentUserId
            };

            updateMessages(prev => prev.map(message => message.id === messageId ? {
                ...message,
                reactions: message.reactions.some(reaction => reaction.userId === currentUserId)
                    ? message.reactions.map(reaction => reaction.userId === currentUserId
                        ? { ...reaction, emogie: reactionData.emoji }
                        : reaction
                    )
                    : [...message.reactions, optimisticReaction]
            } : message));

            const result = await createReaction(messageId, reactionData.emoji);

            if (!result.success || !result.retrievedReaction) {
                toast.error('Failed to create reaction for this message!');

                updateMessages(prev => prev.map(message => message.id === messageId ? {
                    ...message,
                    reactions: message.reactions.map(reaction => reaction.userId === currentUserId ? {
                        ...reaction,
                        emogie: ''
                    } : reaction)
                } : message));

                return;
            }

            updateMessages(prev => prev.map(message => message.id === messageId ?
                {
                    ...message,
                    reactions: message.reactions.some(reaction => reaction.userId === currentUserId) ?
                        message.reactions.map(reaction => reaction.userId === currentUserId ? result.retrievedReaction : reaction)
                        : [...message.reactions, result.retrievedReaction]
                }
                : message));

            await verifyConnection();
            socket.emit("message:reaction", result.retrievedReaction);
        } catch (error) {
            toast.error('Somthing went wrong,please try again');

            updateMessages(prev => prev.map(message => message.id === messageId ? {
                ...message,
                reactions: message.reactions.map(reaction => reaction.userId === currentUserId ? {
                    ...reaction,
                    emogie: ''
                } : reaction)
            } : message));
        }
    };

    return (
        <>
            <div className={`flex w-full ${isMine ? "justify-end" : "justify-start"}`}>
                <div className={`group relative flex w-fit max-w-[98%] items-end gap-2 sm:max-w-[90%] lg:max-w-[85%] ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                    {!isMine && (
                        <button
                            type="button"
                            onClick={() => router.push(`/profile/${username}`)}
                            aria-label={`View ${username}'s profile`}
                            className="size-8 shrink-0 cursor-pointer overflow-hidden rounded-full transition hover:scale-105 sm:size-9"
                        >
                            <Image
                                src={userImage || "/callbackAvatar.webp"}
                                alt={`${username}'s avatar`}
                                width={36}
                                height={36}
                                className="size-full object-cover"
                            />
                        </button>
                    )}

                    <div className="flex min-w-0 max-w-full flex-col">
                        <div
                            className={`relative min-w-[120px] max-w-full rounded-[20px] px-3 pb-8 pt-2.5 sm:min-w-[170px] sm:px-6 sm:pb-9 sm:pt-4 ${
                                isMine
                                    ? "rounded-br-[5px] bg-[#2563eb] text-white"
                                    : "rounded-bl-[5px] border border-[#3b4b5e] bg-[#263445] text-[#e2e8f0]"
                            }`}
                        >
                            {content && (
                                <p className="whitespace-pre-wrap break-words text-left text-base leading-relaxed sm:text-lg">
                                    {content}
                                </p>
                            )}

                            {media?.length > 0 && (
                                <div className={`${content ? "mt-3" : ""} flex flex-col gap-2`}>
                                    {media.map((item, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => setInspectedMedia({
                                                resourceType: item.resourceType,
                                                url: item.url
                                            })}
                                            aria-label="Inspect image"
                                            className="block w-full cursor-zoom-in"
                                        >
                                            <Image
                                                src={item.url}
                                                alt="Message attachment"
                                                width={400}
                                                height={400}
                                                className="max-h-80 w-full rounded-lg object-cover"
                                                unoptimized
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="absolute bottom-2 right-3 flex items-center gap-1">
                                <span className={`text-[11px] ${isMine ? "text-blue-100/80" : "text-slate-400"}`}>
                                    {createdTime}
                                </span>

                                {isMine && status === "sending" && (
                                    <Clock size={13} className="text-blue-100/80" />
                                )}

                                {isMine && status === "sent" && !readAt && (
                                    <Check size={14} strokeWidth={2.5} className="text-blue-100/80" />
                                )}

                                {isMine && status === "sent" && readAt && (
                                    <CheckCheck size={15} strokeWidth={2.5} className="text-sky-200" />
                                )}

                                {isMine && status === "failed" && (
                                    <AlertCircle size={14} className="text-red-200" />
                                )}
                            </div>

                            {groupedReactions.length > 0 && (
                                <div className={`absolute -bottom-3 ${isMine ? "right-3" : "left-3"} z-10 flex items-center gap-1`}>
                                    {groupedReactions.map(reaction => (
                                        <div
                                            key={reaction.emogie}
                                            className={`flex h-6 items-center gap-1 rounded-full border px-1.5 shadow-sm ${
                                                isMine
                                                    ? "border-blue-400 bg-[#1d4ed8] text-white"
                                                    : "border-[#526174] bg-[#263445] text-white"
                                            }`}
                                        >
                                            <span className="text-xs">{reaction.emogie}</span>
                                            {reaction.count > 1 && (
                                                <span className="text-[10px] font-medium">
                                                    {reaction.count}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <div ref={emojiPickerRef} className="relative">
                            {showEmojiPicker && (
                                <div className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2">
                                    <EmojiPicker
                                        theme="dark"
                                        width={280}
                                        height={350}
                                        previewConfig={{
                                            showPreview: false
                                        }}
                                        onEmojiClick={handleReaction}
                                    />
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => setShowEmojiPicker(prev => !prev)}
                                aria-label="Add reaction"
                                className="flex size-7 shrink-0 items-center justify-center rounded-full text-grey4 opacity-100 transition hover:bg-primary5 hover:text-grey1 sm:size-8 sm:opacity-0 sm:group-hover:opacity-100"
                            >
                                <Smile size={15} className="sm:size-[18px]" />
                            </button>
                        </div>

                        {isMine && (
                            <DeleteModel
                                ariaLabel="message options"
                                onConfirm={handleDeleteMessage}
                            />
                        )}
                    </div>
                </div>
            </div>

            {inspectedMedia && (
                <InspectChatMedia
                    resourceType={inspectedMedia.resourceType}
                    url={inspectedMedia.url}
                    onClose={() => setInspectedMedia(null)}
                />
            )}
        </>
    );
}