'use server'

import { Post, User } from "@prisma/client";
import { verifyUserSession } from "./verifications";
import { prisma } from "../prisma";
import { PostFormValues } from "@/components/PostComponents/PostForm";
import { postSchema } from "@/schemas/userSchema";
import { clearUserCachedInfos } from "./user";





export async function getUserProfileInfos(username:User['username']){
    try{
        const session = await verifyUserSession();
        const currentUserId = session.user.id;
        const targetUserInfos = await prisma.user.findUnique({
            where:{
                username
            },
            select:{
                id:true,
                username:true,
                name:true,
                friendsIds:true,
                image:true,
                bio:true,
                posts:{
                    select:{
                        id:true,
                        likes:true,
                        user:true,
                        comments:{
                            select:{
                                user:true,
                                id:true,
                                content:true,
                                created_at:true,
                                postId:true
                            }
                        },
                        caption:true,
                        createdAt:true,
                        media:{
                            select:{
                                resourceType:true,
                                url:true
                            }
                        },
                    }
                }
            }
        })
        if(!targetUserInfos){
            throw new Error('Invalid posts request!')
        }
        const currentRequest = await prisma.requests.findFirst({
            where:{
                senderId: currentUserId,
                receiverId: targetUserInfos.id
            },
            select:{
                status:true
            }
        })
        const profileLabel = targetUserInfos.id === currentUserId ? 'Edit Profile' : targetUserInfos.friendsIds.includes(currentUserId) ? 'Remove Friend' : currentRequest?.status === 'pending' ? 'Pending' : 'Add Friend';
        const formattedTargetUserInfos = {
            ...targetUserInfos,
            profileLabel,
            posts: targetUserInfos.posts.map(post => ({
                ...post,
                postedTime: post.createdAt ? new Date(post.createdAt) : undefined,
                comments: post.comments.map(comment => ({
                    ...comment,
                    commentedTime: comment.created_at ? new Date(comment.created_at) : undefined
                }))
            })),
        }
        return {
            success:true,
            userProfileInfos: formattedTargetUserInfos
        }
    }
    catch(error){
        console.log('Failed to get user posts: ',error);
        return{
            success:false,
            error:'Something went wrong, please try again.'
        }
    }
}
export type UserProfileInfosValue = NonNullable<
    Awaited<ReturnType<typeof getUserProfileInfos>>["userProfileInfos"]
>;






export async function createPost(values:PostFormValues){
    try{
        const session = await verifyUserSession();
        const userId = session.user.id;
        const validation = postSchema.safeParse(values);
        if (!validation.success){
            throw new Error('Invalid form data')
        }
        const caption = validation.data.postCaption;
        const media = validation.data.media;
        await prisma.post.create({
            data:{
                userId,
                caption,
                media
            }
        })
        try{
            const result = await clearUserCachedInfos(userId,'/profile');
            if (!result.success){
                throw new Error('Failed to invalidate user cache infos')
            }
        }
        catch(error){
            throw new Error('Something went wrong,please try again')
        }
        return{
            success:true,
            message:'Post has been created successfully!'
        }
    }
    catch(error){
        console.log('Failed to create this post: ',error)
        return{
            success:false,
            error:'Something went wrong, please try again.'
        }
    }
}




export async function deletePost(postId:Post['id']){
    try{
        const session = await verifyUserSession();
        const userId = session.user.id;
        if (!postId){
            throw new Error('Invalid request');
        }
        const existingPost = await prisma.post.findUnique({
            where:{
                id:postId,
            }
        })
        if (!existingPost){
            throw new Error('Post does not exists');
        }
        if (existingPost.userId !== userId){
            throw new Error("You are not allowed to delete this post")
        }
        await prisma.post.delete({
            where:{
                id:postId
            }
        });
        try{
            const result = await clearUserCachedInfos(userId,'/profile');
            if (!result.success){
                throw new Error('Failed to invalidate user cache')
            }
        }
        catch(error){
            throw new Error('Something went wrong, please try again.');
        }
        return{
            success:true,
            message:'Post has been deleted successfully!'
        }
    }
    catch(error){
        console.log('Failed to delete this post: ',error);
        return{
            success:false,
            error:'Something went wrong, please try again'
        }
    }
}