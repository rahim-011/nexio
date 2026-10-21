import type { User } from "@prisma/client";
import EmptyPosts from "../EmptyCallbacks/EmptyPosts";
import Post from "./Post";
import { UserPosts } from "@/lib/services/posts";



interface ProfilePostsValues{
    userPosts:UserPosts[]
}

export default async function ProfilePosts({userPosts}:ProfilePostsValues){
    
    return(
        <div className="flex flex-col gap-2 p-2">
            <h2 className="text-grey1 text-[1.7rem]">Posts</h2>
            {userPosts.length === 0 ? <EmptyPosts/> : 
            (<div className="grid grid-cols-1 md:grid-cols-2">
                {userPosts.map(post =>{
                    return(
                        <Post key={post.id} postInfos={post}/>
                    )
                })}        
            </div>)
            }
        </div>
    )
}