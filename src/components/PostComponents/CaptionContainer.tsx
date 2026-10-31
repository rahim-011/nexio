"use client";

import ProfileIcon from "../ProfileIcon";
import CaptionForm from "./CaptionForm";

export default function CaptionContainer() {
    return (
        <div className="flex h-full min-h-0 w-full flex-1 flex-col gap-2 sm:gap-3">
            <div className="shrink-0">
                <ProfileIcon />
            </div>
            <div className="min-h-0 flex-1">
                <CaptionForm />
            </div>
        </div>
    );
}