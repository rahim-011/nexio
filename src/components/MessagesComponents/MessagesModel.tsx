
'use client'

import { useUserStore } from "@/lib/store/userStore";
import Link from "next/link";
import MessageBox from "./MessageBox";
import { messageInboxesValue } from "@/lib/services/message";
import EmptyChatInboxes from "../EmptyCallbacks/EmptyChatInboxes";
import { Chat } from "@prisma/client";
import LoadingSpinner from "../LoadingSpinner";
import MessageInboxSkeleton from "../EmptyCallbacks/MessageInboxSkiliton";

interface MessageModelProps {
    onClose: () => void,
    inboxes: messageInboxesValue[],
    onDelete: (targetId: Chat['id']) => void,
    onUpdate: (targetId: Chat['id']) => void,
    isInboxesLoading: boolean
}

export default function MessagesModel({ onClose, inboxes, onDelete ,onUpdate,isInboxesLoading}: MessageModelProps) {
    const { cachedUserInfos } = useUserStore();
    const { username } = cachedUserInfos;
    return (
        <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden bg-primary7">
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-primary5/40 px-4 py-4 sm:px-5 md:py-5">
                <h2 className="min-w-0 truncate text-lg font-bold tracking-tight text-grey1 sm:text-xl md:text-2xl">
                    {username}
                </h2>

                <Link
                    href="/requests"
                    onClick={onClose}
                    className="shrink-0 rounded-lg px-2 py-1 text-sm font-medium text-grey3 underline underline-offset-4 transition-colors hover:text-grey1"
                >
                    Requests
                </Link>
            </div>

            <div className="flex min-h-0 flex-1 flex-col">
                <div className="flex shrink-0 items-center justify-between px-4 pb-3 pt-4 sm:px-5 md:pb-4">
                    <h3 className="text-lg font-semibold text-grey1 sm:text-xl">
                        Messages
                    </h3>
                </div>

                <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-2 pb-4 sm:px-3">
                    <div className="flex min-w-0 flex-col items-stretch gap-1">
                        {isInboxesLoading ? (
                            <MessageInboxSkeleton />
                        ) : inboxes.length === 0 ? (
                            <EmptyChatInboxes />
                        ) : (
                            inboxes.map(inbox => (
                                <MessageBox
                                    key={inbox.id}
                                    inboxInfos={inbox}
                                    onDelete={onDelete}
                                    onUpdate={onUpdate}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
