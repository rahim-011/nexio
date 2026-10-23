
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
    const [isOpen, setIsOpen] = useState(false);
    const { cachedUserInfos } = useUserStore();
    const isMyProfile = cachedUserInfos.username === userInfos.username;
    const [isRemoving,setIsRemoving] = useState<boolean>(false);
    const [isConfirmOpen,setIsConfirmOpen] = useState<boolean>(false);
    const router = useRouter();


    const profileLabelStyling: Record<ProfileLabels, string> = {
        "Edit Profile":
            "bg-primary5 text-grey1 hover:brightness-115",
        "Remove Friend":
            "border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300",
        "Add Friend":
            "bg-primary5 text-white hover:brightness-115",
        Pending:
            "cursor-not-allowed border border-white/10 bg-primary7 text-grey1/60",
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
            router.refresh();
        }
        catch(error){
            toast.error('Something went wrong, please try again.');
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
                        type="button"
                        disabled={
                            userInfos.profileLabel === "Pending" ||
                            userInfos.profileLabel === "Edit Profile"
                        }
                        className={`flex-1 rounded-xl px-5 py-3 text-sm font-semibold transition sm:flex-none sm:min-w-40 sm:text-base cursor-pointer ${profileLabelStyling[userInfos.profileLabel]}`}
                    >
                        {userInfos.profileLabel}
                    </button>

                    <button
                        type="button"
                        className="rounded-xl border border-white/10 bg-primary7 px-5 py-3 text-sm font-semibold text-grey1 transition hover:bg-primary6 sm:text-base cursor-pointer"
                    >
                        Message
                    </button>
                    {isConfirmOpen && <ConfirmModel sub={"Are you sure you want to remove this friend? You won't be able to see them in your friends list anymore"} title={"Remove Friend"} isLoading={isRemoving} onClose={()=>setIsOpen(false)} onConfirm={()=>handleRemoveFriend(userInfos.userId)}/>}
                </div>
            )}

            {isOpen && <FriendsModel onClose={() => setIsOpen(false)} friendsIds={userInfos.friendsIds}/>}
        </div>
    );
}
