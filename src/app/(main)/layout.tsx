'use client'

import LeftSide from "@/components/LeftSide";
import NavBar from "@/components/NavBar";
import { usePathname } from "next/navigation";
import React from "react";
import { Toaster } from "sonner";


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
                <Toaster
                    position="top-right"
                    richColors
                    closeButton
                    toastOptions={{
                        classNames: {
                            toast: "!font-sans !rounded-xl !shadow-xl !border !border-primary5/30 !bg-white !text-slate-800 !backdrop-blur-md",
                            title: "!font-semibold !text-slate-900",
                            description: "!text-slate-500",
                            actionButton: "!bg-primary9 !text-white hover:!bg-primary5",
                            cancelButton: "!bg-slate-100 !text-slate-600",
                            closeButton: "!bg-white !border-slate-200 !text-slate-500 hover:!bg-slate-100",
                            success: "!border-emerald-200",
                            error: "!border-red-200",
                            warning: "!border-amber-200",
                            info: "!border-primary5/40",
                        },
                    }}
                />
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