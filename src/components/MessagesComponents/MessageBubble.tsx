"use client";

import {
    Check,
    CheckCheck,
    Clock,
    AlertCircle
} from "lucide-react";
import { MessageFormValue } from "./MessageSubFooter";
import DeleteModel from "../DeleteModel";
import { toast } from "sonner";
import { Message } from "@prisma/client";
import { deleteMessage } from "@/lib/services/message";

interface MessageBubbleProps {
    content: MessageFormValue["content"];
    createdTime: string;
    media: MessageFormValue["media"];
    isMine: boolean;
    status?: "sending" | "sent" | "failed";
    readAt: Message["readAt"];
    onDelete: () => void;
    messageId: Message["id"];
}

export default function MessageBubble({
    content,
    createdTime,
    media,
    isMine,
    status = "sent",
    readAt,
    onDelete,
    messageId
}: MessageBubbleProps) {
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

    return (
        <div className={`flex w-full ${isMine ? "justify-end" : "justify-start"}`}>
            <div className={`group relative flex max-w-[85%] items-end gap-2 sm:max-w-[75%] lg:max-w-[65%] ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                <div
                    className={`relative max-w-full rounded-[18px] px-3.5 py-2.5 ${
                        isMine
                            ? "rounded-br-[5px] bg-[#2563eb] text-white"
                            : "rounded-bl-[5px] border border-[#3b4b5e] bg-[#263445] text-[#e2e8f0]"
                    }`}
                >
                    {content && (
                        <p className="whitespace-pre-wrap break-words text-left text-[15px] leading-[1.45] sm:text-base">
                            {content}
                        </p>
                    )}

                    {media?.length > 0 && (
                        <div className={`${content ? "mt-2" : ""} grid grid-cols-2 gap-1.5`}>
                            {media.map((item, index) => (
                                <img
                                    key={index}
                                    src={item.url}
                                    alt="Message attachment"
                                    className="max-h-72 w-full rounded-lg object-cover"
                                />
                            ))}
                        </div>
                    )}

                    <div className="mt-1.5 flex items-center justify-end gap-1">
                        <span className={`text-[10px] ${isMine ? "text-blue-100/80" : "text-slate-400"}`}>
                            {createdTime}
                        </span>

                        {isMine && status === "sending" && (
                            <Clock size={12} className="text-blue-100/80" />
                        )}

                        {isMine && status === "sent" && !readAt && (
                            <Check size={13} strokeWidth={2.5} className="text-blue-100/80" />
                        )}

                        {isMine && status === "sent" && readAt && (
                            <CheckCheck size={14} strokeWidth={2.5} className="text-sky-200" />
                        )}

                        {isMine && status === "failed" && (
                            <AlertCircle size={13} className="text-red-200" />
                        )}
                    </div>
                </div>

                {isMine && (
                    <DeleteModel
                        ariaLabel="message options"
                        onConfirm={handleDeleteMessage}
                    />
                )}
            </div>
        </div>
    );
}