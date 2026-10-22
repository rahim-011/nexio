
import { Camera } from "lucide-react";

export default function EmptyPostsViste() {
    return (
        <div className="flex w-full flex-col items-center justify-center gap-4 px-4 py-12 text-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-primary3 bg-primary5/30">
                <Camera size={48} strokeWidth={1.5} className="text-primary8" />
            </div>

            <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold text-grey1">
                    No Posts Yet
                </h2>
                <p className="max-w-sm text-sm leading-6 text-grey1/60">
                    This user hasn't shared any posts yet. Check back later to see what they share.
                </p>
            </div>
        </div>
    );
}
