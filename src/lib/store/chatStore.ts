import { create } from "zustand";

interface ChatStoreValues {
    currentMessageIndex: number | null;
    setCurrentMessage: (val: number | null) => void;
    clearCurrentMessage: () => void,
}

export const useChatStore = create<ChatStoreValues>((set, get) => ({
    currentMessageIndex: null,
    setCurrentMessage: (val) => 
        set({ currentMessageIndex: val }),
    clearCurrentMessage: () => set({currentMessageIndex: null})
    
}));