
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { usePostStore } from "@/lib/store/postStore";
import FirstStepPostTitle from "./FirstStepPostTitle";
import DefaultStepTitle from "./DefaultStepTitle";
import FinalStepPostTitle from "./FinalStepPostTItle";
import PostForm from "./PostForm";

export default function PostModel({
    closeModel,
}: {
    closeModel: () => void;
}) {
    const { currentStep } = usePostStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape"){
                closeModel();
                usePostStore.setState({currentStep:0});
            };
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
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-primary7/60 p-3 backdrop-blur-sm sm:p-6"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) closeModel();
            }}
        >
            <button
                type="button"
                onClick={()=>{closeModel(),usePostStore.setState({currentStep:0})}}
                aria-label="Close"
                className="absolute right-3 top-3 z-10 rounded-full p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white sm:right-6 sm:top-6"
            >
                <X size={24} />
            </button>

            <div
                role="dialog"
                aria-modal="true"
                className="flex h-[min(700px,88dvh)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-primary9 text-white shadow-2xl"
            >
                <div className="shrink-0">
                    {currentStep === 0 ? (
                        <DefaultStepTitle />
                    ) : currentStep === 1 ? (
                        <FirstStepPostTitle />
                    ) : currentStep === 2 ? (
                        <FinalStepPostTitle />
                    ) : null}
                </div>
                <div className="flex min-h-0 flex-1 flex-col p-3 sm:p-5">
                    <PostForm onClose={()=>closeModel()}/>
                </div>
            </div>
        </div>,
        document.body
    );
}
