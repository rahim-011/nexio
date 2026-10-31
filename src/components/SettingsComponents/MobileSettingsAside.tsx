'use client'

import { Settings, UserPen, Menu, X, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function MobileSettingsAside() {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { label: 'Edit Profile', icon: <UserPen size={22} />, path: '/settings/edit-profile' },
        { label: 'Account Settings', icon: <Settings size={22} />, path: '/settings/account-settings' }
    ];

    return (
        <div className="md:hidden">
            <header className="flex items-center justify-between bg-primary9 px-4 py-3 ">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="rounded-lg p-2 text-grey1 transition-colors hover:bg-primary5/30"
                        aria-label="Go back"
                    >
                        <ArrowLeft size={23} />
                    </button>

                    <h1 className="text-xl font-semibold text-grey1">Settings</h1>
                </div>

                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="rounded-lg p-2 text-grey1 transition-colors hover:bg-primary5/30"
                    aria-label="Open settings menu"
                >
                    <Menu size={25} />
                </button>
            </header>

            {isOpen && (
                <div className="fixed inset-0 z-50">
                    <button
                        type="button"
                        className="absolute inset-0 h-full w-full bg-black/50"
                        onClick={() => setIsOpen(false)}
                        aria-label="Close settings menu"
                    />

                    <aside className="absolute left-0 top-0 flex h-full w-[min(80%,300px)] flex-col gap-5 bg-primary9 px-4 py-6 shadow-xl animate-in slide-in-from-left duration-300">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-semibold text-grey1">Settings</h2>

                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="rounded-lg p-2 text-grey1 transition-colors hover:bg-primary5/30"
                                aria-label="Close settings menu"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-2">
                            {navLinks.map((link) => {
                                const bgClass = pathname === link.path
                                    ? 'bg-primary5'
                                    : 'hover:bg-primary5/20';

                                return (
                                    <Link
                                        key={link.path}
                                        href={link.path}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center gap-3 rounded-lg px-4 py-3 text-lg text-grey1 transition-all ${bgClass}`}
                                    >
                                        {link.icon}
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
}