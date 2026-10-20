'use server'

import { User } from "@prisma/client";
import { prisma } from "../prisma";
import { verifyUserSession } from "./verifications";
import { getCurrentUser } from "./user";




interface FiltersValues{
    search: User['username']
}

export async function getFriends(filter:FiltersValues['search']){
    try{
        const session = await verifyUserSession();
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
            
            const isFriend = currentUser?.friendsIds.includes(userId);
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








