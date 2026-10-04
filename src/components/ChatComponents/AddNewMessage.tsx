import { useChatStore } from "@/lib/store/chatStore";
import ProfileIcon from "../ProfileIcon";

export default function AddNewMessage({index}:{index:number}){
    console.log(index)
    const {setCurrentMessage,currentMessageIndex} = useChatStore();
    const isActive = currentMessageIndex === index;
    const bgClass = isActive ? 'bg-primary3' : 'bg-primary5 hover:brightness-115';
    const circleBgClass = isActive ? 'bg-primary1' : 'bg-transparent';

    return(
        <div className={`${bgClass} flex items-center justify-between rounded-lg p-2 cursor-pointer`} onClick={()=>setCurrentMessage(index)}>
            <ProfileIcon/>
            <div className="flex items-center justify-center rounded-full p-0.5 w-5 h-5 border-primary1/90 border-[1px]">
                <div className={`w-3 h-3 rounded-full transition-all ${circleBgClass}`}></div>
            </div>
        </div>
    )
}