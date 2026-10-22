'use client'

import type { ResourceTypes, User } from "@prisma/client";
import EmptyPosts from "../EmptyCallbacks/EmptyPosts";
import Post from "./Post";
import { UserProfileInfosValue } from "@/lib/services/posts";
import { useUserStore } from "@/lib/store/userStore";
import EmptyPostsViste from "../EmptyCallbacks/EmpyPostsVisite";



type ProfilePostsValues = {
    userPosts: {
        id: string;
        media: {
            resourceType: ResourceTypes;
            url: string;
        };
        caption: string | null;
        comments: {
            id: string;
            content: string;
            userId: string;
            postId: string;
            created_at: Date;
            updated_at: Date;
        }[];
        likes: {
            id: string;
            userId: string;
            postId: string;
        }[];
    }[];
    username: string;
};



export default function ProfilePosts({userPosts,username}:ProfilePostsValues){
    const {cachedUserInfos} = useUserStore();
    const isMyProfile = username === cachedUserInfos.username;
    return(
        <div className="flex flex-col gap-2 p-2">
            <h2 className="text-grey1 text-[1.7rem]">Posts</h2>
            {userPosts.length === 0 ? (
                isMyProfile ? (
                    <EmptyPosts />
                ) : (
                    <EmptyPostsViste />
                )
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {userPosts.map((post) => (
                        <Post key={post.id} postInfos={post} />
                    ))}
                </div>
            )}
        </div>
    )
}