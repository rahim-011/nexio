"use client";

import { cancelFriendRequest, manageFriendRequest, sendFriendRequest } from "@/lib/services/request";
import { Requests, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import LoadingSpinner from "../LoadingSpinner";
import { FriendStatus } from "@/lib/types";
import { useNotificationStore } from "@/lib/store/useNotificationStore";

interface AddFriendProps {
    receiverId: User["id"];
    requestStatus: FriendStatus | 'Add Friend';
    requestId?: Requests["id"] | undefined;

}

export default function AddFriendBtn({ receiverId, requestStatus, requestId }: AddFriendProps) {
    const router = useRouter();
    const {increaseTotal,decreaseTotal} = useNotificationStore();
    const [btnStatus, setBtnStatus] = useState<string>(requestStatus || "add friend");
    const [isPending, setIsPending] = useState<boolean>(false);

    const bgClass =
  btnStatus === "pending"
    ? "border border-violet-400/20 bg-violet-500/10 text-violet-300/80 hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
    : btnStatus === "accept"
      ? "bg-green-600 text-white hover:bg-green-700"
      : btnStatus === "friends"
        ? "border border-rose-500/25 bg-rose-500/10 text-rose-400 cursor-default"
        : "border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300";

    async function addFriend() {
        if (isPending || btnStatus === "friends") return;

        try {
            if (btnStatus === "pending") {
                const result = await cancelFriendRequest(receiverId);
                if (!result.success) {
                    toast.error("Failed to cancel the friend request.");
                    return;
                }
                decreaseTotal('requests');
                setBtnStatus("add friend");
                toast.success("Friend request cancelled");
            } else {
                if (btnStatus === "add friend") {
                    setIsPending(true);
                    const result = await sendFriendRequest(receiverId);
                    if (!result.success) {
                        toast.error("Failed to send the friend request");
                        setBtnStatus("add friend");
                        return;
                    }
                    increaseTotal('requests')
                    toast.success("Friend request sent!");
                    setBtnStatus("pending");
                } else {
                    if (btnStatus === "accept") {
                        const result = await manageFriendRequest("accept", requestId as Requests["id"]);
                        if (!result?.success) {
                            toast.error("Failed to accept friend request. Please try again.");
                            return;
                        }
                        decreaseTotal('requests');
                        toast.success("Friend request accepted!");
                        setBtnStatus("friends");
                        router.refresh();
                    }
                }
            }
        } catch {
            toast.error("Something went wrong, please try again.");
        } finally {
            setIsPending(false);
        }
    }

    return (
        <button
            type="button"
            className={`${bgClass} flex h-10 w-32 shrink-0 items-center justify-center whitespace-nowrap rounded-lg px-3 text-center transition-all hover:brightness-95  cursor-pointer`}
            onClick={(e) => {
                e.stopPropagation();
                addFriend();
            }}
        >
            {isPending ? (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-transparent">
                    <LoadingSpinner />
                </span>
            ) : (
                btnStatus
            )}
        </button>
    );
}