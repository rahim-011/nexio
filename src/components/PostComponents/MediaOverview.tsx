import Image from "next/image";

type MediaOverviewProps = {
    url: string;
    resourceType: "image" | "video";
};

export default function MediaOverview({
    url,
    resourceType,
}: MediaOverviewProps) {
    return (
        <div className="relative h-full min-h-0 w-full flex-1 overflow-hidden rounded-xl bg-primary7">
            {resourceType === "image" ? (
                <Image
                    alt="Post media preview"
                    src={url}
                    fill
                    sizes="100vw"
                    className="object-contain"
                    unoptimized
                />
            ) : (
                <video
                    src={url}
                    className="h-full w-full object-contain"
                    controls
                    playsInline
                    preload="metadata"
                />
            )}
        </div>
    );
}