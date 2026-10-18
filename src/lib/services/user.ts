'use server'

import { cache } from "react";
import { redis } from "../redis";
import { userInfos } from "../types";
import { BioValue } from "@/components/SettingsComponents/EditBio";
import { bioSchema, editEmailSchema, editProfileSchema, pfpSchema } from "@/schemas/userSchema";
import { prisma } from "../prisma";
import { verifyUserSession } from "../services/verifications";
import { revalidatePath } from "next/cache";
import { EditProfileFormValues } from "@/components/SettingsComponents/EditProfileForm";
import { PfpValue } from "@/components/ProfileComponents/ChangePfp";
import { EditEmailValue } from "@/components/SettingsComponents/EditEmailForm";




export const getUserCachedData = cache(async() =>{
    try{
        const session = await verifyUserSession();
        const userId = session.user.id;
        const cacheKey = `nexio:user:${userId}`;
        const cachedUserData = await redis.get<userInfos>(cacheKey);
        if (cachedUserData){
            return cachedUserData
        }

        const [userData,totalPosts] = await Promise.all([
            prisma.user.findUnique({
                where:{
                    id:userId
                },
                select:{
                    name:true,
                    username:true,
                    image:true,
                    bio:true,
                    friendsIds:true,
                    email:true
                },
            }),
            prisma.post.count({
                where:{
                    userId
                }
            })
        ])
        
        if (!userData){
            return null
        }
        const {name,username,image,bio,friendsIds,email} = userData; 
        const totalFriends = friendsIds.length ?? 0;
        const data = {
            name,
            username,
            avatar:image,
            bio,
            totalFriends,
            totalPosts,
            email
        }
        await redis.set(cacheKey,data,{ex: 600});
        return data
    }
    catch(error){
        console.log('Failed to fetch user data: ',error)
        throw error
    }
})



export const getCurrentUser = async(userId:string) =>{
    if (!userId){
        return null
    }
    const currentUser = await prisma.user.findUnique({
        where:{
            id:userId
        }
    });
    if (!currentUser){
        throw Error('User not found!')
    }
    return currentUser
}

export const clearUserCachedInfos = async (userId:string,revalidatedPath:string)=>{
    try{
        if (!userId){
            return {
                success:false,
                error:'userId is required!'
            }
        }
        await redis.del(`nexio:user:${userId}`);
        revalidatePath(revalidatedPath);
        return{
            success:true
        }
    }
    catch(error){
        console.log('Failed to invalidate user cache data: ',error);
        return{
            success:false,
        }
    }
}



export const changeUserBio = async(value:BioValue) => {
    try{
        const session = await verifyUserSession();
        const userId = session.user.id;
        const validation = bioSchema.safeParse(value);
        if (!validation.success){
            return {
                success:false,
                error:'Invalid form data'
            }
        }
        const {bio} = validation.data;
        const currentUser =  await getCurrentUser(userId);
        const currentBio = currentUser?.bio;
        if (currentBio === bio){
            return {
                success:false,
                error: "No changes were made."
            }
        }
        await prisma.user.update({
            where:{
                id:userId
            },
            data:{
                bio
            }
        })
        try{
            const result = await clearUserCachedInfos(userId,'/settings/edit-profile');
            if (!result.success){
                return {
                    success:false,
                    error: 'Something went wrong, please try again!'
                }
            }
        }
        catch(error){
            console.log('Failed to clear the user cache: ',error)
        }
        
        return{
            success:true,
            message:'Bio has been changed successfuly'
        }

    }
    catch(error){
        console.log('Failed to update the bio: ',error)
        return{
            success:false,
            error: "Something went wrong. Please try again."
        }
    }
}

export const changeUserProfile = async(values:EditProfileFormValues) =>{
    try{
        const session = await verifyUserSession();
        const userId = session.user.id;
        const validation = editProfileSchema.safeParse(values);
        if (!validation.success){
            return {
                success:false,
                error: 'Invalid form data!'
            }
        }
        const {name,username} = validation.data;
        const currentUser = await getCurrentUser(userId);
        const currentName = currentUser?.name;
        const currentUsername = currentUser?.username;

        if (currentName === name && currentUsername === username){
            return{
                success:false,
                error:"No changes were made."
            }
        }
        await prisma.user.update({
            where:{
                id:userId
            },
            data:{
                name,
                username
            }
        })
        try{
            const result = await clearUserCachedInfos(userId,'/settings/edit-profile');
            if (!result.success){
                return{
                    success:false,
                    error:'Something went wrong, please try again!'
                }
            }
        }
        catch(error){
            console.log('Failed to clear the user cache: ',error)
        }
        return{
            success:true,
            message:'Profile updated successfully.'
        }
    }
    catch(error){
        console.log('Failed to change the user profile: ',error);
        return{
            success:false,
            error:'Somthing went wrong, please try again'
        }
    }
}





export const changeAvatar = async (value:PfpValue)=>{
    try{
        const session = await verifyUserSession();
        const validation = pfpSchema.safeParse(value);
        if (!validation.success){
            return {
                success:false,
                error:'Invalid form data'
            }
        }
        const avatar = validation.data.profileImage;
        const userId = session.user.id;
        const currentUser = await getCurrentUser(userId);
        const currentAvatar = currentUser?.image;
        if (currentAvatar === avatar){
            return{
                success:false,
                error:'No changes were made.'
            }
        }
        await prisma.user.update({
            where:{
                id:userId
            },
            data:{
                image:avatar
            }
        })
        try {
            const result = await clearUserCachedInfos(userId, '/profile');

            if (!result.success) {
                console.error('Failed to clear user cache:', result.error);
            }
        } catch (error) {
            console.error('Failed to clear user cache:', error);
        }
        return{
            success:true,
            message:'User avatar has been updated successfully'
        }
    }
    catch(error){
        console.log('Failed to change user avatar: ',error)
        return{
            success:false,
            error:'Something went wrong, please try again'
        }
    }
}





export const changeUserEmail = async (value:EditEmailValue) =>{
    try{
        const session = await verifyUserSession();
        const userId = session.user.id;
        const validation = editEmailSchema.safeParse(value);
        if (!validation.success){
            return {
                success:false,
                error:'Invalid form data'
            }
        }
        const newEmail = validation.data.email;
        const currentUser = await getCurrentUser(userId);

        if (newEmail === currentUser?.email){
            return{
                success:false,
                error:'No changes were made.'
            }
        }
        await prisma.user.update({
            where:{
                id:userId
            },
            data:{
                email: newEmail
            }
        })
        try {
            const result = await clearUserCachedInfos(userId, '/settings/account-settings');

            if (!result.success) {
                console.error('Failed to clear user cache:', result.error);
            }
        } catch (error) {
            console.error('Failed to clear user cache:', error);
        }
        return{
            success:true,
            message:'Email has been changed successfully'
        }
    }
    catch(error){
        return{
            success:false,
            error:'Something went wrong, please try again.'
        }
    }
}