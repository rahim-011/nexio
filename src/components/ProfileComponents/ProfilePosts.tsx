"use client";

import type { ResourceTypes, User } from "@prisma/client";
import EmptyPosts from "../EmptyCallbacks/EmptyPosts";
import Post from "./Post";
import { useUserStore } from "@/lib/store/userStore";
import EmptyPostsViste from "../EmptyCallbacks/EmpyPostsVisite";
import { Fragment, useState } from "react";
import InspectPost from "../PostComponents/InspectPost";
import { useRouter } from "next/navigation";

export type userPost = {
    id: string;
    user: User;
    media: {
        resourceType: ResourceTypes;
        url: string;
    };
    postedTime: Date;
    caption: string | null;
    comments: {
        id: string;
        content: string;
        user: User;
        postId: string;
        commentedTime: Date;
    }[];
    likes: {
        id: string;
        userId: string;
        postId: string;
    }[];
};

type ProfilePostsValues = {
    userPosts: userPost[];
    username: string;
    currentUserId: User["id"];
};

export default function ProfilePosts({
    userPosts,
    username,
    currentUserId
}: ProfilePostsValues) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { cachedUserInfos } = useUserStore();
    const router = useRouter();
    const isMyProfile = username === cachedUserInfos.username;

    return (
        <div className="flex min-w-0 flex-col gap-3 p-2 sm:gap-4 sm:p-3">
            <h2 className="text-xl font-semibold text-grey1 sm:text-2xl">
                Posts
            </h2>

            {userPosts.length === 0 ? (
                isMyProfile ? (
                    <EmptyPosts />
                ) : (
                    <EmptyPostsViste />
                )
            ) : (
                <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                    {userPosts.map((post) => (
                        <Fragment key={post.id}>
                            <Post
                                postInfos={post}
                                onOpen={() => setIsOpen(true)}
                            />

                            {isOpen && (
                                <InspectPost
                                    onClose={() => {
                                        setIsOpen(false);
                                        router.refresh();
                                    }}
                                    postInfos={post}
                                    currentUserId={currentUserId}
                                />
                            )}
                        </Fragment>
                    ))}
                </div>
            )}
        </div>
    );
}