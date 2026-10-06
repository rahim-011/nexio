import EditBio from "@/components/SettingsComponents/EditBio";
import EditProfileTitle from "@/components/SettingsComponents/EditProfileTitle";




export default function EditProfile(){
    return(
        <main className="flex flex-col gap-3 p-3">
            <h1 className="text-[1.8rem] text-grey1">Edit Profile</h1>
            <EditProfileTitle/>
            <EditBio/>
        </main>
    )
}