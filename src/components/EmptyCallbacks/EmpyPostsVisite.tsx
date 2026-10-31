import { Camera } from "lucide-react";

export default function EmptyPostsViste() {
    return (
        <div className="flex w-full flex-col items-center justify-center gap-3 px-3 py-6 text-center sm:gap-4 sm:px-4 sm:py-12">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary3 bg-primary5/30 sm:h-24 sm:w-24 lg:h-28 lg:w-28">
                <Camera
                    size={36}
                    strokeWidth={1.5}
                    className="text-primary8 sm:h-10 sm:w-10 lg:h-12 lg:w-12"
                />
            </div>

            <div className="flex flex-col gap-1.5 sm:gap-2">
                <h2 className="text-lg font-semibold text-grey1 sm:text-xl">
                    No Posts Yet
                </h2>

                <p className="max-w-sm text-xs leading-5 text-grey1/60 sm:text-sm sm:leading-6">
                    This user hasn't shared any posts yet. Check back later to see what they share.
                </p>
            </div>
        </div>
    );
}