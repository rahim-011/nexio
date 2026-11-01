'use client'

import { resetPasswordSchema } from "@/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "@base-ui/react";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import LoadingSpinner from "../LoadingSpinner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordForm() {
    const [email, setEmail] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [errMsg, setErrMsg] = useState<string | null>(null);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const router = useRouter();

    useEffect(() => {
        setEmail(sessionStorage.getItem("resetEmail") || "");
        setOtpCode(sessionStorage.getItem("resetOtp") || "");
    }, []);

    const form = useForm<ResetPasswordValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: '',
            confirmNewPassword: ''
        }
    });

    const { formState: { isDirty, isSubmitting } } = form;

    const handleResetPassword = async (values: ResetPasswordValues) => {
        try {
            setErrMsg(null);

            if (!email || !otpCode) {
                setErrMsg("Your reset session is invalid. Please request a new code.");
                return;
            }

            const { error } = await authClient.emailOtp.resetPassword({
                email,
                otp: otpCode,
                password: values.newPassword
            });

            if (error && error.message) {
                setErrMsg(error.message);
                return;
            }

            toast.success("Password reset successfully!");

            form.reset();

            sessionStorage.removeItem("resetEmail");
            sessionStorage.removeItem("resetOtp");

            router.push('/sign-in');

        } catch {
            toast.error("Something went wrong, please try again.");
        }
    };

    return (
        <FormProvider {...form}>
            <form
                onSubmit={form.handleSubmit(handleResetPassword)}
                className="flex w-full flex-col gap-4"
            >
                <Controller
                    name="newPassword"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel className="text-base text-grey1 sm:text-lg">
                                New Password
                            </FieldLabel>

                            <div className="relative">
                                <Input
                                    {...field}
                                    type={showNew ? "text" : "password"}
                                    className={`w-full rounded-lg border bg-grey3 p-3 pr-11 text-sm text-grey7 outline-none focus-within:ring-0 sm:text-base ${
                                        fieldState.invalid ? "border-red-500" : ""
                                    }`}
                                />

                                {showNew ? (
                                    <Eye
                                        size={19}
                                        onClick={() => setShowNew(false)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-grey6"
                                    />
                                ) : (
                                    <EyeOff
                                        size={19}
                                        onClick={() => setShowNew(true)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-grey6"
                                    />
                                )}
                            </div>

                            {fieldState.invalid && (
                                <FieldError
                                    errors={[fieldState.error]}
                                    className="text-sm text-red-500"
                                />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="confirmNewPassword"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel className="text-base text-grey1 sm:text-lg">
                                Confirm New Password
                            </FieldLabel>

                            <div className="relative">
                                <Input
                                    {...field}
                                    type={showConfirm ? "text" : "password"}
                                    className={`w-full rounded-lg border bg-grey3 p-3 pr-11 text-sm text-grey7 outline-none focus-within:ring-0 sm:text-base ${
                                        fieldState.invalid ? "border-red-500" : ""
                                    }`}
                                />

                                {showConfirm ? (
                                    <Eye
                                        size={19}
                                        onClick={() => setShowConfirm(false)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-grey6"
                                    />
                                ) : (
                                    <EyeOff
                                        size={19}
                                        onClick={() => setShowConfirm(true)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-grey6"
                                    />
                                )}
                            </div>

                            {fieldState.invalid && (
                                <FieldError
                                    errors={[fieldState.error]}
                                    className="text-sm text-red-500"
                                />
                            )}
                        </Field>
                    )}
                />

                {errMsg && (
                    <p className="text-sm text-red-500">{errMsg}</p>
                )}

                <button
                    type="submit"
                    disabled={!isDirty || isSubmitting || !email || !otpCode}
                    className="mt-2 flex w-full cursor-pointer items-center justify-center rounded-lg bg-primary5 px-5 py-3 text-sm font-semibold text-grey1 transition-all hover:brightness-115 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
                >
                    {isSubmitting ? <LoadingSpinner /> : "Reset Password"}
                </button>
            </form>
        </FormProvider>
    );
}