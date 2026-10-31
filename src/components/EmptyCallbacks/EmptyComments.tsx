import { MessageCircle } from "lucide-react";

export default function EmptyComments() {
    return (
        <div className="flex flex-col items-center justify-center gap-2.5 px-3 py-6 text-center sm:gap-3 sm:px-4 sm:py-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary5 bg-primary9 sm:h-14 sm:w-14">
                <MessageCircle className="h-5 w-5 text-grey2 sm:h-6 sm:w-6" />
            </div>

            <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-grey1">
                    No comments yet
                </h3>

                <p className="max-w-[240px] text-[11px] leading-5 text-grey2 sm:text-xs">
                    Be the first to share your thoughts on this post.
                </p>
            </div>
        </div>
    );
}