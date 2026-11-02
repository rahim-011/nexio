"use client";

import { toast } from "sonner";
import ProfileIcon from "../ProfileIcon";
import { useState } from "react";
import { manageFriendsActions } from "@/lib/types";
import { manageFriendRequest } from "@/lib/services/request";
import LoadingSpinner from "../LoadingSpinner";
import { useRouter } from "next/navigation";
import { useNotificationStore } from "@/lib/store/useNotificationStore";

interface RequestProps {
    username: string;
    avatar: string | null;
    requestId: string;
}

export default function Request({ username, avatar, requestId }: RequestProps) {
    const {decreaseTotal} = useNotificationStore();
    const [isAccepting, setIsAccepting] = useState(false);
    const [isDeclining, setIsDeclining] = useState(false);
    const router = useRouter();

    const isLoading = isAccepting || isDeclining;

    const handleFriendRequest = async (action: manageFriendsActions) => {
        if (isLoading) return;

        if (action === "accept") {
            setIsAccepting(true);
        } else {
            setIsDeclining(true);
        }

        try {
            const result = await manageFriendRequest(action, requestId);

            if (!result?.success) {
                toast.error(
                    action === "accept"
                        ? "Failed to accept friend request. Please try again."
                        : "Failed to decline friend request. Please try again."
                );
                return;
            }
            decreaseTotal('requests');
            toast.success(
                action === "accept"
                    ? "Friend request accepted!"
                    : "Friend request declined!"
            );

            router.refresh();
        } catch {
            toast.error("Something went wrong, please try again.");
        } finally {
            setIsAccepting(false);
            setIsDeclining(false);
        }
    };

    return (
        <div className="flex min-w-0 flex-col gap-2.5 rounded-lg bg-primary5 p-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:p-3">
            <div className="min-w-0">
                <ProfileIcon username={username} avatar={avatar} />
            </div>

            <div className="flex w-full items-center gap-2 sm:w-auto sm:gap-3">
                <button
                    disabled={isLoading}
                    className={`${isLoading ? "opacity-80" : ""} flex flex-1 cursor-pointer items-center justify-center rounded-lg bg-correct3 px-3 py-2 text-xs text-grey1 transition-all hover:brightness-115 disabled:cursor-not-allowed sm:flex-none sm:px-6 sm:py-2 sm:text-base`}
                    onClick={() => handleFriendRequest("accept")}
                >
                    {isAccepting ? <LoadingSpinner /> : "Accept"}
                </button>

                <button
                    disabled={isLoading}
                    className={`${isLoading ? "opacity-80" : ""} flex flex-1 cursor-pointer items-center justify-center rounded-lg bg-error3 px-3 py-2 text-xs text-grey1 transition-all hover:brightness-115 disabled:cursor-not-allowed sm:flex-none sm:px-6 sm:py-2 sm:text-base`}
                    onClick={() => handleFriendRequest("decline")}
                >
                    {isDeclining ? <LoadingSpinner /> : "Decline"}
                </button>
            </div>
        </div>
    );
}