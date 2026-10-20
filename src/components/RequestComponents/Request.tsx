'use client'

import { toast } from "sonner";
import ProfileIcon from "../ProfileIcon";
import { useState } from "react";
import { manageFriendsActions } from "@/lib/types";
import { manageFriendRequest } from "@/lib/services/request";
import LoadingSpinner from "../LoadingSpinner";
import { useRouter } from "next/navigation";


interface RequestProps{
    username:string
    avatar:string | null
    requestId: string
}



export default function Request({username,avatar,requestId}:RequestProps){
    const [isAccepting,setIsAccepting] = useState<boolean>(false);
    const [isDiclining,setIsDeclining] = useState<boolean>(false);
    const router = useRouter();
    const handleFriendRequest = async (action:manageFriendsActions) =>{
        setIsAccepting(false);
        setIsDeclining(false);
        try{
            if (isDiclining !== isAccepting){
                return;
            }
            if (action === 'accept'){
                setIsAccepting(true);
                const result = await manageFriendRequest(action,requestId);
                if (!result?.success){
                    toast.error('Failed to accept friend request. Please try again.');
                    return;
                }
                toast.success('Friend request accepted!');
                router.refresh();
            }else{
                if (action === 'decline'){
                    setIsDeclining(true);
                    const result = await manageFriendRequest(action,requestId);
                    if (!result?.success){
                        toast.error('Failed to decline friend request. Please try again.');
                        return;
                    }
                    toast.success('Friend request declined!');
                    router.refresh();
                }
            }
        }
        catch(error){
            toast.error('Somthing went wrong, please try again.');
        }
        finally{
            setIsAccepting(false);
            setIsDeclining(false);
        }
    }
    return(
        <div className="flex items-center justify-between rounded-lg bg-primary5 p-3" key={requestId}>
            <ProfileIcon username={username} avatar={avatar}/>
            <div className="flex items-center gap-3">
                <button disabled={isAccepting} className={`${isAccepting ? 'opacity-80' : '' } rounded-lg bg-correct3 flex items-center justify-center hover:brightness-115 transition-all text-grey1 py-2 px-6 text-center cursor-pointer`} onClick={() => handleFriendRequest('accept')}>{isAccepting ? <LoadingSpinner/> : 'Accept'}</button>
                <button disabled={isDiclining} className={`flex items-center justify-center ${isDiclining ? 'opacity-80' : ''} rounded-lg bg-error3 hover:brightness-115 transition-all text-grey1 py-2 px-6 text-center cursor-pointer`} onClick={()=>handleFriendRequest('decline')}>{isDiclining ? <LoadingSpinner/> : 'Decline'}</button>
            </div>
        </div>
    )
}