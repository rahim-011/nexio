'use client'

import { clearSearch } from "@/lib/utils";
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"



export default function EmptySearchResult(){
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    
    return(
        <div className="flex items-center justify-center flex-col gap-3 p-4 md:p-6 lg:p-8">
            <div className="relative mb-2">
                <Image
                alt="search illustration"
                width={200}
                height={200}
                src='/empty illustration bg.png'
                className="object-cover"/>
            </div>
            <h2 className="text-2xl font-semibold text-grey1">No result found</h2>
            <button className="text-grey7 bg-grey1 rounded-lg px-8 py-2 hover:brightness-95 transition-all cursor-pointer" onClick={()=>clearSearch(pathname,searchParams,router)}>Clear search</button>
        </div>
    )
}