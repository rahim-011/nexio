import { useChatStore } from "@/lib/store/chatStore";
import ProfileIcon from "../ProfileIcon";
import SelectedCircle from "../SelectedCircle";
import { FilteredFriendsValues } from "@/lib/services/friend";

export default function AddNewMessage({index,friend}:{index:number,friend:FilteredFriendsValues}){
    const {setCurrentMessage,currentMessageIndex,setSelectedFriendId} = useChatStore();
    const isActive = currentMessageIndex === index;
    const bgClass = isActive ? 'bg-primary3' : 'bg-primary5 hover:brightness-115';

    return(
        <div className={`${bgClass} flex items-center justify-between rounded-lg p-2 cursor-pointer`} onClick={()=>{setCurrentMessage(index);setSelectedFriendId(friend.id)}}>
            <ProfileIcon username={friend.username} avatar={friend.avatar} redirect={false}/>
            <SelectedCircle index={index}/>
        </div>
    )
}