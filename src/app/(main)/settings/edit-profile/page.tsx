import EditBio from "@/components/SettingsComponents/EditBio";

import EditProfileTitle from "@/components/SettingsComponents/EditProfileTitle";

export default function EditProfile() {
    return (
        <main className="flex flex-col gap- sm:gap-3 sm:p-3 p-4">
            <h1 className="text-2xl text-grey1 sm:text-[1.8rem] my-3">Edit Profile</h1>
            <EditProfileTitle />
            <EditBio />
        </main>
    );
}