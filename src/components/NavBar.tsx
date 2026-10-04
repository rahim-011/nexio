'use client'

import Link from "next/link";
import Logo from "./Logo";
import { usePathname } from "next/navigation";



export default function NavBar(){
    const pathname = usePathname();
    const showNavBar = pathname === '/';
    if (!showNavBar) return null;
    return(
        <nav className="w-full flex justify-between items-center lg:p-7 md:p-5 p-3 shadow-[0_4px_20px_2px_rgba(0,0,0,0.15)] h-35">
            <Logo/>
            <div className="flex items-center gap-3">
                <Link href="/sign-in" className="text-primary9 text-[1.2rem]  rounded-lg bg-grey1 px-6 py-2 transition-all hover:bg-grey1/95 ">Sign Up</Link>
                <Link href="/sign-up"  className="text-white text-[1.2rem]  rounded-lg bg-primary5 px-6 py-2 hover:brightness-115 transition-all">Login</Link>
            </div>
        </nav>
    )
}