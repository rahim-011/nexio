import { create } from "zustand";
import { userInfos } from "../types";




interface UserStoreValues{
    cachedUserInfos:userInfos,
    setUserInfos: (data:userInfos) => void,
    updateUserInfos : (value:Partial<userInfos>) => void,
}

export const useUserStore = create<UserStoreValues>((set,get)=>({
    cachedUserInfos: {
        avatar: '',
        bio: '',
        totalPosts: 0,
        totalFriends: 0,
        name: '',
        username: '',
        email: '',
    },
    setUserInfos : (data:userInfos) =>{
        set({cachedUserInfos:data})
    },
    updateUserInfos: (value:Partial<userInfos>) =>{
        set({
            cachedUserInfos:{
                ...get().cachedUserInfos,
                ...value
            }
        })
    }
}))


