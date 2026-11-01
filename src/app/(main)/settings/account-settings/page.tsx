import EditEmailForm from "@/components/SettingsComponents/EditEmailForm";
import EditPasswordForm from "@/components/SettingsComponents/EditPasswordForm";

export default function AccountSettings() {
    return (
        <main className="flex h-full min-h-0 min-w-0 flex-col gap-4 overflow-y-auto p-3 sm:gap-6 sm:p-4 lg:max-w-[70%] lg:gap-8 lg:p-6">
            <div className="flex shrink-0 flex-col gap-1">
                <h1 className="text-2xl text-grey1 sm:text-3xl">
                    Account Settings
                </h1>
                <p className="text-sm text-grey4 sm:text-base">
                    Manage your login credentials and security
                </p>
            </div>

            <EditEmailForm action={'reset-email'}/>
            <EditPasswordForm />
        </main>
    );
}