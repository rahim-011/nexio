"use client";

import { Ellipsis, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ProfileIcon from "../ProfileIcon";
import { userPost } from "../ProfileComponents/ProfilePosts";
import { getPostedTime } from "@/lib/utils";
import DeleteModel from "../DeleteModel";


interface InspectingCommentProps{
    commentInfos: userPost['comments'][number]
    onClose: () => void,
}

export default function InspectingComment({commentInfos,onClose}:InspectingCommentProps) {


    // all u left here is to call the removeComment function by passing the comment id to it !!!
    

    return (
        <div className="flex items-start justify-between gap-3 border-b border-primary5/40 p-4">
            <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-center gap-3">
                    <ProfileIcon username={commentInfos.user.username} avatar={commentInfos.user.image} onClose={()=>onClose()}/>
                    <span className="shrink-0 text-xs text-grey2">{getPostedTime(commentInfos.commentedTime)}</span>
                </div>

                <p className="break-words px-1 text-sm leading-5 text-grey1">
                    {commentInfos.content}
                </p>
            </div>

            <div className="relative shrink-0">
                <DeleteModel ariaLabel="comment options"/>
            </div>
        </div>
    );
}