"use client";

import { X } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

interface ConfirmModelProps {
    sub: string;
    title: string;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean
}

export default function ConfirmModel({
    sub,
    title,
    onClose,
    onConfirm,
    isLoading
}: ConfirmModelProps) {
    return (
        <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-primary7/60 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-title"
                className="w-full max-w-sm animate-in fade-in zoom-in-95 rounded-2xl border border-white/10 bg-primary9 p-5 text-white shadow-2xl duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-4 flex items-center justify-between">
                    <h2 id="confirm-title" className="text-lg font-semibold">
                        {title}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close confirmation"
                        className="rounded-lg p-2 text-grey1 transition hover:bg-white/10 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <p className="mb-6 text-sm leading-6 text-grey1">{sub}</p>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-white/10 bg-primary7 px-4 py-2.5 text-sm font-semibold text-grey1 transition hover:bg-white/10 hover:text-white cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={isLoading}
                        type="button"
                        onClick={onConfirm}
                        className={`${isLoading ? 'opacity-80' : ''} rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/20 hover:text-red-300 flex items-center justify-center cursor-pointer`}
                    >
                        {isLoading ? <LoadingSpinner/> :'Confirm'}
                    </button>
                </div>
            </div>
        </div>
    );
}