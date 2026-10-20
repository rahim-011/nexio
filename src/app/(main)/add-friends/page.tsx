import SearchBar from "@/components/SearchBar";
import { getFriends } from "@/lib/services/friend";





export default async function AddFriends({searchParams}:{searchParams:Promise<{q:string}>}){
    const params = await searchParams;
    const search = params.q ?? '';
    const filtredFriendsRes = await getFriends(search);
    if(!filtredFriendsRes.success){
        return null
    }
    const filtredFriends = filtredFriendsRes.filtredFriends || [];
    return(
        <main className="flex flex-col gap-3 lg:max-w-[75%] p-4">
            <div className="flex flex-col gap-1 mb-5">
                <h1 className="text-grey1 font-semibold text-3xl">Invite Friends</h1>
                <p className="text-grey1 text-[0.9rem]">Subtitle: Search for people by their usernamea to connect and start chatting.</p>
            </div>
            <SearchBar placeHolder="Search for friends ..." searchType="friend" filtredFriends={filtredFriends}/>
        </main>
    )
}