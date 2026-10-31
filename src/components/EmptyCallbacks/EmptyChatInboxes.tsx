import { MessageCircle } from "lucide-react";

export default function EmptyChatInboxes() {
    return (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 px-3 text-center sm:min-h-[60vh] sm:gap-4 sm:px-6">
            <div className="flex size-14 items-center justify-center rounded-xl bg-primary5/30 text-primary9 sm:size-16 sm:rounded-2xl">
                <MessageCircle size={26} strokeWidth={1.7} className="sm:h-[30px] sm:w-[30px]" />
            </div>

            <div className="flex max-w-sm flex-col gap-1.5 sm:gap-2">
                <h2 className="text-base font-semibold text-grey1 sm:text-lg">
                    No conversations yet
                </h2>

                <p className="text-xs leading-5 text-grey1/60 sm:text-sm sm:leading-6">
                    Your conversations will appear here. Find a friend and
                    start chatting!
                </p>
            </div>
        </div>
    );
}