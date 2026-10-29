
import { createServer } from "node:http";
import { Server } from "socket.io";
import express from 'express'
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { auth } from "./lib/auth";
import { prisma } from "./lib/prisma";
import { messageSchema } from "./schemas/chatSchema";
import { Message, User } from "@prisma/client";
import { MessageFormValue } from "./components/MessagesComponents/MessageSubFooter";


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


const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        credentials:true // accept the cookies from the front
    },
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

    //front send a a message and the sever receive it then send it again to the chat room;
    socket.on("message:send",(data:Message,ack) =>{
        io.to(data.chatId).emit("message:new",{
            content:  data.content,
            media: data.images
        })
    })

    // we did user the io. cause its a message that can be sent to all users in that chat (deffrent sockets not just this socket that we are already in with the connection event)
});

httpServer.listen(3001, () => {
    console.log("Socket.IO server running on port 3001");
});



