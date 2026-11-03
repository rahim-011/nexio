'use client'

import { useState, useRef, useEffect } from "react";
import { Ellipsis, Trash2 } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import { useUserStore } from "@/lib/store/userStore";
import { User } from "@prisma/client";

interface DeleteModelProps {
    ariaLabel: string
    onConfirm: () => void
    loading?: boolean
    ownerUsername?: User['username']
}

export default function DeleteModel({ ariaLabel, onConfirm, loading, ownerUsername }: DeleteModelProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { cachedUserInfos } = useUserStore();
    const closingRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function closeRemovingModel(e: MouseEvent) {
            if (closingRef.current && !closingRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', closeRemovingModel);
        return () => document.removeEventListener('mousedown', closeRemovingModel);
    }, [isOpen]);

    if (ownerUsername && cachedUserInfos.username !== ownerUsername) return null;

    return (
        <div className="relative shrink-0" ref={closingRef}>
            <button
                type="button"
                aria-label={ariaLabel}
                onClick={() => setIsOpen((prev) => !prev)}
                className="cursor-pointer rounded-full p-1 text-grey2 transition-colors hover:bg-primary5 hover:text-grey1 sm:p-1.5"
            >
                <Ellipsis className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            {isOpen && (
                <div className="absolute bottom-2 right-10 z-20 mt-1 w-28 overflow-hidden rounded-lg border border-primary5 bg-primary8 p-1 shadow-xl sm:w-36 sm:rounded-xl">
                    <button
                        type="button"
                        disabled={loading}
                        onClick={() => onConfirm()}
                        className={`flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-500 sm:gap-2 sm:px-3 sm:py-2.5 sm:text-sm ${loading ? 'opacity-80' : ''}`}
                    >
                        {loading ? (
                            <LoadingSpinner />
                        ) : (
                            <>
                                <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                Delete
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    )
}