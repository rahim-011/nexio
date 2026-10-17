
import ProfilePosts from "@/components/ProfileComponents/ProfilePosts";
import ProfileTitle from "@/components/ProfileComponents/ProfileTitle";



export default async function Profile(){
    return(
        <main className="flex flex-col gap-2">
            <ProfileTitle/>
            <ProfilePosts/>
        </main>
    )
}