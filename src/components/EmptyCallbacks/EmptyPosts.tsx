
'use client'

import { Camera } from "lucide-react";
import { useState } from "react";
import PostModel from "../PostComponents/PostModel";

export default function EmptyPosts() {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <>
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-5 px-6 text-center animate-in fade-in duration-500">
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-grey3 bg-primary5/30 shadow-sm">
                    <Camera size={42} strokeWidth={1.5} className="text-grey3" />
                </div>

                <div className="flex flex-col items-center gap-2">
                    <h3 className="text-2xl font-bold tracking-tight text-grey1">
                        Share Posts
                    </h3>
                    <p className="max-w-md text-base leading-relaxed text-grey3">
                        When you share posts, they will appear on your profile.
                    </p>
                </div>

                <button
                    className="rounded-xl bg-primary8 px-6 py-3 text-base font-semibold text-white shadow-md transition-all duration-300 hover:brightness-110 hover:shadow-lg active:scale-95 cursor-pointer"
                    onClick={() => setIsOpen(true)}
                >
                    Share a post
                </button>
            </div>

            {isOpen && (
                <PostModel closeModel={() => setIsOpen(false)} />
            )}
        </>
    );
}
