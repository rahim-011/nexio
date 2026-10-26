
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

            <div className="ml-[76px] min-w-0 bg-primary7 transition-[margin] duration-300 ease-in-out peer-hover:ml-64 p-5">
                <NavBar />
                <main className="min-h-full w-full min-w-0">
                    {children}
                </main>
            </div>
        </div>
    );
}
