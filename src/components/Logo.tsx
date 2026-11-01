import Link from "next/link"
export default function Logo(){
    return(
        <Link className="flex items-center gap-2 sm:gap-3 shrink-0" href='/'>
            <div 
            className="w-8 h-8 sm:w-[40px] sm:h-[40px] text-grey1 bg-current [mask-image:url('/chatLogo.svg')] [mask-size:contain] [mask-repeat:no-repeat]" 
            />
            <span className="font-[family-name:var(--font-alatsi)] antialiased text-grey1 text-2xl sm:text-[1.8rem]">
                Nexio
            </span>
        </Link>
    )
}