
"use client";

import Link from "next/link";
import ChangePfp from "./ChangePfp";
import { useState } from "react";
import FriendsModel from "./FriendsModel";
import { ProfileLabels } from "@/lib/types";
import { useUserStore } from "@/lib/store/userStore";
import Image from "next/image";
import { toast } from "sonner";
import { User } from "@prisma/client";
import { removeFriend } from "@/lib/services/friend";
import { useRouter } from "next/navigation";
import ConfirmModel from "../ConfirmModel";
import { cancelFriendRequest, sendFriendRequest } from "@/lib/services/request";
import LoadingSpinner from "../LoadingSpinner";
import { createChatInbox } from "@/lib/services/message";
import { socket, verifyConnection } from "@/lib/socket";
import { JoinChatResponse } from "@/socket-server";
import { useSocket } from "@/hooks/useSocket";

interface ProfileTitleProps {
    name: string | null;
    username: string;
    avatar: string | null;
    userId: string;
    bio: string | null;
    friendsIds: string[];
    totalPosts: number;
    profileLabel: ProfileLabels;
}

export default function ProfileTitle({
    userInfos,
}: {
    userInfos: ProfileTitleProps;
}) {
    useSocket();// start the socket connection

    const [isOpen, setIsOpen] = useState(false);
    const [isCreating,setIsCreating] = useState<boolean>(false);
    const [isSending,setIsSending] = useState<boolean>(false);
    const [isCancelling,setIsCancelling] = useState<boolean>(false);
    const [btnStatus,setBtnStatus] = useState<ProfileLabels>(userInfos.profileLabel);
    const { cachedUserInfos } = useUserStore();
    const isMyProfile = cachedUserInfos.username === userInfos.username;
    const [isRemoving,setIsRemoving] = useState<boolean>(false);
    const [isConfirmOpen,setIsConfirmOpen] = useState<boolean>(false);
    const router = useRouter();
    const profileLabelStyling: Record<ProfileLabels, string> = {
        "Edit Profile":
            "border border-sky-400/25 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 hover:text-sky-200",

        "Remove Friend":
            "border border-rose-500/25 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300",

        "Add Friend":
            "border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300",

        Pending:
            "border border-violet-400/20 bg-violet-500/10 text-violet-300/80 hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
    };

    const handleRemoveFriend = async(friendId:User['id']) =>{
        try{
            setIsRemoving(true);
            const result = await removeFriend(friendId);
            if(!result.success){
                toast.error('Failed to remove friend');
                return;
            } 
            toast.success('Friend has been removed successfully');
            setIsConfirmOpen(false);
            setBtnStatus('Add Friend');
            router.refresh();
        }
        catch(error){
            toast.error('Something went wrong, please try again.');
        }
    }
    const handleSendingRequest = async(friendId:User['id']) =>{
        try{
            setIsSending(true);
            const result = await sendFriendRequest(friendId);
            if (!result.success){
                toast.error('Failed to send friend request.');
                return;
            }
            toast.success('Friend request has been send successfully.');setBtnStatus('Pending');
            router.refresh();
        }
        catch(error){
            toast.error('Somthing went wrong, please try again.');
        }
        finally{
            setIsSending(false);
        }
    }
    const handleCancelingRequest = async(receiverId:User['id'])=>{
        try{
            setIsCancelling(true);
            const result = await cancelFriendRequest(receiverId);
            if (!result.success) {
                    toast.error("Failed to cancel the friend request.");
                    return;
                }
            setBtnStatus("Add Friend");
            toast.success("Friend request cancelled");
        }
        catch(error){
            toast.error("Something went wrong, please try again.");
        }
        finally{
            setIsCancelling(false);
        }
    }

    const handleCreateChat = async() =>{
        try{
            setIsCreating(true);
            const result = await createChatInbox(userInfos.userId);
            if (!result.success){
                toast.error("Failed to open conversation. Please try again.");
                return;
            }
            const chatId = result.chat?.id;
            await verifyConnection();
            socket.emit("chat:join",chatId, ((response:JoinChatResponse) => {
                console.log(response)
                if (!response.success){
                    toast.error('Failed to join conversation!,please try again.');
                    return;
                }
                router.push(`/messages/${chatId}`);
            }))
        }
        catch(error){
            toast.error('Somthing went wrong, please try again.')
        }
        finally{
            setIsCreating(false);
        }
    }
    return (
        <div className="flex flex-col gap-4 rounded-xl border border-white/5 bg-primary9 p-5">
            <div className="flex items-center gap-5">
                {isMyProfile ? (
                    <ChangePfp />
                ) : (
                    <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary7 ring-2 ring-primary5/40 sm:h-32 sm:w-32">
                        <Image
                            alt={`${userInfos.username}'s profile picture`}
                            fill
                            sizes="(max-width: 640px) 96px, 128px"
                            loading="eager"
                            className="rounded-full object-cover"
                            unoptimized
                            src={userInfos.avatar ?? "/callbackAvatar.webp"}
                        />
                    </div>
                )}

                <div className="flex min-w-0 flex-col justify-center gap-1 text-grey1">
                    <div className="flex min-w-0 flex-col">
                        <h3 className="truncate text-xl font-semibold sm:text-2xl">
                            {userInfos.username}
                        </h3>
                        {userInfos.name && (
                            <span className="truncate text-sm text-grey1/70 sm:text-base">
                                {userInfos.name}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-3 text-sm sm:text-base">
                        <span>{userInfos.totalPosts} posts</span>
                        <button
                            type="button"
                            onClick={() => setIsOpen(true)}
                            className="cursor-pointer transition hover:text-white"
                        >
                            {userInfos.friendsIds.length} friends
                        </button>
                    </div>

                    {userInfos.bio && (
                        <p className="line-clamp-2 break-words text-sm sm:text-base">
                            {userInfos.bio}
                        </p>
                    )}
                </div>
            </div>

            {isMyProfile ? (
                <Link
                    href="/settings/edit-profile"
                    className={`flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition sm:w-1/2 sm:text-base ${profileLabelStyling["Edit Profile"]}`}
                >
                    Edit Profile
                </Link>
            ) : (
                <div className="flex w-full flex-wrap gap-3">
                    <button
                        onClick={btnStatus === 'Remove Friend' ? ()=>setIsConfirmOpen(true) : btnStatus === 'Add Friend' ? () => handleSendingRequest(userInfos.userId) : (btnStatus !== 'Edit Profile' && btnStatus === 'Pending') ? ()=>handleCancelingRequest(userInfos.userId) :  undefined}
                        type="button"
                        disabled={
                            btnStatus === "Edit Profile" ||
                            isSending ||
                            isCancelling
                        }
                        className={`flex items-center justify-center ${isSending ? 'opacity-80' : ''} flex-1 rounded-xl px-5 py-3 text-sm font-semibold transition sm:flex-none sm:min-w-40 sm:text-base cursor-pointer ${profileLabelStyling[btnStatus]}`}
                    >
                        {(isSending || isCancelling) ? <LoadingSpinner/> : btnStatus}
                    </button>

                    <button
                        type="button"
                        onClick={()=>handleCreateChat()}
                        className={`flex items-center justify-center ${isCreating ? 'opacity-80' : ''} rounded-xl border border-white/10 bg-primary7 px-5 py-3 text-sm font-semibold text-grey1 transition hover:bg-primary6 sm:text-base cursor-pointer`}
                        
                    >
                        {isCreating ? <LoadingSpinner/> : 'Message'}
                    </button>
                    {isConfirmOpen && <ConfirmModel sub={"Are you sure you want to remove this friend? You won't be able to see them in your friends list anymore"} title={"Remove Friend"} isLoading={isRemoving} onClose={()=>setIsConfirmOpen(false)} onConfirm={()=>handleRemoveFriend(userInfos.userId)}/>}
                </div>
            )}

            {isOpen && <FriendsModel onClose={() => setIsOpen(false)} friendsIds={userInfos.friendsIds}/>}
        </div>
    );
}
