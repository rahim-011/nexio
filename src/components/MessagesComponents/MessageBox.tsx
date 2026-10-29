'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";
import DeleteModel from "../DeleteModel";
import { messageInboxesValue, removeMessageInbox } from "@/lib/services/message";
import { getPostedTime } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";
import { Chat } from "@prisma/client";


interface MessageBoxProps{
    inboxInfos: messageInboxesValue
    onDelete: (targetId:Chat['id']) => void,
}

export default function MessageBox({inboxInfos,onDelete}:MessageBoxProps) {
    const [loading,setLoading] = useState<boolean>(false);
    const isUnread = inboxInfos.messages[0]?.readAt === null;
    const router = useRouter();
    const handleDeleteMessageBox = async () =>{
        try{
            setLoading(true);
            const result = await removeMessageInbox(inboxInfos.id);
            if (!result.success){
                toast.error("Failed to delete conversation. Please try again");
                return;
            }
            onDelete(inboxInfos.id);
            toast.success("Conversation deleted successfully");
        }
        catch(error){
            toast.error('Somthing went wrong, please try again.')
        }
        finally{
            setLoading(false);
        }
    }
    return (
        <div
            className={`cursor-pointer group relative flex w-full min-w-0 items-center gap-3 rounded-xl px-3 py-3 transition-colors duration-200 hover:bg-primary6 ${
                isUnread ? "bg-primary5/30" : ""
            }`}
            onClick={() => router.push(`/messages/${inboxInfos.id}`)}
        >
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-1 ring-primary5/50">
                <Image
                    alt={`${inboxInfos.receiver?.username} avatar`}
                    src={inboxInfos.receiver?.image || '/callbackAvatar.webp'}
                    loading="eager"
                    fill
                    sizes="48px"
                    className="object-cover"
                />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span
                    className={`truncate text-sm ${
                        isUnread
                            ? "font-semibold text-grey1"
                            : "font-medium text-grey1"
                    }`}
                >
                    {inboxInfos.receiver?.username}
                </span>

                <div className="flex min-w-0 items-center gap-2">
                    <span
                        className={`min-w-0 flex-1 truncate text-[13px] ${
                            isUnread
                                ? "font-medium text-grey1"
                                : "text-grey3"
                        }`}
                    >
                        {inboxInfos.messages[0]?.sender.username !== inboxInfos.receiver?.username ? 'You' : ''}: {inboxInfos.messages[0]?.content}
                    </span>

                    <span className="shrink-0 text-[11px] text-grey3">
                        {inboxInfos.messages[0] ? getPostedTime(inboxInfos.messages[0]?.createdAt) : '' }
                    </span>
                </div>
            </div>

            <div className="flex w-8 shrink-0 flex-col items-center self-stretch">
                <div className="flex h-4 w-full items-start justify-end pr-1">
                    {isUnread && (
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
                        onConfirm={() => handleDeleteMessageBox()}
                    />
                </div>
            </div>
        </div>
    );
}