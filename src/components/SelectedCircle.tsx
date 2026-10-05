import { useChatStore } from "@/lib/store/chatStore";




export default function SelectedCircle({index}:{index:number | null}){
    const {currentMessageIndex} = useChatStore();
        const isActive = currentMessageIndex === index;
    const circleBgClass = isActive ? 'bg-primary1' : 'bg-transparent';
    
    return(
        <div className="flex items-center justify-center rounded-full p-0.5 w-5 h-5 border-primary1/90 border-[1px]">
            <div className={`w-3 h-3 rounded-full transition-all ${circleBgClass}`}></div>
        </div>
    )
}