"use client";

import { ArrowLeft } from "lucide-react";

export default function DefaultStepTitle({
    onClose,
}: {
    onClose: () => void;
}) {
    return (
        <div className="relative flex h-14 w-full items-center justify-center border-b border-white/10 bg-primary6 px-12 sm:h-16 sm:px-4">
            <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute left-3 flex h-9 w-9 items-center justify-center rounded-full text-grey1 transition-colors hover:bg-white/10 hover:text-white sm:hidden"
            >
                <ArrowLeft size={20} />
            </button>

            <h1 className="text-base font-semibold tracking-wide text-grey1 sm:text-2xl">
                Add new post
            </h1>
        </div>
    );
}