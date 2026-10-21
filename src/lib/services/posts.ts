'use server'

import { User } from "@prisma/client";
import { verifyUserSession } from "./verifications";
import { prisma } from "../prisma";
import { PostFormValues } from "@/components/PostComponents/PostForm";
import { postSchema } from "@/schemas/userSchema";
import { clearUserCachedInfos } from "./user";





export async function getUserPosts(username:User['username']){
    try{
        await verifyUserSession();
        const targetUser = await prisma.user.findUnique({
            where:{
                username
            },
            select:{
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
                        user:{
                            select:{
                                username:true,
                                image:true,
                                name:true,
                            }
                        }
                    }
                }
            }
        })
        if(!targetUser){
            throw new Error('Invalid posts request!')
        }
        const formattedPostsData = targetUser.posts.map(post =>({
            ...post,
            mediaUrl: post.media.url,
            mediaType:  post.media.resourceType,
            username: post.user.username,
            name: post.user.name,
            avatar: post.user.image
        }))
        return {
            success:true,
            userPosts: formattedPostsData
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
export type UserPosts = NonNullable<
    Awaited<ReturnType<typeof getUserPosts>>["userPosts"]
>[number];






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