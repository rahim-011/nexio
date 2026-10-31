'use client'


import Image from "next/image";
import { useState } from "react";
import Overlay from "../Overlay";
import EditProfileModel from "./EditProfileModel";
import { useUserStore } from "@/lib/store/userStore";

export default function EditProfileTitle() {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const { cachedUserInfos } = useUserStore();
    const avatar = cachedUserInfos.avatar || '/callbackAvatar.webp';
    const username = cachedUserInfos.username;

    return (
        <div className="flex flex-col items-start justify-between gap-3 rounded-lg bg-primary9 p-3 sm:flex-row sm:items-center sm:gap-0 sm:p-4">
            <div className="flex min-w-0 items-center gap-3">
                <div className="relative h-20 w-20 shrink-0 rounded-lg sm:h-30 sm:w-30">
                    <Image
                        alt="profile image"
                        src={avatar}
                        fill
                        loading="eager"
                        sizes="(max-width: 640px) 80px, 128px"
                        unoptimized
                        className="rounded-full object-cover"
                    />
                </div>
                <span className="break-all text-base text-grey1 sm:text-[1.3rem]">
                    {username}
                </span>
            </div>

            <button
                className="w-full cursor-pointer rounded-lg bg-primary5 px-4 py-2 text-base text-grey1 transition-all hover:brightness-115 sm:w-auto sm:px-6 sm:text-[1.3rem]"
                onClick={() => setIsEditing(true)}
            >
                Edit Profile
            </button>

            {isEditing && (
                <>
                    <Overlay closeModel={() => setIsEditing(false)} />
                    <EditProfileModel onClose={() => setIsEditing(false)} />
                </>
            )}
        </div>
    );
}