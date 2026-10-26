"use client";

import { Ellipsis, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ProfileIcon from "../ProfileIcon";
import { userPost } from "../ProfileComponents/ProfilePosts";
import { getPostedTime } from "@/lib/utils";
import DeleteModel from "../DeleteModel";
import { toast } from "sonner";
import { Comment } from "@prisma/client";
import { deleteComment } from "@/lib/services/comment";


interface InspectingCommentProps{
    commentInfos: userPost['comments'][number]
    onClose: () => void,
    onDeleteComment: (commentId:Comment['id']) => void,
}

export default function InspectingComment({commentInfos,onClose,onDeleteComment}:InspectingCommentProps) {
    const [isRemoving,setIsRemoving] = useState<boolean>(false);
    const handleDeleteComment = async(commentId:Comment['id']) =>{
        try{
            setIsRemoving(true);
            const result = await deleteComment(commentId);
            if (!result.success){
                toast.error('Failed to delete comment. please try again');
                return;
            }
            toast.success('Comment deleted successfully.');
            onDeleteComment(commentInfos.id)
        }
        catch(error){
            toast.error('Somthing went wrong, please try again.')
        }
        finally{
            setIsRemoving(false);
        }
    }
    

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
                <DeleteModel ariaLabel="comment options" onConfirm={()=>handleDeleteComment(commentInfos.id)} loading={isRemoving} ownerUsername={commentInfos.user.username}/>
            </div>
        </div>
    );
}