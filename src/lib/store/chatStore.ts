import { User } from "@prisma/client";
import { create } from "zustand";

interface ChatStoreValues {
    currentMessageIndex: number | null;
    setCurrentMessage: (val: number | null) => void;
    clearCurrentMessage: () => void,
    setSelectedFriendId: (friendId:User['id'] | null) => void,
    selectedFriendId: User['id'] | null,
}

export const useChatStore = create<ChatStoreValues>((set, get) => ({
    currentMessageIndex: null,
    selectedFriendId: null,
    setCurrentMessage: (val) => 
        set({ currentMessageIndex: val }),
    clearCurrentMessage: () => set({currentMessageIndex: null}),
    setSelectedFriendId: (friendId:User['id'] | null) => set({selectedFriendId: friendId})
}));