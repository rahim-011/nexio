import { Archive } from "lucide-react";
import Link from "next/link";

export default function EmptyRequests() {
    return (
        <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center gap-2.5 rounded-lg p-3 sm:gap-3 sm:p-6 lg:p-8">
            <div className="rounded-full border border-grey1 p-3 sm:p-5">
                <Archive
                    size={40}
                    className="text-grey3 sm:h-14 sm:w-14 lg:h-[70px] lg:w-[70px]"
                    strokeWidth={1}
                />
            </div>

            <div className="flex flex-col gap-2 text-center text-grey1 sm:gap-3">
                <h2 className="text-lg font-semibold sm:text-xl lg:text-2xl">
                    No friend requests yet
                </h2>

                <p className="max-w-md text-xs sm:text-sm">
                    Search for friends using their username to connect and start chatting.
                </p>
            </div>

            <Link
                href="/add-friends"
                className="mt-2 flex items-center gap-2 rounded-lg bg-primary5 px-5 py-2 text-xs text-grey1 transition-all hover:brightness-115 sm:mt-4 sm:px-6 sm:text-sm"
            >
                Find Friends
            </Link>
        </div>
    );
}