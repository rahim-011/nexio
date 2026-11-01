'use client'

import Link from "next/link";
import Logo from "./Logo";
import { usePathname } from "next/navigation";
import { User } from "@prisma/client";

export default function NavBar({userId}:{userId?:User['id']}){
    const pathname = usePathname();
    const showNavBar = pathname === '/';
    if (!showNavBar) return null;
    return(
        <nav className="w-full flex justify-between items-center lg:p-7 md:p-5 px-4 py-3 shadow-[0_4px_20px_2px_rgba(0,0,0,0.15)] h-20 sm:h-35">
            <Logo/>
            {!userId && <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <Link href="/sign-up" className="text-primary9 text-xs sm:text-[1.2rem] rounded-lg bg-grey1 px-3 sm:px-6 py-2 sm:py-2 transition-all hover:bg-grey1/95">Sign Up</Link>
                <Link href="/sign-in" className="text-white text-xs sm:text-[1.2rem] rounded-lg bg-primary5 px-3 sm:px-6 py-2 sm:py-2 hover:brightness-115 transition-all">Login</Link>
            </div>}
        </nav>
    )
}