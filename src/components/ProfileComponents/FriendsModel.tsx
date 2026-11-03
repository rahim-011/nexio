"use client";

import { useEffect, useState } from "react";
import { Search, X, UserRoundMinus } from "lucide-react";
import Image from "next/image";
import EmptySearchResult from "../EmptyCallbacks/EmptySearchResult";
import { User } from "@prisma/client";
import { getProfileFriends, ListedFriendsValue, removeFriend } from "@/lib/services/friend";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../LoadingSpinner";
import ConfirmModel from "../ConfirmModel";
import AddFriendBtn from "../FriendsComponents/AddFriendBtn";

type FriendsModelProps = {
    onClose: () => void;
    friendsIds: User["friendsIds"];
    isMyProfile: boolean
};

export default function FriendsModel({ onClose, friendsIds,isMyProfile }: FriendsModelProps) {
    const [isConfirmOpen,setIsConfirmOpen] = useState<boolean>(false);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isRemoving,setIsRemoving] = useState<boolean>(false);
    const [friends, setFriends] = useState<ListedFriendsValue[] | []>([]);
    const router = useRouter();

    useEffect(() => {
        async function fetchFriends() {
            setIsLoading(true);
            try {
                const result = await getProfileFriends(friendsIds);
                if (!result.success) {
                    toast.error("Failed to get profile users");
                    return;
                }
                setFriends(result.listedFriends as ListedFriendsValue[]);
            } catch {
                toast.error("Failed to get friends list!");
            } finally {
                setIsLoading(false);
            }
        }
        fetchFriends();
    }, [friendsIds.length]);

    const filteredFriends = friends.filter((friend) =>
        friend.username.toLowerCase().startsWith(search.toLowerCase())
    );

    const handleRemoveFriend = async (friendId:User['id']) =>{
        try{
            setIsRemoving(true);
            const result = await removeFriend(friendId);
            if (!result.success){
                toast.error('Failed to remove friend!');
                return;
            }
            toast.success('Friend has been removed successfully');
            setIsConfirmOpen(false);
            router.refresh();
        }
        catch(error){
            toast.error('Something went wrong, please try again.')
        }
        finally{
            setIsRemoving(false)
        }
    }

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-primary7/60 p-3 backdrop-blur-sm sm:p-6"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="friends-title"
                className="flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-white/10 bg-primary9 text-white shadow-2xl animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative flex items-center justify-center border-b border-white/10 px-4 py-4">
                    <h2 id="friends-title" className="text-lg font-semibold">
                        Friends
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close friends"
                        className="absolute right-3 rounded-lg p-2 text-grey1 transition hover:bg-white/10 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4">
                    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-primary7 px-3 py-3 transition focus-within:border-primary5">
                        <Search size={18} className="shrink-0 text-grey1" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search friends..."
                            className="w-full bg-transparent text-sm outline-none placeholder:text-grey1/70"
                        />
                    </div>
                </div>

                <div className="h-90 min-h-72 overflow-y-auto px-2 pb-3">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-10">
                            <LoadingSpinner />
                        </div>
                    ) : filteredFriends.length ? (
                        filteredFriends.map((friend) => (
                            <div
                                key={friend.id}
                                className="flex cursor-pointer items-center gap-3 rounded-xl p-3 transition hover:bg-white/5"
                            >
                                <div
                                    className="flex min-w-0 flex-1 items-center gap-3"
                                    onClick={() => router.push(`/profile/${friend.username}`)}
                                >
                                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-primary7 ring-1 ring-white/10">
                                        <Image
                                            src={friend.image ?? "/callbackAvatar.webp"}
                                            alt={friend.username}
                                            fill
                                            sizes="44px"
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold">
                                            {friend.username}
                                        </p>
                                        <p className="truncate text-sm text-grey1">
                                            {friend.name}
                                        </p>
                                    </div>
                                </div>

                                {isMyProfile  && <button
                                    type="button"
                                    onClick={() => setIsConfirmOpen(true)}
                                    className="flex shrink-0 items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/20 hover:text-red-300 cursor-pointer"
                                >
                                    <UserRoundMinus size={15} />
                                    Remove
                                </button>}
                                {isConfirmOpen && <ConfirmModel isLoading={isRemoving} sub={"Are you sure you want to remove this friend? You won't be able to see them in your friends list anymore"} title={"Remove Friend"} onClose={()=>setIsConfirmOpen(false)} onConfirm={()=>handleRemoveFriend(friend.id)}/>}
                            </div>
                        ))
                    ) : (
                        <EmptySearchResult />
                    )}
                </div>
            </div>
            
        </div>
    );
}