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

        const previousBodyOverflow = document.body.style.overflow;
        const previousHtmlOverflow = document.documentElement.style.overflow;
        const previousBodyOverscroll = document.body.style.overscrollBehavior;
        const previousHtmlOverscroll = document.documentElement.style.overscrollBehavior;

        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
        document.body.style.overscrollBehavior = "none";
        document.documentElement.style.overscrollBehavior = "none";

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                closeModel();
                usePostStore.setState({ currentStep: 0 });
            }
        };

        window.addEventListener("keydown", onKeyDown);

        return () => {
            document.body.style.overflow = previousBodyOverflow;
            document.documentElement.style.overflow = previousHtmlOverflow;
            document.body.style.overscrollBehavior = previousBodyOverscroll;
            document.documentElement.style.overscrollBehavior = previousHtmlOverscroll;
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [closeModel]);

    if (!mounted) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-primary9 sm:bg-primary7/60 sm:p-6 sm:backdrop-blur-sm"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    closeModel();
                    usePostStore.setState({ currentStep: 0 });
                }
            }}
        >
            <button
                type="button"
                onClick={() => {
                    closeModel();
                    usePostStore.setState({ currentStep: 0 });
                }}
                aria-label="Close"
                className="absolute right-3 top-3 z-20 hidden rounded-full p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white sm:block"
            >
                <X size={24} />
            </button>

            <div
                role="dialog"
                aria-modal="true"
                className="flex h-dvh w-full flex-col overflow-hidden bg-primary9 text-sm text-white sm:h-[min(700px,88dvh)] sm:max-w-4xl sm:rounded-2xl sm:border sm:border-white/10 sm:text-base sm:shadow-2xl"
            >
                <div className="shrink-0">
                    {currentStep === 0 ? (
                        <DefaultStepTitle
                            onClose={() => {
                                closeModel();
                                usePostStore.setState({ currentStep: 0 });
                            }}
                        />
                    ) : currentStep === 1 ? (
                        <FirstStepPostTitle />
                    ) : currentStep === 2 ? (
                        <FinalStepPostTitle />
                    ) : null}
                </div>

                <div className="flex min-h-0 flex-1 flex-col p-2 sm:p-5">
                    <PostForm onClose={() => closeModel()} />
                </div>
            </div>
        </div>,
        document.body
    );
}