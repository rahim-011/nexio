'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";
import DeleteModel from "../DeleteModel";

export default function MessageBox() {
    const isUnread = true;
    const router = useRouter();

    return (
        <div
            className={`cursor-pointer group relative flex w-full min-w-0 items-center gap-3 rounded-xl px-3 py-3 transition-colors duration-200 hover:bg-primary6 ${
                isUnread ? "bg-primary5/30" : ""
            }`}
            onClick={() => router.push('/messages/1')}
        >
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-1 ring-primary5/50">
                <Image
                    alt="John Colaf's avatar"
                    src="/callbackAvatar.webp"
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
                    John Colaf
                </span>

                <div className="flex min-w-0 items-center gap-2">
                    <span
                        className={`min-w-0 flex-1 truncate text-[13px] ${
                            isUnread
                                ? "font-medium text-grey1"
                                : "text-grey3"
                        }`}
                    >
                        You: Hello
                    </span>

                    <span className="shrink-0 text-[11px] text-grey3">
                        2d
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
                        loading={false}
                        ariaLabel="message inbox options"
                        onConfirm={() => undefined}
                    />
                </div>
            </div>
        </div>
    );
}