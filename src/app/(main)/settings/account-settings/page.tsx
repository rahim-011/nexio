import EditEmailForm from "@/components/SettingsComponents/EditEmailForm";
import EditPasswordForm from "@/components/SettingsComponents/EditPasswordForm";




export default function AccountSettings(){
    return(
        <main className="flex flex-col gap-8 p-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl text-grey1">Account Settings</h1>
                <p className="text-grey4 text-[1rem]">Manage your login credentials and security</p>
            </div>
            <EditEmailForm/>
            <EditPasswordForm/>
        </main>
    )
}