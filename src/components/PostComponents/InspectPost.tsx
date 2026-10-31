"use client";


import Image from "next/image";
import { X } from "lucide-react";
import InspectPostSub from "./InpsectPostSub";
import ProfileIcon from "../ProfileIcon";
import { userPost } from "../ProfileComponents/ProfilePosts";
import DeleteModel from "../DeleteModel";
import { useUserStore } from "@/lib/store/userStore";
import { useState } from "react";
import { Post, User } from "@prisma/client";
import { toast } from "sonner";
import { deletePost } from "@/lib/services/posts";
import { useRouter } from "next/navigation";

interface InspectPostProps {
    onClose: () => void;
    postInfos: userPost;
    currentUserId: User["id"];
}

export default function InspectPost({ onClose, postInfos, currentUserId }: InspectPostProps) {
    const router = useRouter();
    const [isRemoving, setIsRemoving] = useState<boolean>(false);
    const { cachedUserInfos } = useUserStore();
    const { username } = cachedUserInfos;
    const isMyPost = username === postInfos.user.username;

    const handleDeletePost = async (postId: Post["id"]) => {
        try {
            setIsRemoving(true);
            const result = await deletePost(postId);

            if (!result.success) {
                toast.error("Failed to delete this post, please try again.");
                return;
            }

            toast.success("Post has been deleted successfully");
            onClose();
            router.refresh();
        } catch (error) {
            toast.error("Somthing went wrong, please try again.");
        } finally {
            setIsRemoving(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-primary7/80 p-0 backdrop-blur-sm sm:p-4"
            onClick={onClose}
        >
            <div
                className="flex h-dvh w-full flex-col overflow-hidden bg-primary8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 sm:h-[90dvh] sm:max-w-6xl sm:rounded-2xl sm:border sm:border-primary5"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex shrink-0 items-center justify-between gap-2 border-b border-primary5 bg-primary8 px-3 py-2.5 sm:gap-3 sm:px-5 sm:py-4">
                    <div className="flex min-w-0 items-center gap-3 sm:gap-5">
                        <ProfileIcon
                            username={postInfos.user.username}
                            avatar={postInfos.user.image}
                            onClose={() => onClose()}
                        />

                        {isMyPost && (
                            <DeleteModel
                                ariaLabel="post options"
                                onConfirm={() => handleDeletePost(postInfos.id)}
                                loading={isRemoving}
                                ownerUsername={postInfos.user.username}
                            />
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close post"
                        className="shrink-0 cursor-pointer rounded-full p-1.5 text-grey1 transition-colors hover:bg-primary6 sm:p-2"
                    >
                        <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                </div>

                <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:grid md:grid-cols-2">
                    <div className="relative h-[40%] min-h-0 w-full shrink-0 overflow-hidden bg-primary9 md:h-auto md:min-h-0">
                        {postInfos.media.resourceType === "image" ? (
                            <Image
                                alt="Post image"
                                fill
                                sizes="(max-width: 767px) 100vw, 50vw"
                                loading="eager"
                                src={postInfos.media.url}
                                className="object-contain md:object-cover"
                            />
                        ) : (
                            <video
                                src={postInfos.media.url}
                                controls
                                playsInline
                                preload="metadata"
                                className="absolute inset-0 h-full w-full object-contain md:object-cover"
                            />
                        )}
                    </div>

                    <div className="min-h-0 flex-1 overflow-hidden border-t border-primary5 md:border-l md:border-t-0">
                        <InspectPostSub
                            currentUserId={currentUserId}
                            onClose={() => onClose()}
                            caption={postInfos.caption || ""}
                            postedTime={postInfos.postedTime}
                            likes={postInfos.likes}
                            comments={postInfos.comments}
                            posterInfos={{
                                username: postInfos.user.username,
                                avatar: postInfos.user.image
                            }}
                            postId={postInfos.id}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
