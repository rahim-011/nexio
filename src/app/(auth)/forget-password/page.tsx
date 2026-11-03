"use client";

import AuthOverlay from "@/components/AuthComponents/AuthOverlay";
import EditEmailForm from "@/components/SettingsComponents/EditEmailForm";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
    const router = useRouter();

    return (
        <main className="flex min-h-screen items-center justify-center p-6">
            <AuthOverlay />
            <div className="flex flex-col gap-4 rounded-lg bg-primary9 p-7">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex w-fit items-center gap-2 text-grey4 transition hover:text-grey1 cursor-pointer"
                >
                    <ArrowLeft size={22} />
                </button>

                <div className="mb-5 flex max-w-2xl flex-col items-center gap-1">
                    <h1 className="text-3xl font-semibold text-grey1">
                        Forgot your password?
                    </h1>
                    <p className="text-center text-[1.1rem] text-grey4">
                        Don't worry, it happens. Enter your email address and we'll send you a code to reset your password.
                    </p>
                </div>

                <EditEmailForm action="reset-password" />
            </div>
        </main>
    );
}