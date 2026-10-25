
import { Heart, MessageCircle } from "lucide-react";
import ProfileIcon from "../ProfileIcon";
import InspectingComment from "./InspectingComment";
import CommentForm from "./CommentForm";
import { userPost } from "../ProfileComponents/ProfilePosts";
import { getPostedTime } from "@/lib/utils";
import EmptyComments from "../EmptyCallbacks/EmptyComments";
import { Comment, User } from "@prisma/client";
import { useState } from "react";

interface InspectPostSubProps{
    caption: userPost['caption']
    postedTime: userPost['postedTime']
    totalLikes: number
    comments: userPost['comments']
    posterInfos:{
        username: User['username'];
        avatar: User['image']
    },
    postId: userPost['id']
    onClose: () => void, 
}

export default function InspectPostSub({caption,postedTime,comments,totalLikes,posterInfos,onClose,postId}:InspectPostSubProps) {
  const [createdComments,setCreatedComments] = useState<userPost['comments']>(comments);
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-primary8">
      <div className="shrink-0 border-b border-primary5 p-4">
        <div className="flex items-center gap-3">
          <ProfileIcon username={posterInfos.username} avatar={posterInfos.avatar} onClose={()=>onClose()}/>
            <span className="shrink-0 text-xs text-grey2">
                {getPostedTime(postedTime)}
            </span>
        </div>

        <p className="mt-3 break-words rounded-xl bg-primary7 px-3 py-2.5 text-sm leading-6 text-grey1">
          {caption}
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
        <div className="flex flex-col gap-5">
          {createdComments.length === 0 ? <EmptyComments/> :
          createdComments.map(createdComment => {
            return(
                <InspectingComment commentInfos={createdComment} onClose={()=>onClose()} key={createdComment.id} onDeleteComment={(commentId: Comment["id"]) =>
                  setCreatedComments((prev) =>
                    prev.filter((comment) => comment.id !== commentId)
                  )
                }/>
            )
          })}
        </div>
      </div>
      <div className="shrink-0 border-t border-primary5 bg-primary8 p-3 sm:p-4">
        <div className="mb-3 flex items-center gap-5">
          <button
            type="button"
            aria-label="Like post"
            className="flex items-center gap-2 text-grey1 transition-colors hover:text-red-500"
          >
            <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-sm font-medium">{totalLikes} likes</span>
          </button>

          <button
            type="button"
            aria-label="View comments"
            className="flex items-center gap-2 text-grey1 transition-colors hover:text-primary2"
          >
            <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-sm font-medium">{createdComments.length} comments</span>
          </button>
        </div>

        <CommentForm onCommentCreated={(newComment) =>{
          setCreatedComments(prev => [...prev,newComment])
        }} postId={postId}/>
      </div>
    </div>
  );
}