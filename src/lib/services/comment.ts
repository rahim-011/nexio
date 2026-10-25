'use server'

import { Comment, Post } from "@prisma/client";
import { verifyUserSession } from "./verifications";
import { prisma } from "../prisma";
import { CommentFormValue } from "@/components/PostComponents/CommentForm";
import { commentSchema } from "@/schemas/userSchema";







export async function deleteComment(commentId:Comment['id']){
    try{
        if (!commentId){
            throw new Error('Comment id is required!')
        }
        const session = await verifyUserSession();
        const userId = session.user.id;
        const existingComment = await prisma.comment.findUnique({
            where:{
                id: commentId
            }
        })
        if (!existingComment){
            throw new Error('Comment does not exist!');
        }
        if (existingComment.userId !== userId){
            throw new Error("You are not allowed to delete this comment")
        }
        await prisma.comment.delete({
            where:{
                id:commentId
            }
        });
        return{
            success:true,
            message:'Comment has been deleted successfully.'
        }
    }
    catch(error){
        console.log('Failed to delete comment: ',error);
        return{
            success:false,
            error:'Something went wrong, please try again.'
        }
    }
}


export async function createComment(postId:Post['id'],values:CommentFormValue){
    try{
        const session = await verifyUserSession();
        const userId = session.user.id;
        if (!postId){
            throw new Error('Post id is required')
        }
        const validation = commentSchema.safeParse(values);
        if(!validation.success){
            throw new Error('Invalid form data!')
        }
        const {postComment} = validation.data;
        const createdComment = await prisma.comment.create({
            data:{
                content: postComment,
                userId:userId,
                postId:postId
            },
            select:{
                id:true,
                content:true,
                user:true,
                postId:true,
                created_at:true,
            }
        })
        const formattedComment = {
            ...createdComment,
            commentedTime: createdComment.created_at
        }
        return{
            success:true,
            message:'Comment has been created successfully.',
            newComment:formattedComment
        }
    }
    catch(error){
        console.log('Failed to create comment: ',error);
        return{
            success:false,
            error:'Somthing went wrong,please try again.'
        }
    }
}
