'use client'

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { usePostStore } from "@/lib/store/postStore";
import FirstStepPostTitle from "./PostComponents/FirstStepPostTitle";
import DefaultStepTitle from "./PostComponents/DefaultStepTitle";
import FinalStepPostTitle from "./PostComponents/FinalStepPostTItle";
import PostForm from "./PostComponents/PostForm";

export default function PostModel({ closeModel }: { closeModel: () => void }) {
    const { currentStep } = usePostStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeModel();
        };
        window.addEventListener("keydown", onKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [closeModel]);

    if (!mounted) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-primary7/60 backdrop-blur-sm"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) closeModel();
            }}
        >
            <button
                type="button"
                onClick={closeModel}
                aria-label="Close"
                className="absolute right-3 top-8 -translate-y-1/2 cursor-pointer rounded-full p-1.5 text-gray-400 transition-all hover:bg-white/10 hover:text-white"
            >
                <X size={25} />
            </button>
            <div
                role="dialog"
                aria-modal="true"
                className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/10 bg-primary9 text-white shadow-2xl"
            >
                <div className="relative flex items-center justify-center border-b border-white/10">
                    {currentStep === 0 ? (
                        <DefaultStepTitle />
                    ) : currentStep === 1 ? (
                        <FirstStepPostTitle />
                    ) : currentStep === 2 ? (
                        <FinalStepPostTitle />
                    ) : null}
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <PostForm />
                </div>
            </div>
        </div>,
        document.body
    );
}