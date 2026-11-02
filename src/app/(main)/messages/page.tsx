
import EmptyChat from "@/components/EmptyCallbacks/EmptyChat";
import { getFriends } from "@/lib/services/friend";

export default async function Messages({searchParams}:{searchParams:Promise<{q?:string}>}) {
    const search = (await searchParams).q ?? "";
    const filtredFriendsRes = await getFriends(search);
    if (!filtredFriendsRes.success){
        return null
    }
    const filtredFriends = filtredFriendsRes.filtredFriends || [];
    return (
        <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center">
            <EmptyChat filtredFriends={filtredFriends}/>
        </div>
    );
}
