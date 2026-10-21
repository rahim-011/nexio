
import ProfilePosts from "@/components/ProfileComponents/ProfilePosts";
import ProfileTitle from "@/components/ProfileComponents/ProfileTitle";
import { getUserPosts } from "@/lib/services/posts";
import { User } from "@prisma/client";



export default async function Profile({params}:{params:Promise<{username:User['username']}>}){
    const {username} = await params;
    if (!username){
        return null
    };
    const userPostsRes = await getUserPosts(username);
    if (!userPostsRes.success){
        return null
    };
    const userPosts = userPostsRes.userPosts ?? [];
    return(
        <main className="flex flex-col gap-2">
            <ProfileTitle/>
            <ProfilePosts userPosts={userPosts}/>
        </main>
    )
}