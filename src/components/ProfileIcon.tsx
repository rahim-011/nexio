
'use client'

import { useUserStore } from "@/lib/store/userStore";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ProfileIconProps {
    avatar?: string | null
    username?: string
    onClose?: () => void
    expanded?: boolean
}

export default function ProfileIcon({
    username,
    avatar,
    onClose,
    expanded = true
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
            className={`flex min-w-0 items-center overflow-hidden text-left ${expanded ? 'flex-1 gap-2' : 'w-10 shrink-0 justify-center'}`}
            onClick={() => {
                onClose?.();
                router.push(`/profile/${finalUsername}`);
            }}
        >
            <Image
                alt="user logo"
                width={35}
                height={35}
                className="h-[35px] w-[35px] shrink-0 rounded-full object-cover"
                unoptimized
                loading="eager"
                src={finalAvatar || '/callbackAvatar.webp'}
            />
            <span className={`min-w-0 truncate text-[0.9rem] text-grey1 ${expanded ? 'block' : 'hidden'}`}>
                {finalUsername}
            </span>
        </button>
    );
}
