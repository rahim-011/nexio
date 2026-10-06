'use client'

import LeftSide from "@/components/LeftSide";
import NavBar from "@/components/NavBar";
import { usePathname } from "next/navigation";
import React from "react";

export default function MainLayout({
    children
}: Readonly<{children: React.ReactNode}>) {
    const pathname = usePathname();
    const isLandingPage = pathname === '/';

    if (isLandingPage) {
        return (
            <>
                <NavBar />
                <main>
                    {children}
                </main>
            </>
        );
    }

    return (
        <div className="flex">
            <LeftSide />
            <div className="flex-1 ml-[25%] flex flex-col min-w-0 bg-primary7">
                <NavBar />
                <main className="min-h-screen ">
                    {children}
                </main>
            </div>
        </div>
    );
}