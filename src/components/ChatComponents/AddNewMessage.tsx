import { useChatStore } from "@/lib/store/chatStore";
import ProfileIcon from "../ProfileIcon";
import SelectedCircle from "../SelectedCircle";

export default function AddNewMessage({index}:{index:number}){
    const {setCurrentMessage,currentMessageIndex} = useChatStore();
    console.log(currentMessageIndex)
    const isActive = currentMessageIndex === index;
    const bgClass = isActive ? 'bg-primary3' : 'bg-primary5 hover:brightness-115';

    return(
        <div className={`${bgClass} flex items-center justify-between rounded-lg p-2 cursor-pointer`} onClick={()=>setCurrentMessage(index)}>
            <ProfileIcon/>
            <SelectedCircle index={index}/>
        </div>
    )
}