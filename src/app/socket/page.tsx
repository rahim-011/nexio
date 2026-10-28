

'use client'

import { socket } from "@/lib/socket"
import { useEffect } from "react"



export default function SocketConnectionTest(){
    useEffect(()=>{
        const handleConnect = () =>{
            console.log('Connected to the socket: ',socket.id);
        }
        socket.on('connect',handleConnect);
        socket.connect();
        return () =>{
            socket.off('connect',handleConnect)
            socket.disconnect();
        }
    },[])
    return(
        <p>Socker.IO connection test</p>
    )
}