'use client'

import Link from "next/link";
import ChangePfp from "./ChangePfp";
import { useUserStore } from "@/lib/store/userStore";




export default function ProfileTitle(){
    const {cachedUserInfos} = useUserStore();
    const {username,totalPosts,totalFriends,bio,name} = cachedUserInfos;
    return(
        <div className="rounded-lg flex flex-col gap-3 bg-primary9 p-4">
            <div className="  flex items-center  gap-5">
                <ChangePfp/>
                <div className="flex flex-col text-grey1 justify-center">
                    <div className="flex flex-col">
                        <h3 className="text-[1.6rem] font-semibold">{username}</h3>
                        {name && <span className="text-grey1/70 text-[1.1rem]">{name}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[1rem]">{totalPosts} posts</span>
                        <span className="text-[1rem]">{totalFriends} friends</span>
                    </div>
                    <span className="text-[1.1rem]">{bio}</span>
                </div>
            </div>
            <Link href='/settings/edit-profile' className="rounded-lg text-center text-grey1 px-6 py-3 bg-primary5 hover:brightness-115 max-w-[60%] cursor-pointer text-[1.1rem]">Edit Profile</Link>
        </div>
        
    )
}