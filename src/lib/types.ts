



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


export type uploadFolders = 'posts' | 'avatars'



export type manageFriendsActions = 'accept' | 'decline'
export type FriendStatus = 'Friends' | 'pending' | 'accept' | null;