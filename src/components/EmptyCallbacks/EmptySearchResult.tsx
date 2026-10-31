'use client'

import { clearSearch } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function EmptySearchResult() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    return (
        <div className="flex min-w-0 flex-col items-center justify-center gap-2 p-3 sm:gap-3 sm:p-6 lg:p-8">
            <div className="relative mb-1 w-28 sm:mb-2 sm:w-40 md:w-48 lg:w-[200px]">
                <Image
                    alt="search illustration"
                    width={200}
                    height={200}
                    src="/empty illustration bg.png"
                    className="h-auto w-full object-contain"
                />
            </div>

            <h2 className="text-lg font-semibold text-grey1 sm:text-xl lg:text-2xl">
                No result found
            </h2>

            <button
                className="rounded-lg bg-grey1 px-5 py-2 text-xs text-grey7 transition-all hover:brightness-95 sm:px-8 sm:text-sm"
                onClick={() => clearSearch(pathname, searchParams, router)}
            >
                Clear search
            </button>
        </div>
    );
}