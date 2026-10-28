'use client'

import { useUserStore } from "@/lib/store/userStore";
import Link from "next/link";
import MessageBox from "./MessageBox";


interface MessageModelProps{
    onClose: () => void,
}

export default function MessagesModel({onClose}:MessageModelProps) {
    const { cachedUserInfos } = useUserStore();
    const { username } = cachedUserInfos;

    return (
        <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-primary7">
            <div className="hidden shrink-0 border-b border-primary5/40 px-5 py-5 md:block">
                <h2 className="truncate text-2xl font-bold tracking-tight text-grey1">
                    {username}
                </h2>
            </div>

            <div className="flex min-h-0 flex-1 flex-col">
                <div className="hidden shrink-0 items-center justify-between px-5 pb-4 pt-5 md:flex">
                    <h3 className="text-xl font-semibold text-grey1">
                        Messages
                    </h3>

                    <Link
                        href="/requests"
                        className="rounded-lg px-2 py-1 text-sm font-medium text-grey3 transition-colors hover:text-grey1 underline-offset-1 underline"
                        onClick={onClose}
                    >
                        Requests
                    </Link>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-4 pt-4 md:px-3 md:pt-0">
                    <div className="flex flex-col items-center gap-1 md:items-stretch">
                        <MessageBox />
                    </div>
                </div>
            </div>
        </div>
    );
}