import { useChatStore } from "@/lib/store/chatStore";
import ProfileIcon from "./ProfileIcon";
import SelectedCircle from "./SelectedCircle";
import AddFriendBtn from "./FriendsComponents/AddFriendBtn";



export default function MainSearchResults({index}:{index:number|null}){
    const {setCurrentMessage} = useChatStore();
    return(
        <div className="flex items-center justify-between rounded-lg p-2 cursor-pointer" onClick={()=>setCurrentMessage(index)}>
            <ProfileIcon/>
            {<SelectedCircle index={index}/>}
            {/* {<AddFriendBtn/>} */}
        </div>
    )
}