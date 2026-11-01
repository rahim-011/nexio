
'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";
import DeleteModel from "../DeleteModel";
import { messageInboxesValue, removeMessageInbox, updateChatInbox } from "@/lib/services/message";
import { getPostedTime } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";
import { Chat } from "@prisma/client";

interface MessageBoxProps {
    inboxInfos: messageInboxesValue
    onDelete: (targetId: Chat['id']) => void,
    onUpdate: (targetId: Chat['id']) => void,
}

export default function MessageBox({ inboxInfos, onDelete,onUpdate }: MessageBoxProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [UnreadStatus, setUnreadStatus] = useState<boolean>(inboxInfos.isUnread);
    const router = useRouter();

    const handleDeleteMessageBox = async () => {
        try {
            setLoading(true);
            const result = await removeMessageInbox(inboxInfos.id);

            if (!result.success) {
                toast.error("Failed to delete conversation. Please try again");
                return;
            }

            onDelete(inboxInfos.id);
            toast.success("Conversation deleted successfully");
        } catch {
            toast.error("Something went wrong, please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatingInboxStatus = async () => {
        if (!UnreadStatus) return;

        setUnreadStatus(false);

        try {
            const result = await updateChatInbox(inboxInfos.id);

            if (!result.success) {
                setUnreadStatus(true);
                toast.error("Failed to update chat inbox status");
            }
            onUpdate(inboxInfos.id);
            
        } catch {
            setUnreadStatus(true);
            toast.error("Something went wrong, please try again.");
        }
    };

    return (
        <div
            className={`group relative flex w-full min-w-0 cursor-pointer items-center gap-2 rounded-xl px-2 py-3 transition-colors duration-200 hover:bg-primary6 sm:gap-3 sm:px-3 ${
                UnreadStatus ? "bg-primary5/30" : ""
            }`}
            onClick={() => {
                handleUpdatingInboxStatus();
                router.push(`/messages/${inboxInfos.id}`);
            }}
        >
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-1 ring-primary5/50 sm:h-12 sm:w-12">
                <Image
                    alt={`${inboxInfos.receiver?.username} avatar`}
                    src={inboxInfos.receiver?.image || "/callbackAvatar.webp"}
                    loading="eager"
                    fill
                    sizes="(max-width: 640px) 44px, 48px"
                    className="object-cover"
                />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span
                    className={`truncate text-sm ${
                        UnreadStatus ? "font-semibold text-grey1" : "font-medium text-grey1"
                    }`}
                >
                    {inboxInfos.receiver?.username}
                </span>

                <div className="flex min-w-0 items-center gap-1 sm:gap-2">
                    <span
                        className={`min-w-0 flex-1 truncate text-xs sm:text-[13px] ${
                            UnreadStatus ? "font-medium text-grey1" : "text-grey3"
                        }`}
                    >
                        {inboxInfos.messages[0]?.sender.username !== inboxInfos.receiver?.username ? "You: " : ""}
                        {inboxInfos.messages[0]?.content}
                    </span>

                    <span className="shrink-0 whitespace-nowrap text-[10px] text-grey3 sm:text-[11px]">
                        {inboxInfos.messages[0] ? getPostedTime(inboxInfos.messages[0].createdAt) : ""}
                    </span>
                </div>
            </div>

            <div className="flex w-7 shrink-0 flex-col items-center self-stretch sm:w-8">
                <div className="flex h-4 w-full items-start justify-end pr-1">
                    {UnreadStatus && (
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                    )}
                </div>

                <div
                    className="flex flex-1 items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <DeleteModel
                        loading={loading}
                        ariaLabel="message inbox options"
                        onConfirm={handleDeleteMessageBox}
                    />
                </div>
            </div>
        </div>
    );
}
