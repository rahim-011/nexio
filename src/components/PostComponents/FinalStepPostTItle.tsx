"use client";

import { ArrowLeft } from "lucide-react";
import { usePostStore } from "@/lib/store/postStore";

export default function FinalStepPostTitle() {
    const { updateCurrentStep } = usePostStore();

    return (
        <div className="flex h-14 w-full shrink-0 items-center justify-between border-b border-white/10 px-2 sm:h-16 sm:px-5">
            <button
                type="button"
                aria-label="Go back"
                onClick={() => updateCurrentStep("backward")}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-grey1 transition-colors hover:bg-white/10 hover:text-white active:scale-95"
            >
                <ArrowLeft size={20} className="sm:h-[22px] sm:w-[22px]" />
            </button>

            <h2 className="text-sm font-semibold text-white sm:text-base">
                Create new post
            </h2>

            <button
                type="submit"
                form="post-form"
                className="rounded-lg px-3 py-2 text-xs font-semibold text-blue-400 transition-colors hover:bg-blue-400/10 hover:text-blue-300 active:scale-95 sm:px-4 sm:text-sm"
            >
                Share
            </button>
        </div>
    );
}