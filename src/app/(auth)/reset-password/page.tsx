import ResetPasswordForm from "@/components/SettingsComponents/ResetPasswordForm";

export default async function ResetPasswordPage() {
    return (
        <main className="flex min-h-[calc(100dvh-64px)] items-center justify-center px-4 py-8 sm:px-8">
            <div className="w-full max-w-md rounded-2xl border border-primary5 bg-primary8 p-5 shadow-xl sm:p-8">
                <div className="mb-7 flex flex-col gap-2">
                    <h1 className="text-2xl font-semibold text-grey1 sm:text-3xl">
                        Reset Password
                    </h1>

                    <p className="text-sm leading-relaxed text-grey4 sm:text-base">
                        Create a new password for your Nexio account.
                    </p>
                </div>
                <ResetPasswordForm/>
            </div>
        </main>
    );
}