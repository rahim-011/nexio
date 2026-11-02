
import { createServer } from "node:http";
import { Server } from "socket.io";
import express from "express";
import dotenv from "dotenv";
import { createHmac, timingSafeEqual } from "node:crypto";

dotenv.config({ path: ".env" });

import { prisma } from "./src/lib/prisma";

import type { newMessageValue } from "@/lib/services/message";
import { Chat, User } from "@prisma/client";

//* response types*
export type JoinChatResponse = {
    success: boolean;
    error?: string;
};

type SocketTokenPayload = {
    sub: string;
    exp: number;
    aud: string;
};

const app = express();

const httpServer = createServer(app);

const onlineUsers = new Map<User["id"], number>();

const SOCKET_TOKEN_SECRET: string = process.env.SOCKET_TOKEN_SECRET!;

if (!SOCKET_TOKEN_SECRET) {
    throw new Error("SOCKET_TOKEN_SECRET is missing");
}

function verifySocketToken(token: string): SocketTokenPayload | null {
    try {
        const parts = token.split(".");

        if (parts.length !== 2) {
            return null;
        }

        const [payloadPart, signaturePart] = parts;

        const expectedSignature = createHmac("sha256", SOCKET_TOKEN_SECRET)
            .update(payloadPart)
            .digest();

        const receivedSignature = Buffer.from(signaturePart, "base64url");

        if (
            receivedSignature.length !== expectedSignature.length ||
            !timingSafeEqual(receivedSignature, expectedSignature)
        ) {
            return null;
        }

        const payload = JSON.parse(
            Buffer.from(payloadPart, "base64url").toString("utf8")
        ) as SocketTokenPayload;

        if (
            !payload.sub ||
            typeof payload.sub !== "string" ||
            !payload.exp ||
            payload.exp <= Math.floor(Date.now() / 1000) ||
            payload.aud !== "nexio-socket"
        ) {
            return null;
        }

        return payload;
    } catch {
        return null;
    }
}

app.get("/users/:userId/status", (req, res) => {
    const secret = req.headers["x-internal-secret"];

    if (!process.env.INTERNAL_API_SECRET || secret !== process.env.INTERNAL_API_SECRET) {
        res.status(401).json({ success: false });
        return;
    }

    const userId = req.params.userId;

    return res.json({
        success: true,
        isOnline: onlineUsers.has(userId)
    });
});

const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:3000",
    "https://z3gz75vs-3001.uks1.devtunnels.ms",
].filter((origin): origin is string => Boolean(origin))
    .map(origin => origin.replace(/\/$/, ""));

const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        credentials: false,
    },
    transports: ["websocket", "polling"],
});

//* using auth to verify the authentication of the user that want to join the socket*
io.use((socket, next) => {
    try {
        const token = socket.handshake.auth?.token;

        if (typeof token !== "string") {
            return next(new Error("Unauthorized"));
        }

        const payload = verifySocketToken(token);

        if (!payload) {
            return next(new Error("Unauthorized"));
        }

        socket.data.user = {
            id: payload.sub,
        };

        next();
    } catch {
        next(new Error("Authentication failed"));
    }
});

io.on("connection", (socket) => {
    console.log("A client connected:", socket.id);

    const userId = socket.data.user.id;

    socket.join(`user:${userId}`); //* user joins a room so he can receive events of new messages even if he is not in the chat*

    const count = onlineUsers.get(userId) ?? 0;
    onlineUsers.set(userId, count + 1);

    socket.on("disconnect", () => {
        console.log("A client disconnected:", socket.id);

        const currentCount = onlineUsers.get(userId) ?? 0;

        if (currentCount <= 1) {
            onlineUsers.delete(userId);
        } else {
            onlineUsers.set(userId, currentCount - 1);
        }
    });

    //* request comes from the front to join a specefic chat room with its id*
    socket.on("chat:join", async (chatId: string, ack) => {
        console.log("chat:join received:", chatId);

        try {
            const userId = socket.data.user.id;
            const chat = await prisma.chat.findUnique({
                where: {
                    id: chatId
                },
                select: {
                    participants: true
                }
            });

            if (!chat || !chat.participants.includes(userId)) {
                ack?.({ success: false, error: "Unauthorized" });
                return;
            }
            
           
            await socket.join(chatId);
            await prisma.message.updateMany({
                where:{
                    chatId,
                    OR:[
                        {readAt:{isSet:false}},
                        {readAt:null}
                    ],
                    senderId:{
                        not: userId
                    }
                },
                data:{
                    readAt: new Date()
                }
            })
            console.log(`User ${userId} joined chat ${chatId}`);

            ack?.({ success: true });
        } catch (error) {
            ack?.({ success: false, error: "Failed to join chat" });
            console.log("Failed to join chat: ", error);
        }
    });

    //* here when user leaves the chat we receive an event so the socket leaves the chat its currently in!*
    socket.on("chat:leave", (chatId: Chat["id"]) => {
        socket.leave(chatId);
    });

    //* front send a a message and the sever receive it then send it again to the chat room;*
    socket.on("message:send", async (data: newMessageValue) => {
        try {
            const chatId = data.chatId;

            const existingChat = await prisma.chat.findUnique({
                where: {
                    id: chatId
                }
            });

            if (!existingChat) {
                throw new Error("Chat does not exist!");
            }

            if (!existingChat.participants.includes(userId)) {
                throw new Error("Unauthorized");
            }
            const existingMessage = await prisma.message.findUnique({
                where: {
                    id: data.id
                }
            });

            if (
                !existingMessage ||
                existingMessage.chatId !== chatId ||
                existingMessage.senderId !== userId
            ) {
                throw new Error("Invalid message");
            }

            const receiverId = existingChat.participants.find(id => id !== userId);
            if (!receiverId){
                throw new Error('Receiver id does not exist!')
            }
            const roomSockets = await io.in(chatId).fetchSockets();
            const isReceiverInChat = roomSockets.some(roomSocket => roomSocket.data.user.id === receiverId);
            let formattedData = data;
            if (isReceiverInChat){
                const readAt = new Date();
                await prisma.message.updateMany({
                    where:{
                        id: data.id,
                    },
                    data:{
                        readAt
                    }
                })
                formattedData = {
                    ...data,
                    readAt
                }
            }
            
            io.to(chatId).emit("message:new", formattedData);

            if (receiverId) {
                io.to(`user:${receiverId}`).emit("inbox:message:new",formattedData);
            }
        } catch (error) {
            console.log("Failed to send message: ", error);
        }
    });

    //* we did use the io. cause its a message that can be sent to all users in that chat (different sockets not just this socket that we are already in with the connection event)*
});

const PORT = Number(process.env.PORT) || 3001;

httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Socket.IO server running on port ${PORT}`);
});
