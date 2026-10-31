import SettingsAside from "@/components/SettingsComponents/SettingsAside";
import MobileSettingsAside from "@/components/SettingsComponents/MobileSettingsAside";
import React from "react";

export default function SettingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <main className="flex min-h-screen flex-col md:flex-row">
            <div className="hidden w-[30%] min-w-[220px] shrink-0 bg-primary9 md:block">
                <SettingsAside />
            </div>

            <MobileSettingsAside />

            <div className="min-w-0 flex-1">
                {children}
            </div>
        </main>
    );
}