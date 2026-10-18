'use client'

import { useUserStore } from "@/lib/store/userStore";
import Image from "next/image";




interface ProfileIconProps{
    avatar?: string | null
    username?: string
}


export default function ProfileIcon({username,avatar}:ProfileIconProps){
    const {cachedUserInfos} = useUserStore();
    const mainUserAvatar = cachedUserInfos.avatar || '/callbackAvatar.webp';
    const mainUserUsername = cachedUserInfos.username;
    
    const finalAvatar = avatar ?? mainUserAvatar;
    const finalUsername = username ?? mainUserUsername;
    return(
        <div className="flex items-center gap-2">
            <div className="relative rounded-full">
                <Image
                alt="user logo"
                width={35}
                height={35}
                className="object-cover rounded-full"
                unoptimized
                loading="eager"
                src={finalAvatar || '/callbackAvatar.webp'}/>
            </div>
            <span className="text-[0.9rem] text-grey1">{finalUsername}</span>
        </div>
    )
}