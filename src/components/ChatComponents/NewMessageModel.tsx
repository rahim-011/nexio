'use client'


import { X } from "lucide-react"
import SearchBar from "../SearchBar"
import { useChatStore } from "@/lib/store/chatStore"
import { clearSearch } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FilteredFriendsValues } from "@/lib/services/friend";
import { toast } from "sonner";
import { createChatInbox } from "@/lib/services/message";
import { useState } from "react";
import LoadingSpinner from "../LoadingSpinner";



interface NewMessageModelProps{
    closeModel: () =>void,
    filtredFriends: FilteredFriendsValues[]
}

export default function NewMessageModel({closeModel,filtredFriends }: NewMessageModelProps) {
    const [isLoading,setIsLoading] = useState<boolean>(false);
    const {currentMessageIndex,clearCurrentMessage,selectedFriendId,setSelectedFriendId} = useChatStore();
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const handleCreateChat = async() =>{
        try{
            if (!selectedFriendId){
                return;
            }
            setIsLoading(true);
            const result = await createChatInbox(selectedFriendId);
            if (!result.success){
                toast.error("Failed to create chat!");
                return;
            }
            clearSearch(pathname,searchParams,router);
            clearCurrentMessage();
            setSelectedFriendId(null);
            closeModel();
            router.push(`/messages/${result.chat?.id}`)
        }
        catch(error){
            toast.error('Somthing went wrong, please try again!')
        }
        finally{
            setIsLoading(false);
        }
    }
    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="pointer-events-auto flex flex-col gap-3 relative bg-primary9 rounded-lg p-4 w-[600px] max-h-[70%] h-full justify-between">
                <div className="flex flex-col gap-4">   
                    <h1 className="text-3xl text-grey1 text-center">New message</h1>
                    <X className="absolute top-5 right-3 text-grey1 cursor-pointer hover:scale-105 transition-all" size={24} onClick={()=>{closeModel();clearCurrentMessage();clearSearch(pathname,searchParams,router)}}/>
                    <div className="flex flex-col gap-2">
                        <span className="text-grey1 text-[0.9rem]">To:</span>
                        <SearchBar placeHolder="Search friends..." searchType="chat" filtredFriends={filtredFriends ?? []}/>
                    </div>
                </div>
                <button className={`flex items-center justify-center rounded-lg p-2 w-full text-center text-grey1 ${currentMessageIndex !== null ? 'bg-primary5' : 'bg-primary5/70'} hover:brightness-115 transition-all mt-2 cursor-pointer`} onClick={handleCreateChat}>{isLoading ? <LoadingSpinner/> : 'Create Chat'}</button>
            </div>
        </div>
    )
}