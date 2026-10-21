'use client'



import { usePostStore } from "@/lib/store/postStore";
import { ArrowLeft } from "lucide-react";

export default function FirstStepPostTitle() {
    const {updateCurrentStep} = usePostStore();
    return (
        <div className="flex h-16 w-full items-center justify-between border-b border-white/10 px-5">
            <button
                type="button"
                aria-label="Previous step"
                className="flex h-9 w-9 items-center justify-center rounded-full text-grey1 transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-95"
                onClick={()=>updateCurrentStep('backward')}
            >
                <ArrowLeft size={22} />
            </button>

            <h2 className="text-base font-semibold tracking-wide text-white">
                Create post
            </h2>

            <button
                type="button"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-blue-400 transition-all duration-200 hover:bg-blue-400/10 hover:text-blue-300 active:scale-95"
                onClick={()=>updateCurrentStep('forward')}
            >
                Next
            </button>
        </div>
    );
}
