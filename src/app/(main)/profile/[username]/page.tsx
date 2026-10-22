
import ProfilePosts from "@/components/ProfileComponents/ProfilePosts";
import ProfileTitle from "@/components/ProfileComponents/ProfileTitle";
import { getUserProfileInfos } from "@/lib/services/posts";
import { ProfileLabels } from "@/lib/types";
import { User } from "@prisma/client";



export default async function Profile({params}:{params:Promise<{username:User['username']}>}){
    const {username} = await params;
    if (!username){
        return null
    };
    const userProfileInfosRes = await getUserProfileInfos(username);
    if (!userProfileInfosRes.success || !userProfileInfosRes.userProfileInfos){
        return null
    };
    const userPosts = userProfileInfosRes.userProfileInfos.posts ?? [];
    const userInfos = {
        userId: userProfileInfosRes.userProfileInfos.id,
        username: userProfileInfosRes.userProfileInfos.username,
        name: userProfileInfosRes.userProfileInfos.name,
        avatar: userProfileInfosRes.userProfileInfos.image,
        profileLabel: userProfileInfosRes.userProfileInfos.profileLabel as ProfileLabels,
        friendsIds: userProfileInfosRes.userProfileInfos.friendsIds,
        bio: userProfileInfosRes.userProfileInfos.bio,
        totalPosts: userProfileInfosRes.userProfileInfos.posts.length
    }
    return(
        <main className="flex flex-col gap-2">
            <ProfileTitle userInfos={userInfos}/>
            <ProfilePosts userPosts={userPosts} username={username}/>
        </main>
    )
}