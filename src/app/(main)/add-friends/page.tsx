import SearchBar from "@/components/SearchBar";





export default function AddFriends(){
    return(
        <main className="flex flex-col gap-3">
            <div className="flex flex-col gap-1 mb-5">
                <h1 className="text-grey1 font-semibold text-3xl">Invite Friends</h1>
                <p className="text-grey1 text-[0.9rem]">Subtitle: Search for people by their usernamea to connect and start chatting.</p>
            </div>
            <SearchBar placeHolder="Search for friends ..."/>
        </main>
    )
}