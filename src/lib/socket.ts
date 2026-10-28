import {io} from 'socket.io-client'




export const socket = io('http://localhost:3001',{
    autoConnect:false,
    withCredentials:true, // this allows the front to send the cookie when connecting
})
