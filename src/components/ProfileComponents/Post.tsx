import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";

export default function Post({
    postInfos,
    onOpen
}: {
    postInfos: any;
    onOpen: () => void;
}) {
    return (
        <div
            className="group relative aspect-square w-full min-w-0 cursor-pointer overflow-hidden rounded-lg"
            onClick={() => onOpen()}
        >
            {postInfos.media.resourceType === "image" ? (
                <Image
                    alt="post image"
                    src={postInfos.media.url}
                    className="h-full w-full object-cover"
                    width={300}
                    height={300}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
            ) : (
                <video
                    src={postInfos.media.url}
                    className="h-full w-full object-cover"
                    controls
                    preload="metadata"
                />
            )}

            <div className="absolute inset-0 flex items-center justify-center gap-5 bg-black/40 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:gap-8">
                <span className="flex items-center gap-2 text-lg font-semibold text-white sm:text-xl">
                    {postInfos.likes.length}
                    <Heart size={24} className="sm:h-7 sm:w-7" />
                </span>

                <span className="flex items-center gap-2 text-lg font-semibold text-white sm:text-xl">
                    {postInfos.comments.length}
                    <MessageCircle size={24} className="sm:h-7 sm:w-7" />
                </span>
            </div>
        </div>
    );
}