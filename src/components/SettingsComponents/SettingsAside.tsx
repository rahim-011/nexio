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
        <aside className="py-6 flex flex-col gap-5">
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="rounded-lg p-2 text-grey1 hover:bg-primary5/30 transition-colors cursor-pointer"
                    aria-label="Go back"
                >
                    <ArrowLeft size={23} className="mb-1"/>
                </button>

                <h1 className="text-grey1 text-[1.7rem]">Settings</h1>
            </div>

            <div className="flex flex-col gap-2">
                {navLinks.map((link,index) =>{
                    const bgClass = pathname === link.path ? 'bg-primary5' : 'hover:bg-primary5/20';
                    return(
                        <Link key={index} href={link.path} className={`text-grey1 text-[1.3rem] flex items-center gap-2 ${bgClass} hover:brightness-115 transition-all rounded-lg px-6 py-3 whitespace-nowrap`}>
                            {link.icon}
                            {link.label}
                        </Link>
                    )
                })}
            </div>
        </aside>
    )
}