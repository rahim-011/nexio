
import React from "react";
import LeftSide from "@/components/LeftSide";
import NavBar from "@/components/NavBar";
import { getUserCachedData } from "@/lib/services/user";

export default async function MainLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const userInfos = await getUserCachedData();

    return (
        <div className="min-h-screen bg-primary7">
            <LeftSide userInfos={userInfos} />

            <div className="ml-[76px] min-h-screen min-w-0 bg-primary7">
                <NavBar />

                <main className="min-h-[calc(100dvh-64px)] w-full min-w-0">
                    {children}
                </main>
            </div>
        </div>
    );
}
