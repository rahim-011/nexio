import { X } from "lucide-react"
import SearchBar from "../SearchBar"



interface NewMessageModelProps{
    closeModel: () =>void,
}

export default function NewMessageModel({closeModel }: NewMessageModelProps) {
    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="pointer-events-auto flex flex-col gap-3 relative bg-primary9 rounded-lg p-4 w-[600px] max-h-[70%] h-full justify-between">
                <div className="flex flex-col gap-4">   
                    <h1 className="text-3xl text-grey1 text-center">New message</h1>
                    <X className="absolute top-5 right-3 text-grey1 cursor-pointer hover:scale-105 transition-all" size={24} onClick={()=>closeModel()}/>
                    <div className="flex flex-col gap-2">
                        <span className="text-grey1 text-[0.9rem]">To:</span>
                        <SearchBar placeHolder="Search friends..." searchType="chat"/>
                    </div>
                </div>
                <button className="rounded-lg p-2 w-full text-center text-grey1 bg-primary5 hover:brightness-115 transition-all mt-2">Chat</button>
            </div>
        </div>
    )
}