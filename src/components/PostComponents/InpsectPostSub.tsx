'use client'

import { Heart, MessageCircle } from "lucide-react";
import ProfileIcon from "../ProfileIcon";
import InspectingComment from "./InspectingComment";
import CommentForm from "./CommentForm";
import { userPost } from "../ProfileComponents/ProfilePosts";
import { getPostedTime } from "@/lib/utils";
import EmptyComments from "../EmptyCallbacks/EmptyComments";
import { Comment, Post, User } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";
import { LikeActions } from "@/lib/types";
import { togglePostLike } from "@/lib/services/posts";

interface InspectPostSubProps {
    caption: userPost['caption']
    postedTime: userPost['postedTime']
    likes: userPost['likes']
    currentUserId: User['id']
    comments: userPost['comments']
    posterInfos: {
        username: User['username'];
        avatar: User['image'];
    },
    postId: userPost['id']
    onClose: () => void,
}

export default function InspectPostSub({ caption, postedTime, comments, likes, posterInfos, onClose, postId,currentUserId }: InspectPostSubProps) {
    console.log(currentUserId)
    const [isLiked, setIsLiked] = useState<boolean>(likes.some(like => like.userId === currentUserId));
    const [totalLikes,setTotalLikes] = useState<number>(likes.length);
    const [loading,setLoading] = useState<boolean>(false);
    const [createdComments, setCreatedComments] = useState<userPost['comments']>(comments);
    

    const handleToggleLike = async (postId: Post['id'],action:LikeActions) => {
        if (loading) return;
        const previousIsLiked = isLiked;
        const previousTotalLikes = totalLikes;
        try {
          setLoading(true);
          setIsLiked(!previousIsLiked);
          setTotalLikes(prev => prev + (action === 'like' ? +1 : -1 ));
          const result = await togglePostLike(postId,action);
          if(!result.success){
            setTotalLikes(previousTotalLikes);
            setIsLiked(previousIsLiked);
            toast.error(action === 'like' ? 'Failed to like post' : 'Failed to unlike post');
            return;
          }
        }
        catch (error) {
            toast.error('Somthing went wrong, please try again.');
            setTotalLikes(previousTotalLikes);
            setIsLiked(previousIsLiked);
        }
        finally{
          setLoading(false);
        }
    }

    return (
        <div className="flex h-full min-h-0 flex-col overflow-hidden bg-primary8">
            <div className="shrink-0 border-b border-primary5 p-4">
                <div className="flex items-center gap-3">
                    <ProfileIcon username={posterInfos.username} avatar={posterInfos.avatar} onClose={() => onClose()} />
                    <span className="shrink-0 text-xs text-grey2">
                        {getPostedTime(postedTime)}
                    </span>
                </div>

               {caption && <p className="mt-3 break-words rounded-xl bg-primary7 px-3 py-2.5 text-sm leading-6 text-grey1">
                    {caption}
                </p>}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
                <div className="flex flex-col gap-5">
                    {createdComments.length === 0 ? <EmptyComments /> :
                        createdComments.map(createdComment => {
                            return (
                                <InspectingComment
                                    commentInfos={createdComment}
                                    onClose={() => onClose()}
                                    key={createdComment.id}
                                    onDeleteComment={(commentId: Comment["id"]) =>
                                        setCreatedComments((prev) =>
                                            prev.filter((comment) => comment.id !== commentId)
                                        )
                                    }
                                />
                            )
                        })}
                </div>
            </div>

            <div className="shrink-0 border-t border-primary5 bg-primary8 p-3 sm:p-4">
                <div className="mb-3 flex items-center gap-5">
                    <button
                        disabled={loading}
                        type="button"
                        aria-label={isLiked ? "Unlike post" : "Like post"}
                        className="flex cursor-pointer items-center gap-2 text-grey1 transition-colors hover:text-red-500"
                        onClick={()=>handleToggleLike(postId,isLiked ? 'unlike' : 'like')}
                    >
                        <Heart className={`h-5 w-5 cursor-pointer transition-all duration-200 hover:scale-125 sm:h-6 sm:w-6 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                        <span className="text-sm font-medium">{totalLikes} likes</span>
                    </button>

                    <button
                        type="button"
                        aria-label="View comments"
                        className="flex items-center gap-2 text-grey1 transition-color"
                    >
                        <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                        <span className="text-sm font-medium">{createdComments.length} comments</span>
                    </button>
                </div>

                <CommentForm onCommentCreated={(newComment) => {
                    setCreatedComments(prev => [...prev, newComment])
                }} postId={postId} />
            </div>
        </div>
    );
}