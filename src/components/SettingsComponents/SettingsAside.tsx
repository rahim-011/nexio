'use client'

import { Settings, UserPen, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function SettingsAside() {
    const pathname = usePathname();
    const router = useRouter();

    const navLinks = [
        {label:'Edit Profile',icon:<UserPen size={22} className="mb-1"/>,path:'/settings/edit-profile'},
        {label:'Account Settings',icon:<Settings size={22} className="mb-1"/>,path:'/settings/account-settings'}
    ]

    return (
        <aside className="flex h-full w-full flex-col gap-5 bg-primary9 px-5 py-6 lg:px-7">
            <div className="flex shrink-0 items-center gap-3">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="cursor-pointer rounded-lg p-2 text-grey1 transition-colors hover:bg-primary5/30"
                    aria-label="Go back"
                >
                    <ArrowLeft size={23} className="mb-1"/>
                </button>

                <h1 className="text-[1.7rem] text-grey1">Settings</h1>
            </div>

            <div className="flex flex-1 flex-col gap-2">
                {navLinks.map((link,index) =>{
                    const bgClass = pathname === link.path ? 'bg-primary5' : 'hover:bg-primary5/20';
                    return(
                        <Link key={index} href={link.path} className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-6 py-3 text-[1.3rem] text-grey1 transition-all hover:brightness-115 ${bgClass}`}>
                            {link.icon}
                            {link.label}
                        </Link>
                    )
                })}
            </div>
        </aside>
    )
}