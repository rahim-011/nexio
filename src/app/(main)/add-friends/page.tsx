import SearchBar from "@/components/SearchBar";
import { getFriends } from "@/lib/services/friend";

export default async function AddFriends({
    searchParams
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const params = await searchParams;
    const search = params.q ?? "";
    const filtredFriendsRes = await getFriends(search);

    if (!filtredFriendsRes.success) {
        return null;
    }

    const filtredFriends = filtredFriendsRes.filtredFriends || [];

    return (
        <main className="flex h-[calc(100dvh-64px)] min-h-0 min-w-0 flex-col gap-3 overflow-hidden p-3 sm:p-4 lg:max-w-[75%]">
            <div className="mb-2 flex min-w-0 flex-col gap-1 sm:mb-4">
                <h1 className="text-xl font-semibold text-grey1 sm:text-2xl lg:text-3xl">
                    Invite Friends
                </h1>

                <p className="break-words text-xs text-grey1 sm:text-sm">
                    Search for people by their username to connect and start chatting.
                </p>
            </div>

            <SearchBar
                placeHolder="Search for friends ..."
                searchType="friend"
                filtredFriends={filtredFriends}
            />
        </main>
    );
}