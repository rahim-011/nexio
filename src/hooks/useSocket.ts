'use client'

import { socket } from "@/lib/socket"
import { useEffect } from "react"



export function useSocket(){
    useEffect(()=>{
        if (!socket.connected){
            socket.connect();
        }
    },[])
}
