import SettingsAside from "@/components/SettingsComponents/SettingsAside";
import MobileSettingsAside from "@/components/SettingsComponents/MobileSettingsAside";
import React from "react";

export default function SettingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <main className="flex h-full min-h-0 w-full flex-col overflow-hidden md:flex-row">
            <div className="hidden h-full min-h-0 w-[30%] min-w-[220px] shrink-0 bg-primary9 md:block">
                <SettingsAside />
            </div>

            <MobileSettingsAside />

            <div className="min-h-0 min-w-0 flex-1 overflow-y-auto">
                {children}
            </div>
        </main>
    );
}