import { create } from "zustand";



interface NotificationStoreValues{
    totalRequests: number | null,
    totalMessages: number | null,
    increaseTotal: (type:'requests' | 'messages') => void,
    decreaseTotal: (type: 'requests' | 'messages') => void,
    setTotalRequests: (value:number) => void,
    setTotalMessages: (value:number) => void,
}

export const useNotificationStore = create<NotificationStoreValues>((set,get)=>({
    totalRequests: null,
    totalMessages: null,

    increaseTotal: (type: 'requests' | 'messages') => {
        if (type === 'requests'){
            const currentTotalRequests = get().totalRequests || 0;
            set({totalRequests: currentTotalRequests > 99 ? currentTotalRequests : currentTotalRequests + 1})
        }else{
            if (type === 'messages'){
                const currentTotalMessages = get().totalMessages || 0;
                set({totalMessages: currentTotalMessages > 99 ? currentTotalMessages : currentTotalMessages + 1})
            }
        }
    },
    decreaseTotal: (type:'requests' | 'messages') => {
        if (type === 'requests'){
            const currentTotalRequests = get().totalRequests || 0;
            set({totalRequests: currentTotalRequests === 0 ? currentTotalRequests : currentTotalRequests - 1})
        }else{
            if (type === 'messages'){
                const currentTotalMessages = get().totalMessages || 0;
                set({totalMessages: currentTotalMessages === 0 ? currentTotalMessages : currentTotalMessages - 1})
            }
        }
    },
    setTotalRequests: (value: number) => {
        set({totalRequests: value})
    },
    setTotalMessages: (value:number) =>{
        set({totalMessages: value})
    }
}))