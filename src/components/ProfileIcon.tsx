'use client'

import { useUserStore } from "@/lib/store/userStore";
import Image from "next/image";
import { useRouter } from "next/navigation";




interface ProfileIconProps{
    avatar?: string | null
    username?: string
    onClose?: () => void
}


export default function ProfileIcon({username,avatar,onClose}:ProfileIconProps){
    const {cachedUserInfos} = useUserStore();
    const mainUserAvatar = cachedUserInfos.avatar || '/callbackAvatar.webp';
    const router = useRouter();
    const mainUserUsername = cachedUserInfos.username;
    
    const finalAvatar = avatar ?? mainUserAvatar;
    const finalUsername = username ?? mainUserUsername;
    return(
        <div className="flex items-center gap-2 cursor-pointer" onClick={()=>{onClose && onClose();router.push(`/profile/${username}`)}}>
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