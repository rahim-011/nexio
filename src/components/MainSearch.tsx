'use client'

import Overlay from "./Overlay";
import SearchBar from "./SearchBar";
import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function MainSearch({ closeModel }: { closeModel: () => void }) {
    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                closeModel();
            }
        }
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [closeModel]);
    

    return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-2">
        <Overlay closeModel={closeModel} isMain={true} />
        <div className="relative z-50 w-full max-w-2xl px-4 md:max-w-3xl">
            <SearchBar placeHolder="Search Nexio..." searchType="all" />
        </div>
    </div>,
    document.body
);
}