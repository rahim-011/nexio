import { MessageCircle } from "lucide-react";

export default function EmptyChatInboxes() {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-primary5/30 text-primary9">
                <MessageCircle size={30} strokeWidth={1.7} />
            </div>

            <div className="flex max-w-sm flex-col gap-2">
                <h2 className="text-lg font-semibold text-grey1">
                    No conversations yet
                </h2>
                <p className="text-sm leading-6 text-grey1/60">
                    Your conversations will appear here. Find a friend and
                    start chatting!
                </p>
            </div>
        </div>
    );
}