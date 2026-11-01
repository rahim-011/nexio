import EditBio from "@/components/SettingsComponents/EditBio";
import EditProfileTitle from "@/components/SettingsComponents/EditProfileTitle";

export default function EditProfile() {
    return (
        <main className="flex h-full min-h-0 min-w-0 flex-col gap-3 overflow-hidden p-3 sm:gap-4 sm:p-4 lg:max-w-[80%]">
            <h1 className="my-2 shrink-0 text-2xl text-grey1 sm:my-3 sm:text-[1.8rem]">
                Edit Profile
            </h1>
            <EditProfileTitle />
            <EditBio />
        </main>
    );
}