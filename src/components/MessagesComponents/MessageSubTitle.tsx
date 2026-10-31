
"use client";

import { receiverInfosValue } from "@/lib/services/message";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface MessageSubTitleProps {
    receiverInfos: receiverInfosValue;
}

export default function MessageSubTitle({
    receiverInfos,
}: MessageSubTitleProps) {
    const router = useRouter();

    if (!receiverInfos) {
        return null;
    }

    return (
        <div className="h-16 w-full shrink-0 border-b border-primary5/50 bg-primary5 px-2 sm:h-20 sm:px-5">
            <div className="flex h-full items-center gap-2 sm:gap-3">
                <button
                    type="button"
                    onClick={() => router.push("/messages")}
                    aria-label="Back to chats"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-grey1 transition-colors hover:bg-primary6 min-[1281px]:hidden sm:h-10 sm:w-10"
                >
                    <ArrowLeft size={20} className="sm:h-[23px] sm:w-[23px]" />
                </button>

                <div className="relative h-10 w-10 shrink-0 sm:h-12 sm:w-12">
                    <Image
                        src={receiverInfos.image || "/callbackAvatar.webp"}
                        alt={`${receiverInfos.username} avatar`}
                        fill
                        sizes="(max-width: 640px) 40px, 48px"
                        className="rounded-full object-cover"
                    />

                    <div
                        className={`absolute bottom-0 right-0 h-3 w-3 translate-x-0.5 translate-y-0.5 rounded-full border-2 border-primary5 sm:h-3.5 sm:w-3.5 ${
                            receiverInfos.isOnline
                                ? "bg-green-400"
                                : "bg-gray-400"
                        }`}
                    />
                </div>

                <div className="flex min-w-0 flex-col gap-0">
                    <span className="truncate text-xs font-semibold text-grey1 sm:text-sm">
                        {receiverInfos.username}
                    </span>

                    <span
                        className={`text-[10px] font-medium sm:text-xs ${
                            receiverInfos.isOnline
                                ? "text-green-500"
                                : "text-gray-400"
                        }`}
                    >
                        {receiverInfos.isOnline ? "Online" : "Offline"}
                    </span>
                </div>
            </div>
        </div>
    );
}
