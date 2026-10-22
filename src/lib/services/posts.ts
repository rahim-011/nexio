'use server'

import { User } from "@prisma/client";
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
                        comments:true,
                        caption:true,
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
        const profileLabel = targetUserInfos.id === currentUserId ? 'Edit Profile' : targetUserInfos.friendsIds.includes(currentUserId) ? 'Remove Friend' : 'Add Friend';
        const formattedTargetUserInfos = {
            ...targetUserInfos,
            profileLabel,
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