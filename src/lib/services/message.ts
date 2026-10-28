'use server'

import { Chat, Message, User } from "@prisma/client";
import { prisma } from "../prisma";
import { verifyUserSession } from "./verifications";
import { getCurrentUser } from "./user";








export async function isParticipant(userId:User['id'],participants:Chat['participants']){
    return participants.includes(userId)
}






export async function getAllMessagesInboxes(){
    try{
        const session = await verifyUserSession();
        const userId = session.user.id;
        const messagesInboxes = await prisma.chat.findMany({
            where:{
                participants:{
                    has: userId
                }
            },
            select:{
                participants:true,
                id:true,
                createdAt:true,
                messages:{
                    orderBy: {createdAt:'desc'},
                    take: 1,
                }
            }
        })
        return{
            success:true,
            message:'The message inboxes are feteched successfully.',
            messagesInboxes
        }

    }
    catch(error){
        console.log('Failed to get the messages inboxes:' ,error);
        return{
            success:false,
            error:'Somthing went wrong, please try again.'
        }
    }
}

export type messageInboxesValue = NonNullable<Awaited<
    ReturnType<typeof getAllMessagesInboxes>
>['messagesInboxes']>[number]





export async function createChatInbox(receiverId:User['id'],senderId:User['id']){
    try{
        const session = await verifyUserSession();
        const userId = session.user.id;
        if (userId !== senderId){
            throw new Error('Invalid request')
        }
        const currentUser = await getCurrentUser(userId);
        if (!currentUser){
            throw new Error('User not found!')
        }
        const isFriend = currentUser.friendsIds.includes(receiverId);
        if (!isFriend){
            throw new Error('Add him to your friend list first')
        }
        const existingChat = await prisma.chat.findFirst({
            where:{
                participants:{
                    hasEvery:[receiverId,userId]
                }
            }
        })
        if (existingChat){
            return{
                success:true,
                existingChat // returning the existing chat 
            }
        }
        const newChat = await prisma.chat.create({
            data:{
                participants:[receiverId,userId]
            }
        })
        return{
            success:true,
            newChat
        }
    }
    catch(error){
        console.log('Failed to create new chat: ',error);
        return{
            success:false,
            error:'Somthing went wrong, please try again.'
        }
    }
}








export async function removeMessageInbox(chatId:Chat['id']){
    try{
        const session = await verifyUserSession();
        const userId = session.user.id;
        const existedChat = await prisma.chat.findUnique({
            where:{
                id: chatId
            }
        })
        if (!existedChat){
            throw new Error('This chat does not exist!')
        }
        const hasPermission = isParticipant(userId,existedChat.participants);
        if (!hasPermission){
            throw new Error('Invalid request!')
        }
        await prisma.chat.delete({
            where:{
                id:chatId
            }
        })
        return{
            success:true,
            message:'Chat has been deleted successfully.'
        }
    }
    catch(error){
        console.log('Failed to delete this chat inbox: ',error)
        return{
            success:false,
            error:'Somthing went wrong, please try again.'
        }
    }
}


export async function deleteMessage(messageId:Message['id']){
    try{
        const session = await verifyUserSession();
        const userId = session.user.id;
        const existedMessage = await prisma.message.findUnique({
            where:{
                id:messageId
            },
        })
        if (!existedMessage){
            throw new Error('Message does not exist.')
        }
        const hasPermission = userId === existedMessage.senderId;
        if (!hasPermission){
            throw new Error('Invalid request!')
        }
        await prisma.message.delete({
            where:{
                id:messageId
            }
        })
        return{
            success:true,
            message:'Message has been deleted successfully!'
        }
    }
    catch(error){
        console.log('Failed to delete the this message: ',error);
        return{
            success:false,
            error:'Somthing went wrong, please try again.'
        }
    }
}


