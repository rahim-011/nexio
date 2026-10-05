'use client'

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { clearSearch } from "@/lib/utils";

interface OverlayProps {
    closeModel: () => void,
    isMain?: boolean
}

export default function Overlay({ closeModel, isMain = false }: OverlayProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const bgClass = isMain ? 'bg-primary7/80' : 'bg-primary7/60';

    return (
        <div
            className={`fixed inset-0 ${bgClass} z-40`}
            onMouseDown={(e) => {
                e.preventDefault();
                closeModel();
                clearSearch(pathname, searchParams, router);
            }}
        />
    );
}