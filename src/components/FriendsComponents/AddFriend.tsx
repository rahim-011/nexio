'use state'

import { Requests } from "@prisma/client";
import ProfileIcon from "../ProfileIcon";
import AddFriendBtn from "./AddFriendBtn";
import { FilteredFriendsValues } from "@/lib/services/friend";
import { FriendStatus } from "@/lib/types";
import { useRouter } from "next/navigation";



interface AddFriendProps{
    friendRes: FilteredFriendsValues
}

export default function AddFriend({friendRes}:AddFriendProps){
    const router = useRouter();
    if (!friendRes){
        return null
    }
    return(
        <div className="flex items-center justify-between p-2 rounded-lg bg-primary5 hover:brightness-115 transition-all cursor-pointer" onClick={()=>router.push(`/profile/${friendRes.username}`)}>
            <ProfileIcon username={friendRes.username} avatar={friendRes.avatar}/>
            <AddFriendBtn  receiverId={friendRes.id} requestStatus={friendRes.requestStatus as FriendStatus} requestId={friendRes.requestId}/>
        </div>
    )
}