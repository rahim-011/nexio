'use client'

import type { ResourceTypes, User } from "@prisma/client";
import EmptyPosts from "../EmptyCallbacks/EmptyPosts";
import Post from "./Post";
import { useUserStore } from "@/lib/store/userStore";
import EmptyPostsViste from "../EmptyCallbacks/EmpyPostsVisite";
import { Fragment, useState } from "react";
import InspectPost from "../PostComponents/InspectPost";



export type userPost = {
        id: string;
        user:User;
        media: {
            resourceType: ResourceTypes;
            url: string;
        };
        postedTime: Date
        caption: string | null;
        comments: {
            id: string;
            content: string;
            user: User
            postId: string;
            commentedTime: Date;
        }[];
        likes: {
            id: string;
            userId: string;
            postId: string;
        }[];
    };
;

type ProfilePostsValues = {
    userPosts: userPost[]
    username: string;
};



export default function ProfilePosts({userPosts,username}:ProfilePostsValues){
    const [isOpen,setIsOpen] = useState<boolean>(false);
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
                    {userPosts.map(post => {
                        return(
                            <Fragment key={post.id}>
                                <Post postInfos={post} onOpen={()=>setIsOpen(true)}/>
                                {isOpen && <InspectPost onClose={()=>setIsOpen(false)} postInfos={post}/>}
                            </Fragment>
                        )
                    })}
                </div>
            )}
        </div>
    )
}