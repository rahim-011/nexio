import React from "react";
import { getUserCachedData } from "@/lib/services/user";
import MainLayoutClient from "@/components/MainLayoutClient";

export default async function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const userInfos = await getUserCachedData();

    return (
        <MainLayoutClient userInfos={userInfos}>
            {children}
        </MainLayoutClient>
    );
}