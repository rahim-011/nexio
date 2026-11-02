'use server'

import { User } from "@prisma/client";
import { prisma } from "../prisma";
import { verifyUserSession } from "./verifications";
import { getCurrentUser } from "./user";
import { clearUserCachedInfos } from "./user";
import { searchLimiter } from "../rate-limit";



interface FiltersValues{
    search: User['username']
}

export async function getFriends(filter:FiltersValues['search']){
    try{
        const session = await verifyUserSession();
        const {success} = await searchLimiter.limit(session.user.id);
        if (!success){
            return{
                success:false,
                error:'Too many search requests, please try again.'
            }
        }
        const userId = session.user.id;
        const currentUser = await getCurrentUser(userId);
        if (!filter.trim()){
            return{
                success:true,
                filtredFriends:[]
            }
        }
        const [filtredFriends,pendingRequests] = await Promise.all([
            prisma.user.findMany({
                where:{
                    username:{
                        contains:filter,
                        not: currentUser?.username
                    }
                },
                select:{
                    id:true,
                    username:true,
                    image:true,
                    friendsIds:true,
                    bio:true,
                    name:true,
                    _count:{
                        select:{
                            posts:true
                        }
                    }
                }
            }),
            prisma.requests.findMany({
                where:{
                    status:'pending',
                    OR:[
                        {senderId:currentUser?.id},
                        {receiverId:currentUser?.id}
                    ]
                }
            })

        ]) 
        const formattedFiltredFriends = filtredFriends.map(friend => ({
            id: friend.id,
            avatar: friend.image,
            username: friend.username,
            name: friend.username,
            bio: friend.bio,
            totalPosts: friend._count.posts,
            totalFriends: friend.friendsIds.length
        }))
        const formattedFiltredFriendsWithStatus = formattedFiltredFriends.map(user =>{
            const request = pendingRequests.find(request => (
                (request.senderId === user.id  && request.receiverId === currentUser?.id
                    ||
                request.receiverId === user.id && request.senderId === currentUser?.id
                )
            ));
            
            const isFriend = currentUser?.friendsIds.includes(user.id);
            return{
                ...user,
                requestId: request?.id,
                requestStatus: isFriend ? 'Friends' :  !request ?
                    null : request.senderId === currentUser?.id ? 'pending' : 'accept'
            }
        })
        return{
            success:true,
            filtredFriends:formattedFiltredFriendsWithStatus
        }
    }
    catch(error){
        console.log('Failed to get the friends: ',error);
        return{
            success:false,
            error:'Something went wrong, plaese try again.'
        }
    }
}

export type FilteredFriendsValues =
    NonNullable<Awaited<ReturnType<typeof getFriends>>['filtredFriends']>[number];




export async function getProfileFriends(friendsIds:User['friendsIds']){
    try{
        await verifyUserSession();
        if (!friendsIds){
            throw new Error('FriendsIds must be provided!');
        }
        const listedFriends = await prisma.user.findMany({
                where:{
                    id:{
                        in: friendsIds
                    }
                },
                select:{
                    name:true,
                    username:true,
                    image:true,
                    id:true,
                }
            })
        
        return{
            success:true,
            listedFriends
        }
    }
    catch(error){
        console.log('Failed to get profile friends: ',error);
        return{
            success:false,
            error:'Somthing went wrong, please try again.'
        }
    }
}

export type ListedFriendsValue = 
  NonNullable<Awaited<ReturnType<typeof getProfileFriends>>['listedFriends']>[number];










export async function removeFriend(friendId:User['id']){
    try{
        const session = await verifyUserSession();
        const userId = session.user.id;
        if (!friendId){
            throw new Error('Friend id is required!');
        }
        if (userId === friendId){
            throw new Error('Invalid request!')
        }
        const [targetFriend,currentUser] = await Promise.all([
            prisma.user.findUnique({
                where:{
                    id:friendId
                },
                select:{
                    id:true,
                    friendsIds:true
                }
            }),
            prisma.user.findUnique({
                where:{
                    id:userId
                },
                select:{
                    id:true,
                    friendsIds:true
                }
            })
        ])
        if (!targetFriend || !currentUser){
            throw new Error('Missing user!')
        }
        const areFriends = targetFriend.friendsIds.includes(userId) && currentUser.friendsIds.includes(friendId);
        if (!areFriends){
            throw new Error('Invalid request')
        }
        await prisma.$transaction(async (tx) =>{
            await tx.user.update({
                where:{
                    id:userId
                },
                data:{
                    friendsIds:{
                        set: currentUser.friendsIds.filter(id => id != friendId)
                    }
                }
            })
            await tx .user.update({
                where:{
                    id:friendId
                },
                data:{
                    friendsIds:{
                        set: targetFriend.friendsIds.filter(id => id != userId)
                    }
                }
            })
        })
        const [senderCleanedCache,receiverCleanedCache] = await Promise.all([
            clearUserCachedInfos(friendId,'/profile'),
            clearUserCachedInfos(userId,'/profile')
        ])
        if (!senderCleanedCache.success || !receiverCleanedCache.success){
            console.error("Failed to clear user cache after removing friend");
        }
        return{
            success:true,
            message:'Friend has been removed successfully!'
        }
    }
    catch(error){
        console.log('Failed to remove friend: ',error);
        return{
            success:false,
            error:'Somthing went wrong, please try again!'
        }
    }
}












