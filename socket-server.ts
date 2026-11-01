
import { createServer } from "node:http";
import { Server } from "socket.io";
import express from 'express'
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { auth } from "./src/lib/auth";
import { prisma } from "./src/lib/prisma";

import type { newMessageValue } from "@/lib/services/message";
import { Chat, User } from "@prisma/client";



// response types
export type JoinChatResponse = {
    success: boolean;
    error?: string;
};



const app = express();

const httpServer = createServer(app);


const onlineUsers = new Map<User['id'],number>();

app.get("/users/:userId/status",(req,res) =>{
    const secret = req.headers['x-internal-secret'];
    if (!process.env.INTERNAL_API_SECRET || secret !== process.env.INTERNAL_API_SECRET){
        res.status(401).json({success:false});
        return;
    }
    const userId = req.params.userId;
    return res.json({
        success:true,
        isOnline: onlineUsers.has(userId)
    })
})


const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:3000",
    "https://z3gz75vs-3001.uks1.devtunnels.ms",
].filter((origin): origin is string => Boolean(origin))
 .map(origin => origin.replace(/\/$/, ""));

const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        credentials: true, // accept the cookies from the front
    },
    transports: ["websocket", "polling"],
});

// using auth to verify the authentication of the user that want to join the socket
io.use(async (socket, next) => {
    try {
        const headers = new Headers();
        
        const cookie = socket.handshake.headers.cookie;

        if (cookie) {
            headers.set("cookie", cookie);
        }
        
        const session = await auth.api.getSession({
            headers,
        });

        if (!session) {
            return next(new Error("Unauthorized"));
        }

        socket.data.user = session.user;

        next();
    } catch {
        next(new Error("Authentication failed"));
    }
});

io.on("connection", (socket) => {
    console.log("A client connected:", socket.id);
    const userId = socket.data.user.id;
    socket.join(`user:${userId}`); // user joins a room so he can receive events of new messages even if he is not in the chat
    const count = onlineUsers.get(userId) ?? 0;
    onlineUsers.set(userId,count + 1);

    socket.on("disconnect", () => {
        console.log("A client disconnected:", socket.id);
        const currentCount = onlineUsers.get(userId) ?? 0;
        if (currentCount <= 1){
            onlineUsers.delete(userId);
        }else{
            onlineUsers.set(userId,currentCount - 1);
        }
    });

    // request comes from the front to join a specefic chat room with its id
    socket.on("chat:join", async (chatId:string,ack) => {
        console.log("chat:join received:", chatId);
        try{
            const userId = socket.data.user.id;

            const chat = await prisma.chat.findUnique({
                where:{
                    id:chatId
                },
                select:{
                    participants:true
                }
            })
            if (!chat || !chat.participants.includes(userId)){
                ack({success:false,error:"Unauthorized"});
                return;
            }
            await socket.join(chatId);
            console.log(`User ${userId} joined chat ${chatId}`);
            ack({success:true})
        }
        catch(error){
            ack({success:false,error:'Failed to join chat'})
            console.log('Failed to join chat: ',error);
        }
    })







    // here  when user leaves the chat we receive an event so the socket leaves the chat its currently in!
    socket.on("chat:leave",(chatId:Chat['id']) => {
        socket.leave(chatId)
    })

    //front send a a message and the sever receive it then send it again to the chat room;
    socket.on("message:send", async(data: newMessageValue) => {
        try{
            const chatId = data.chatId;
            const existingChat = await prisma.chat.findUnique({
                where:{
                    id:chatId
                }
            });
            if (!existingChat){
                throw new Error('Chat does not exist!')
            }
            if (!existingChat.participants.includes(userId)){
                throw new Error('Unauthorized')
            }
            const receiverId = existingChat.participants.find(id => id!== userId);
            io.to(chatId).emit("message:new", data);
            io.to(`user:${receiverId}`).emit("inbox:message:new",data);
        }
        
        catch(error){
            console.log('Failed to send message: ',error)
        }
    });


    // we did user the io. cause its a message that can be sent to all users in that chat (deffrent sockets not just this socket that we are already in with the connection event)
});

const PORT = Number(process.env.PORT) || 3001;

httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Socket.IO server running on port ${PORT}`);
});



