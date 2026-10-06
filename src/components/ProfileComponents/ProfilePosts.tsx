import Post from "./Post";




export default function ProfilePosts(){
    return(
        <div className="flex flex-col gap-2 p-2">
            <h2 className="text-grey1 text-[1.7rem]">Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2">
                <Post/>
                <Post/>
                <Post/>
                
            </div>
        </div>
    )
}