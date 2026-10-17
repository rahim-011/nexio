'use client'

import Image from "next/image";
import { useState } from "react";
import Overlay from "../Overlay";
import EditProfileModel from "./EditProfileModel";
import { useUserStore } from "@/lib/store/userStore";




export default function EditProfileTitle(){
    const [isEditing,setIsEditing] = useState<boolean>(false);
    const {cachedUserInfos} = useUserStore();
    const avatar = cachedUserInfos.avatar || '/callbackAvatar.webp';
    const username = cachedUserInfos.username;
    return(
        <div className="flex items-center justify-between rounded-lg p-4 bg-primary9">
            <div className="flex items-center justify-center gap-3">
                <div className="relative w-30 h-30 rounded-lg">
                    <Image 
                    alt="profile image"
                    src={avatar}
                    fill
                    loading="eager"
                    sizes="128px"
                    unoptimized
                    className="object-cover rounded-full"/>
                </div>
                <span className="text-grey1 text-[1.3rem]">{username}</span>
            </div>
            <button className="rounded-lg bg-primary5 hover:brightness-115 transition-all cursor-pointer text-[1.3rem] text-grey1 px-6 py-2" onClick={()=>setIsEditing(true)}>Edit Profile</button>
            {isEditing && <>
                <Overlay closeModel={()=> setIsEditing(false)}/>
                <EditProfileModel onClose={()=>setIsEditing(false)}/>
            </>}
        </div>
    )
}