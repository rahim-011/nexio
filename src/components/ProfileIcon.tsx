'use client'

import { useUserStore } from "@/lib/store/userStore";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ProfileIconProps {
    avatar?: string | null
    username?: string
    onClose?: () => void
    expanded?: boolean;
    redirect?: boolean;
}

export default function ProfileIcon({
    username,
    avatar,
    onClose,
    expanded = true,
    redirect
}: ProfileIconProps) {
    const { cachedUserInfos } = useUserStore();
    const mainUserAvatar = cachedUserInfos.avatar || '/callbackAvatar.webp';
    const router = useRouter();
    const mainUserUsername = cachedUserInfos.username;

    const finalAvatar = avatar ?? mainUserAvatar;
    const finalUsername = username ?? mainUserUsername;

    return (
        <button
            type="button"
            title={!expanded ? finalUsername : undefined}
            className={`flex min-w-0 items-center overflow-hidden text-left ${expanded ? 'flex-1 gap-2' : 'w-9 shrink-0 justify-center'}`}
            onClick={redirect ? ()=> {onClose;router.push(`/profile/${finalUsername}`)} : undefined}
        >
            <Image
                alt="user logo"
                width={35}
                height={35}
                className="h-8 w-8 shrink-0 rounded-full object-cover sm:h-[35px] sm:w-[35px]"
                unoptimized
                loading="eager"
                src={finalAvatar || '/callbackAvatar.webp'}
            />
            <span className={`min-w-0 truncate text-xs text-grey1 sm:text-[0.9rem] ${expanded ? 'block' : 'hidden'}`}>
                {finalUsername}
            </span>
        </button>
    );
}