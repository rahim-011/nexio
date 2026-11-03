"use client";

import { ResourceTypes } from "@prisma/client";
import { Download, X } from "lucide-react";
import Image from "next/image";

interface InspectChatMediaProps {
    resourceType: ResourceTypes;
    url: string;
    onClose: () => void;
}

export default function InspectChatMedia({
    resourceType,
    url,
    onClose
}: InspectChatMediaProps) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={onClose}
        >
            <div
                className="relative flex h-full w-full items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="absolute right-0 top-0 z-10 flex items-center gap-2">
                    <a
                        href={url}
                        download
                        rel="noopener noreferrer"
                        aria-label="Download media"
                        className="flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                    >
                        <Download size={22} />
                    </a>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close media"
                        className="flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 cursor-pointer"
                    >
                        <X size={24} />
                    </button>
                </div>

                {resourceType === ResourceTypes.image && (
                    <Image
                        src={url}
                        alt="Inspected chat image"
                        width={1600}
                        height={1200}
                        className="max-h-full max-w-full object-contain"
                        unoptimized
                    />
                )}

                {resourceType === ResourceTypes.video && (
                    <video
                        src={url}
                        controls
                        autoPlay
                        className="max-h-full max-w-full"
                    />
                )}
            </div>
        </div>
    );
}