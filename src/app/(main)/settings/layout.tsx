import SettingsAside from "@/components/SettingsComponents/SettingsAside";
import React from "react";

export default function SettingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <main className="flex min-h-screen">
            <div className="w-[30%] min-w-[220px] shrink-0 bg-primary9">
                <SettingsAside />
            </div>
            <div className="flex-1">{children}</div>
        </main>
    )
}