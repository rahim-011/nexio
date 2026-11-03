'use server'

import { Chat, Message, User } from "@prisma/client";
import { prisma } from "../prisma";
import { verifyUserSession } from "./verifications";
import { getCurrentUser } from "./user";
import { MessageFormValue } from "@/components/MessagesComponents/MessageSubFooter";
import { messageSchema } from "@/schemas/chatSchema";
import { messageLimiter } from "../rate-limit";








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
                    select:{
                        content:true,
                        id:true,
                        chatId:true,
                        createdAt:true,
                        readAt:true,
                        sender:{
                            select:{
                                username:true,
                                id:true,
                                image:true
                            }
                        },
                        reactions:true
                    },
                    
                },
            }
        })
        const formattedInboxes = await Promise.all(
        messagesInboxes.map(async (item) => {
        const receiverId = item.participants.find(id => id !== userId);

            if (!receiverId) return null;

            const receiver = await getCurrentUser(receiverId);

            return {
                ...item,
                isUnread: item.messages.length > 0 && userId !== item.messages[0].sender.id &&
                item.messages[0].readAt === null,
                receiver: receiver
                    ? {
                        id: receiver.id,
                        name: receiver.name,
                        username: receiver.username,
                        image: receiver.image,
                    }
                    : null,
            };
        })
    );

    const validInboxes = formattedInboxes.filter(item => item !== null);
        return{
            success:true,
            message:'The message inboxes are feteched successfully.',
            messagesInboxes:validInboxes
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





export async function createChatInbox(receiverId:User['id']){
    try{
        const session = await verifyUserSession();
        const userId = session.user.id;
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
                chat:existingChat // returning the existing chat 
            }
        }
        const newChat = await prisma.chat.create({
            data:{
                participants:[receiverId,userId]
            }
        })
        return{
            success:true,
            chat:newChat
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

export async  function isOnline(userId:User['id']){
    try{
        const response = await fetch(`${process.env.SOCKET_SERVER_URL}/users/${userId}/status`,
            {cache:'no-store',
                headers:{
                    "x-internal-secret": process.env.INTERNAL_API_SECRET!
                }
            },
        );
        if (!response.ok){
            throw new Error('Failed to get user status')
        }
        const {isOnline} = await response.json();
        return isOnline
    }
    catch(error){
        console.log("Failed to get user status",error);
        return{
            success:false,
            error:'Somthing went wrong ,please try again'
        }
    }
}

export const getReceiverChatInfos = async(chatId:Chat['id']) =>{
    try{
        const session = await verifyUserSession();
        const userId = session.user.id;
        const existingChat = await prisma.chat.findUnique({
            where:{
                id:chatId
            }
        })
        if (!existingChat){
            throw new Error('Chat does not exist!')
        }
        const receiverId = existingChat.participants.find(id => id != userId);
        if (!receiverId){
            throw new Error('Receiver id does not exist!')
        }
        const receiver = await getCurrentUser(receiverId);
        if (!receiver){
            throw new Error('Receiver does not exist!')
        }
        const isReceiverOnline = await isOnline(receiverId);
        const receiverInfos = {
            ...receiver,
            currentUserId:userId,
            isOnline: isReceiverOnline
        }
        return{
            success:true,
            message:'User infos are fetched successfully!',
            receiverInfos
        }
    }
    catch(error){
        console.log('Failed to get receiver chat infos: ',error);
        return{
            success:false,
            error:'Somthing went wrong,please try again.'
        }
    }
}

export type receiverInfosValue = Awaited<
    ReturnType<typeof getReceiverChatInfos>
>['receiverInfos']





export async function createNewMessage(values:MessageFormValue){
    try{
        const session = await verifyUserSession();
        const userId = session.user.id;
        const {success} = await messageLimiter.limit(userId);
        if(!success){
            return{
                success:false,
                error:'Too many messages requests,please try again!'
            }
        }
        const validation = messageSchema.safeParse(values);
        if (!validation.success){
            throw new Error('Invalid form data!')
        }
        const {media,content,chatId} = validation.data;
        const existingChat = await prisma.chat.findUnique({
            where:{
                id: chatId,
            }
        })
        if (!existingChat){
            throw new Error('Invalid request');
        }
        const newMessage = await prisma.message.create({
            data:{
                content,
                images: media.map(mediaItem => ({
                    publicId: mediaItem.publicId,
                    resourceType: mediaItem.resourceType,
                    url: mediaItem.url
                })),
                chatId,
                senderId:userId,
            },
            include:{
                sender:{
                    select:{
                        username:true,
                        image:true
                    }
                },
                reactions:true
            }
        })
        const isMine = userId === newMessage.senderId;
        return{
            success:true as const,
            message:'Message has been created successfully!',
            newMessage: {...newMessage,isMine}
        }
    }
    catch(error){
        console.log("Failed to send message: ",error);
        return{
            success:false as const,
            error:'Somthing went wrong, please try again.'
        }
    }
}

export type newMessageValue = NonNullable<
    Extract<
        Awaited<ReturnType<typeof createNewMessage>>,
        { success: true }
    >["newMessage"]
>;



export async function updateChatInbox(chatId:Chat['id']){
    try{
        const session = await verifyUserSession();
        const userId = session.user.id;
        const existingChat = await prisma.chat.findUnique({
            where:{
                id:chatId,
                participants:{
                    has:userId
                }
            },
            select:{
                id:true
            }
        })
        if (!existingChat){
            throw new Error('Invalid request!')
        };
        const result = await prisma.message.updateMany({
            where:{
                chatId,
                OR:[
                    {readAt:null},
                    {readAt:{isSet:false}}
                ],
                senderId:{
                    not: userId
                }
            },
            data:{
                readAt: new Date()
            }
        })
        console.log("Updated messages:", result.count);
        return{
            success:true,
            message:'Chat inbox status has been updated successfully!'
        }
    }
    catch(error){
        console.log('Failed to update chat inbox: ',error);
        return{
            success:false,
            error:'Somthing went wrong, please try again.'
        }
    }
}



export async function getPreviousMessages(chatId:Chat['id'],cursor:Date){
    try{
        const session = await verifyUserSession();
        const userId = session.user.id;
        const existingChat = await prisma.chat.findUnique({
            where:{
                id:chatId
            }
        });
        if (!existingChat){
            throw new Error('Invalid request');
        }
        if (!existingChat.participants.includes(userId)){
            throw new Error('Access denied')
        }
        const limit = 20;
        const loadedMessages = await prisma.message.findMany({
            where:{
                chatId,
                createdAt:{
                    lt: cursor,
                },
            },
            orderBy:{
                createdAt: "desc"
            },
            take:limit,
            include:{
                sender:{
                    select:{
                        username:true,
                        image:true,
                    }
                },
                reactions:true
            }
        })
        const reversedMessages = loadedMessages.reverse();
        const formattedMessages = reversedMessages.map(message => ({
            ...message,
            isMine: message.senderId === userId,
            status: 'sent' as const
        }))
        return{
            success:true,
            loadedMessages: formattedMessages,
        }
    }
    catch(error){
        console.log('Failed to get chat messages: ',error);
        return{
            success:false,
            error:'Somthing went wrong,please try again'
        }
    }
}
export async function getLatestMessages(chatId:Chat['id']){
    try{
        const session = await verifyUserSession();
        const userId = session.user.id;
        const existingChat = await prisma.chat.findUnique({
            where:{
                id:chatId
            },
        });
        if (!existingChat){
            throw new Error('Invalid request');
        }
        if (!existingChat.participants.includes(userId)){
            throw new Error('Access denied')
        }
        const limit = 20;
        const latestMessages = await prisma.message.findMany({
            where:{
                chatId,
            },
            orderBy:{
                createdAt: "desc"
            },
            take: limit,
            include:{
                sender:{
                    select:{
                        username:true,
                        image:true
                    }
                },
                reactions:true
            }
        })
        const reveresedMessages = latestMessages.reverse();
        const formattedMessages = reveresedMessages.map(message => ({
            ...message,
            isMine: message.senderId === userId,
            status: 'sent' as const
        }))
        return{
            success:true,
            latestMessages: formattedMessages,
        }
    }
    catch(error){
        console.log('Failed to get chat messages: ',error);
        return{
            success:false,
            error:'Somthing went wrong,please try again'
        }
    }
}




export async function countUnreadMessages(){
    try{
        const session = await verifyUserSession();
        const userId = session.user.id;
        const messagesCount = await prisma.chat.count({
            where:{
                participants:{
                    has: userId
                },
                messages:{
                    some:{
                        senderId:{
                            not:userId
                        },
                        OR:[
                            {readAt:{isSet:false}},
                            {readAt: null}
                        ]
                    },
                },
            }
        })

        return{
            success:true,
            messagesCount
        }
    }
    catch(error){
        console.log('Failed to get the unread messages count: ',error);
        return{
            success:false,
            error:'Something went wrong on the count unread messages function'
        }
    }
}


export async function createReaction(messageId:Message['id'],emogie:string){
    try{
        const session = await verifyUserSession();
        const userId = session.user.id;
        const existingMessage = await prisma.message.findUnique({
            where:{
                id: messageId
            },
            select:{
                chat:{
                    select:{
                        participants:true
                    }
                },
                reactions:{
                    select:{
                        emogie:true,
                        id:true,
                        userId:true
                    }
                }
            }
        });
        if (!existingMessage){
            throw new Error('Invalid request!')
        };
        const isMember = existingMessage.chat.participants.includes(userId);
        if (!isMember){
            throw new Error('Invalid request');
        }
        const isReactionExist = existingMessage.reactions.find(reaction => reaction.userId === userId);
        // here find the message and its reactions for that use rand check if it has reaction to update if not create ont reaction for it!
        let retrievedReaction;
        if (isReactionExist){
            retrievedReaction = await prisma.reaction.update({
                where:{
                    messageId,
                    id: isReactionExist.id,
                    userId: userId
                },
                data:{
                    emogie,
                },
                select:{
                    emogie:true,
                    id:true,
                    userId:true,
                    messageId:true,
                }
            })
            return{
                success:true,
                message:'Message reaction updated successfully!',
                retrievedReaction
            }
        }
        retrievedReaction = await prisma.reaction.create({
            data:{
                userId,
                messageId,
                emogie
            },
            select:{
                emogie:true,
                id:true,
                userId: true,
                messageId:true,
            }
        })
        return{
            success:true,
            message:'Message reaction has been created successfully!',
            retrievedReaction
        }

    }
    catch(error){
        console.log('Failed to create reaction: ',error);
        return{
            success:false,
            error:'Somthing went wrong in the create reaction function, please try again!'
        }
    }
}