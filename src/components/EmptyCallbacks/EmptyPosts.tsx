'use client'

import { Camera } from "lucide-react";
import { useState } from "react";
import PostModel from "../PostComponents/PostModel";

export default function EmptyPosts() {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <>
            <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 px-3 text-center animate-in fade-in duration-500 sm:min-h-[400px] sm:gap-5 sm:px-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-grey3 bg-primary5/30 shadow-sm sm:h-24 sm:w-24 lg:h-28 lg:w-28">
                    <Camera
                        size={34}
                        strokeWidth={1.5}
                        className="text-grey3 sm:h-10 sm:w-10"
                    />
                </div>

                <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                    <h3 className="text-xl font-bold tracking-tight text-grey1 sm:text-2xl">
                        Share Posts
                    </h3>

                    <p className="max-w-md text-sm leading-relaxed text-grey3 sm:text-base">
                        When you share posts, they will appear on your profile.
                    </p>
                </div>

                <button
                    className="cursor-pointer rounded-xl bg-primary8 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:brightness-110 hover:shadow-lg active:scale-95 sm:px-6 sm:py-3 sm:text-base"
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