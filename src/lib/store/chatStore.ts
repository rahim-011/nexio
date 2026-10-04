import { create } from "zustand";

interface ChatStoreValues {
    currentMessageIndex: number;
    setCurrentMessage: (val: number) => void;
}

export const useChatStore = create<ChatStoreValues>((set, get) => ({
    currentMessageIndex: 0,
    setCurrentMessage: (val) => 
        set({ currentMessageIndex: val }),
    
}));