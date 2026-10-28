
import { createServer } from "node:http";
import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { auth } from "./lib/auth";
import { prisma } from "./lib/prisma";

const httpServer = createServer();

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

    socket.on("disconnect", () => {
        console.log("A client disconnected:", socket.id);
    });

    // request comes from the front to join a specefic chat room with its id
    socket.on("chat:join", async (chatId:string,ack) => {
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
    socket.on("message:send",async(data:{chatId:string,content:string},ack) =>{ 
        try{
            const userId = socket.data.user.id;
            const chat = await prisma.chat.findUnique({
                where:{
                    id:data.chatId
                },
                select:{
                    participants:true
                }
            });
            if (!chat || !chat.participants.includes(userId)){
                ack({success:false,error:'Unauthorized'})
                return;
            }
            const message = await prisma.message.create({
                data:{
                    chatId: data.chatId,
                    content: data.content,
                    senderId: userId
                }
            })
            io.to(data.chatId).emit("message:new",message);
            ack({success:true,message})
        }
        catch(error){
            console.log("Failed to send meesage: ",error);
            ack({success:false,error:'Failed to send message'})
        }
    } )

    // we did user the io. cause its a message that can be sent to all users in that chat (deffrent sockets not just this socket that we are already in with the connection event)
});

httpServer.listen(3001, () => {
    console.log("Socket.IO server running on port 3001");
});



