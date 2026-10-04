import { alatsi } from "@/lib/fonts"
import Link from "next/link"

export default function Logo(){
    return(
        <Link className="flex items-center gap-3" href='/'>
            <div 
            className="w-[40px] h-[40px] text-grey1 bg-current [mask-image:url('/chatLogo.svg')] [mask-size:contain] [mask-repeat:no-repeat]" 
            />
            <span className={`${alatsi.className} antialiased text-grey1 text-[1.8rem]`}>Nexio</span>
        </Link>
    )
}