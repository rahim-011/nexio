"use client";

import React from "react";
import { usePathname } from "next/navigation";
import LeftSide from "@/components/LeftSide";
import NavBar from "@/components/NavBar";
import { userInfos } from "@/lib/types";

interface MainLayoutClientProps {
    children: React.ReactNode;
    userInfos: userInfos | null;
}

export default function MainLayoutClient({
    children,
    userInfos,
}: MainLayoutClientProps) {
    const pathname = usePathname();

    const isSettingsPage = pathname.startsWith("/settings");
    const isAddFriendsPage = pathname === "/add-friends";
    const isRequestsPage = pathname === "/requests";
    const isEditProfilePage = pathname === "/settings/edit-profile";

    const isFixedHeightPage =
        isAddFriendsPage ||
        isRequestsPage ||
        isEditProfilePage;

    const isChatPage =
        pathname.startsWith("/messages/") && pathname !== "/messages";

    return (
        <div
            className={`min-w-0 bg-primary7 ${
                isFixedHeightPage
                    ? "h-dvh overflow-hidden"
                    : "min-h-screen"
            }`}
        >
            {!isSettingsPage && <LeftSide userInfos={userInfos} />}

            <div
                className={`min-w-0 bg-primary7 ${
                    isFixedHeightPage
                        ? "h-dvh overflow-hidden"
                        : "min-h-screen"
                } ${
                    isSettingsPage
                        ? ""
                        : isChatPage
                            ? "ml-[68px] max-[1280px]:ml-0"
                            : "ml-[68px]"
                }`}
            >
                <div className={isChatPage ? "max-[1280px]:hidden" : ""}>
                    <NavBar />
                </div>

                <main
                    className={`w-full min-w-0 ${
                        isChatPage
                            ? "h-dvh min-h-0 overflow-hidden max-[1280px]:fixed max-[1280px]:inset-0"
                            : isFixedHeightPage
                                ? "h-[calc(100dvh-64px)] min-h-0 overflow-hidden"
                                : "min-h-[calc(100dvh-64px)]"
                    }`}
                >
                    {children}
                </main>
            </div>
        </div>
    );
}