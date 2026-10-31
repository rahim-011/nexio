"use client";

import { usePostStore } from "@/lib/store/postStore";
import { ArrowLeft } from "lucide-react";

export default function FirstStepPostTitle() {
    const { updateCurrentStep } = usePostStore();

    return (
        <div className="flex h-14 w-full items-center justify-between border-b border-white/10 px-2 sm:h-16 sm:px-5">
            <button
                type="button"
                aria-label="Previous step"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-grey1 transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-95"
                onClick={() => updateCurrentStep("backward")}
            >
                <ArrowLeft size={20} className="sm:h-[22px] sm:w-[22px]" />
            </button>

            <h2 className="text-sm font-semibold tracking-wide text-white sm:text-base">
                Create post
            </h2>

            <button
                type="button"
                className="rounded-lg px-3 py-2 text-xs font-semibold text-blue-400 transition-all duration-200 hover:bg-blue-400/10 hover:text-blue-300 active:scale-95 sm:px-4 sm:text-sm"
                onClick={() => updateCurrentStep("forward")}
            >
                Next
            </button>
        </div>
    );
}