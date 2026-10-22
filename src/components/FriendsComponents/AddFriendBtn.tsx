"use client";

import { cancelFriendRequest, manageFriendRequest, sendFriendRequest } from "@/lib/services/request";
import { Requests, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import LoadingSpinner from "../LoadingSpinner";
import { FriendStatus } from "@/lib/types";

interface AddFriendProps {
    receiverId: User["id"];
    requestStatus: FriendStatus;
    requestId: Requests["id"] | undefined;
}

export default function AddFriendBtn({ receiverId, requestStatus, requestId }: AddFriendProps) {
    const router = useRouter();
    const [btnStatus, setBtnStatus] = useState<string>(requestStatus || "add friend");
    const [isPending, setIsPending] = useState<boolean>(false);

    const bgClass =
        btnStatus === "pending"
            ? "bg-primary2 text-white"
            : btnStatus === "accept"
              ? "bg-green-600 text-white hover:bg-green-700"
              : btnStatus === "friends"
                ? "bg-blue-100 text-blue-700 border border-blue-200 cursor-default"
                : "bg-grey1 text-grey7 hover:bg-grey2";

    async function addFriend() {
        if (isPending || btnStatus === "friends") return;

        try {
            if (btnStatus === "pending") {
                const result = await cancelFriendRequest(receiverId);
                if (!result.success) {
                    toast.error("Failed to cancel the friend request.");
                    return;
                }
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
                    toast.success("Friend request sent!");
                    setBtnStatus("pending");
                } else {
                    if (btnStatus === "accept") {
                        const result = await manageFriendRequest("accept", requestId as Requests["id"]);
                        if (!result?.success) {
                            toast.error("Failed to accept friend request. Please try again.");
                            return;
                        }
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
            disabled={isPending}
            className={`${bgClass} flex h-10 w-32 shrink-0 items-center justify-center whitespace-nowrap rounded-lg px-3 text-center transition-all hover:brightness-95 disabled:cursor-wait disabled:opacity-100`}
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