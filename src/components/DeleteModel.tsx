'use client'

import { useState,useRef,useEffect } from "react";
import { Ellipsis,Trash2 } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import { useUserStore } from "@/lib/store/userStore";
import { User } from "@prisma/client";

interface DeleteModelProps{
    ariaLabel: string
    onConfirm: () =>void
    loading : boolean
    ownerUsername?: User['username']
}

export default function DeleteModel({ariaLabel,onConfirm,loading,ownerUsername}:DeleteModelProps){
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const {cachedUserInfos} = useUserStore();
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
    return(
        <div className="relative shrink-0" ref={closingRef}>
            <button
                type="button"
                aria-label={ariaLabel}
                onClick={() => setIsOpen((prev) => !prev)}
                className="rounded-full p-1.5 text-grey2 transition-colors hover:bg-primary5 hover:text-grey1 cursor-pointer"
            >
                <Ellipsis className="h-5 w-5" />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full z-20 mt-1 w-36 overflow-hidden rounded-xl border border-primary5 bg-primary8 p-1 shadow-xl" ref={closingRef}>
                    <button
                        type="button"
                        disabled={loading}
                        onClick={() => onConfirm()}
                        className={`flex w-full items-center gap-2 justify-center rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-500 cursor-pointer ${loading ? 'opacity-80' : ''}`}
                    >
                        {loading ? <LoadingSpinner/> :
                        <><Trash2 className="h-4 w-4" />Delete</> }
                    </button>
                </div>
            )}
        </div>
    )
}