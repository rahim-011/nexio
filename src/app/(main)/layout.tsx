import React from "react";
import LeftSide from "@/components/LeftSide";
import NavBar from "@/components/NavBar";
import { getUserCachedData } from "@/lib/services/user";



export default async function MainLayout({children}:Readonly<{children:React.ReactNode}>){
    const userInfos = await getUserCachedData();
    return (
        <div className="flex">
            <LeftSide userInfos={userInfos}/>
            <div className="flex-1 ml-[25%] flex flex-col min-w-0 bg-primary7">
                <NavBar />
                <main className="min-h-screen">{children}</main>
            </div>
        </div>
    );
}