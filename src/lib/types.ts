import { Chat } from "@prisma/client";




export type searchResults = 'chat' | 'friend' | 'all';


export type stepType = 'forward' | 'backward'




export type userInfos = {
    avatar: string | null
    bio: string | null
    totalPosts: number,
    totalFriends: number,
    name: string | null,
    email: string
    username: string
}


export type UploadFolders = "posts" | "avatars" | `chat/${Chat['id']}`;

export type manageFriendsActions = 'accept' | 'decline'
export type FriendStatus = 'Friends' | 'pending' | 'accept' | null;
export type ProfileLabels = 'Remove Friend' | 'Edit Profile' | 'Add Friend' | 'Pending'


export type LikeActions = 'like' | 'unlike'