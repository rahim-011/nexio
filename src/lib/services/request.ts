'use server'

import { Prisma, Requests, User } from "@prisma/client";
import { prisma } from "../prisma";
import { clearUserCachedInfos, getCurrentUser } from "./user";
import { verifyUserSession } from "./verifications";
import { manageFriendsActions } from "../types";







export async function getCurrentRequest(requestId:Requests['id']){
    if (!requestId){
        return null
    }
    const currentRequest = await prisma.requests.findUnique({
        where:{
            id:requestId
        }
    })
    if (!currentRequest){
        throw new Error('Request does not exist')
    }
    return currentRequest
}


export async function isFriend(tx:Prisma.TransactionClient,senderId:Requests['id'],receiverId:Requests['id']){
    try{
        const isFriend = await tx.user.findFirst({
            where:{
                id:senderId,
                friendsIds:{
                    has:receiverId
                }
            }
        })
        if (isFriend){
            return true
        }
        return false
    }   
    catch(error){
        console.log('Failed to verify the friend state!');
        return{
            success:false,
            error:'Something went wrong,please try again'
        }
    }
}





export async function getUserReceivedRequests(){
    try{
        const session = await verifyUserSession();
        const userId = session.user.id;
        const userReceivedRequests = await prisma.requests.findMany({
            where:{
                receiverId:userId,
                status: 'pending'
            },
            select:{
                sender:{
                    select:{
                        id:true,
                        image:true,
                        username:true
                    }
                },
                id:true
            }
        })
        const formattedReceivedRequests = userReceivedRequests.map(request =>({
            id: request.sender.id,
            requestId: request.id,
            avatar: request.sender.image,
            username: request.sender.username
        }))
        return{
            userReceivedRequests: formattedReceivedRequests,
            success:true
        }
    }
    catch(error){
        console.log('Failed to get user requests: ',error);
        return{
            success:false,
            error:'Something went wrong, please try again.'
        }
    }
}


export type ReceivedRequestsValues = {
    id: string
    username: string
    requestId: string
    avatar: string | null
}



export async function sendFriendRequest(receiverId:User['id']){
    try{
        const session = await verifyUserSession();
        const senderId = session.user.id;
        const receiver = await getCurrentUser(receiverId);
        if (!receiver){
            throw new Error('Receiver does not exist.')
        }
        if (receiverId === senderId){
            throw new Error('You cannot send a friend request to yourself.')
        }
        const [friendState,isRequestExists] = await Promise.all([
            prisma.user.findFirst({
                where:{
                    OR:[
                        {
                            id: senderId,
                            friendsIds:{
                                has: receiverId
                            }
                        },
                        {
                            id:receiverId,
                            friendsIds:{
                                has: senderId
                            }
                        }
                    ]
                },
            }),
            prisma.requests.findFirst({
                where:{
                    OR:[
                        {
                            senderId: senderId,
                            receiverId: receiverId,
                            status: 'pending'
                        },
                        {
                            receiverId:senderId,
                            senderId: receiverId,
                            status: 'pending'
                        }
                    ]
                }
            })

        ])
        if (friendState){
            throw new Error('This user is already on your friend list');
        }
        if (isRequestExists){
            throw new Error('This request already exists');
        }
        await prisma.requests.create({
            data:{
                senderId:senderId,
                receiverId: receiverId,
                status: 'pending'

            }
        })
        return {
            success:true,
            message: 'Friend request sent successfully!'
        }
    }
    catch(error){
        console.log('Failed to send the friend request: ',error);
        return{
            success:false,
            error:'Something went wrong, please try again.'
        }
    }
}



export async function manageFriendRequest(action:manageFriendsActions,requestId:Requests['id']){
    try{
        const session = await verifyUserSession();
        const userId = session.user.id;
        if (!requestId){
            return{
                success:false,
                error:'Request id is required'
            }
        }
        const actions = ['accept','decline']
        if (!actions.includes(action)){
            return{
                success:false,
                error:'Invalid action!'
            }
        }
        if (action === 'accept'){
            const {senderId,receiverId} = await prisma.$transaction(async (tx) =>{
                const currentRequest = await tx.requests.findUnique({
                    where:{
                        id:requestId
                    }
                });
                if (!currentRequest || currentRequest.receiverId !== userId || currentRequest.status !== 'pending' ){
                    throw new Error('Invalid request')
                }
                const {senderId,receiverId} = currentRequest;
                const friendState = await isFriend(tx,senderId,receiverId);
                if (friendState){
                    throw new Error('This user is already on your friend list')
                }
                await tx.requests.delete({
                    where:{
                        id:requestId
                    },
                })
                await tx.user.update({
                    where:{
                        id:receiverId
                    },
                    data:{
                        friendsIds:{
                            push: senderId
                        }
                    }
                })
                await tx.user.update({
                    where:{
                        id:senderId
                    },
                    data:{
                        friendsIds:{
                            push: receiverId
                        }
                    }
                })
                return {senderId,receiverId}
            })
            const [senderCleanedCache,receiverCleanedCache] = await Promise.all([
                clearUserCachedInfos(senderId,'/profile'),
                clearUserCachedInfos(receiverId,'/profile')
            ])
            if (!senderCleanedCache.success || !receiverCleanedCache.success){
                console.log('Failed to invalidate the sender and receiver cache!')
            }
            return{
                success:true,
                message: 'Friend request accepted successfully!'
            }
        }else{
            if (action === 'decline'){
                const currentRequest = await prisma.requests.deleteMany({
                    where:{
                        id:requestId,
                        status:'pending',
                        receiverId: userId
                    }
                })
                if (currentRequest.count !== 1){
                    throw new Error('Invalid request!')
                }
                
                return{
                    success:true,
                    message: 'Friend request declined successfully'
                }
            }
        }
    }
    catch(error){
        console.log('Failed to manage the friend request: ',error)
        return{
            success:false,
            error:'Something went wrong, please try again.'
        }
    }
}



export async function cancelFriendRequest(receiverId:User['id']){
    try{
        const session = await verifyUserSession();
        const senderId = session.user.id;
        const currentRequest = await prisma.requests.findFirst({
            where:{
                receiverId:receiverId,
                senderId:senderId
            }
        });
        if (!currentRequest){
            throw new Error('Request does not exists!')
        }
        if (currentRequest.status !== 'pending'){
            throw new Error('Request is not in pending status u cant cancel it!')
        }
        await prisma.requests.delete({
            where:{
                id: currentRequest.id
            }
        })
        return{
            success:true,
            message:'Friend request has been cancelled successfully!'
        }
    }
    catch(error){
        console.log('Failed to cancel the sended request: ',error)
        return{
            success:false,
            error:'Something went wrong,please try again.'
        }
    }
}










