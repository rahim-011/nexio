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
import Image from "next/image";

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
            <div className={`group relative flex w-fit max-w-[98%] items-end gap-2 sm:max-w-[90%] lg:max-w-[85%] ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                <div
                    className={`relative min-w-[120px] max-w-full rounded-[20px] px-3 py-2.5 sm:min-w-[170px] sm:px-6 sm:py-4  ${
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
                                <Image
                                    key={index}
                                    src={item.url}
                                    alt="Message attachment"
                                    width={400}
                                    height={400}
                                    className="max-h-80 w-full rounded-lg object-cover"
                                    unoptimized
                                />
                            ))}
                        </div>
                    )}

                    <div className="mt-2 flex items-center justify-end gap-1">
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