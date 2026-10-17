'use client'

import { useUserStore } from "@/lib/store/userStore";
import Image from "next/image";





export default function ProfileIcon(){
    const {cachedUserInfos} = useUserStore();
    const avatar = cachedUserInfos.avatar || '/callbackAvatar.webp';
    const username = cachedUserInfos.username;
  
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
                src={avatar}/>
            </div>
            <span className="text-[0.9rem] text-grey1">{username}</span>
        </div>
    )
}