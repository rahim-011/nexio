
"use client";

import { ArrowLeft } from "lucide-react";
import { usePostStore } from "@/lib/store/postStore";

export default function FirstStepPostTitle() {
    const { updateCurrentStep } = usePostStore();

    return (
        <div className="flex h-16 w-full shrink-0 items-center justify-between border-b border-white/10 px-4 sm:px-5">
            <button
                type="button"
                aria-label="Go back"
                onClick={() => updateCurrentStep("backward")}
                className="flex h-9 w-9 items-center justify-center rounded-full text-grey1 transition-colors hover:bg-white/10 hover:text-white active:scale-95"
            >
                <ArrowLeft size={22} />
            </button>

            <h2 className="text-base font-semibold text-white">
                Create new post
            </h2>

            <button
                type="submit"
                form="post-form"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-blue-400 transition-colors hover:bg-blue-400/10 hover:text-blue-300 active:scale-95"
            >
                Share
            </button>
        </div>
    );
}
