'use client'

import { useState } from "react"

export default function AddFriendBtn(){
    const [isAdded, setIsAdded] = useState<boolean>(false);
    const bgClass = isAdded ? 'bg-primary2 text-white' : 'bg-grey1 text-grey7';

    return(
        <button 
            className={`${bgClass} rounded-lg px-7 py-2 flex items-center justify-center text-center cursor-pointer hover:brightness-95 transition-all`} 
            onClick={() => setIsAdded(prev => !prev)}
        >
            {isAdded ? 'pending' : 'Add friend'}
        </button>
    )
}