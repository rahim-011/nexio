import AuthOverlay from "@/components/AuthComponents/AuthOverlay";
import EditEmailForm from "@/components/SettingsComponents/EditEmailForm";




export default function ForgotPassword(){
    return(
        <main className="flex p-6 justify-center items-center min-h-screen">
            <AuthOverlay/>
            <div className="bg-primary9 flex flex-col gap-4 p-7 rounded-lg">
                <div className="flex flex-col gap-1 mb-5 items-center max-w-2xl">
                    <h1 className="text-grey1 text-3xl font-semibold">Frogot your password?</h1>
                    <p className="text-grey4 text-[1.1rem] text-center">Don't worry, it happens. Enter your email address and we'll send you a code to reset your password.</p>
                </div>
                <EditEmailForm action={'reset-password'}/>
            </div>
        </main>
    )
}