'use state'

import ProfileIcon from "../ProfileIcon";
import AddFriendBtn from "./AddFriendBtn";




export default function AddFriend(){

    return(
        <div className="flex items-center justify-between p-2 rounded-lg bg-primary5 hover:brightness-115 transition-all cursor-pointer">
            <ProfileIcon/>
            <AddFriendBtn/>
        </div>
    )
}