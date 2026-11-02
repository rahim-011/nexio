import React from "react";
import { getUserCachedData } from "@/lib/services/user";
import MainLayoutClient from "@/components/MainLayoutClient";
import { countUnacceptRequests } from "@/lib/services/request";
import { countUnreadMessages } from "@/lib/services/message";

export default async function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const userInfos = await getUserCachedData();
    // here we get the count for notification for all the links and then pass them to handle them in a state where we controll the count in the client side!
    const [requestsCountRes,messagesCountRes] = await Promise.all([countUnacceptRequests(),countUnreadMessages()]);
    if(!requestsCountRes.success || !messagesCountRes.success || requestsCountRes.requestsCount === undefined || messagesCountRes.messagesCount === undefined){
        return;
    }
    const [{requestsCount},{messagesCount}] = [requestsCountRes,messagesCountRes];
    return (
        <MainLayoutClient userInfos={userInfos} requestsCount={requestsCount} messagesCount={messagesCount}>
            {children}
        </MainLayoutClient>
    );
}