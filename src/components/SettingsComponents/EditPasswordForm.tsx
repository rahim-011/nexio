'use client'

import { editPasswordSchema } from "@/schemas/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "@base-ui/react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import LoadingSpinner from "../LoadingSpinner";

export type EditPasswordFormValues = z.infer<typeof editPasswordSchema>;

export default function EditPasswordForm() {
    const [errMsg, setErrMsg] = useState<string | null>(null);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const form = useForm<EditPasswordFormValues>({
        resolver: zodResolver(editPasswordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: ''
        }
    });

    const { formState: { isDirty, isSubmitting } } = form;

    const handleEditPassword = async (values: EditPasswordFormValues) => {
        try {
            setErrMsg('');
            const { currentPassword, newPassword } = values;

            const { error } = await authClient.changePassword({
                currentPassword,
                newPassword,
                revokeOtherSessions: true
            });

            if (error && error.message) {
                setErrMsg(error.message);
                return;
            }

            form.reset();
            toast.success('Password has changed successfully!');
        } catch (error) {
            toast.error('Something went wrong, please try again');
        }
    };

    return (
        <FormProvider {...form}>
            <form
                onSubmit={form.handleSubmit(handleEditPassword)}
                className="flex flex-col gap-2.5 sm:gap-3"
            >
                <Controller
                    name="currentPassword"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel className="text-base text-grey1 sm:text-[1.2rem]">
                                Current Password
                            </FieldLabel>

                            <div className="relative">
                                <Input
                                    {...field}
                                    className={`w-full rounded-lg border bg-grey3 p-2.5 pr-10 text-sm text-grey7 outline-none ring-0 focus-within:ring-0 sm:p-3 sm:pr-11 sm:text-[1.1rem] ${
                                        fieldState.invalid ? 'border-red-500' : ''
                                    }`}
                                    type={showCurrent ? "text" : "password"}
                                />

                                {!showCurrent ? (
                                    <EyeOff
                                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-grey6"
                                        size={19}
                                        onClick={() => setShowCurrent(prev => !prev)}
                                    />
                                ) : (
                                    <Eye
                                        size={19}
                                        onClick={() => setShowCurrent(prev => !prev)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-grey6"
                                    />
                                )}
                            </div>

                            {fieldState.invalid && (
                                <FieldError
                                    errors={[fieldState.error]}
                                    className="text-sm text-red-500 sm:text-[1.1rem]"
                                />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="newPassword"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel className="text-base text-grey1 sm:text-[1.2rem]">
                                New Password
                            </FieldLabel>

                            <div className="relative">
                                <Input
                                    {...field}
                                    className={`w-full rounded-lg border bg-grey3 p-2.5 pr-10 text-sm text-grey7 outline-none ring-0 focus-within:ring-0 sm:p-3 sm:pr-11 sm:text-[1.1rem] ${
                                        fieldState.invalid ? 'border-red-500' : ''
                                    }`}
                                    type={showNew ? "text" : "password"}
                                />

                                {!showNew ? (
                                    <EyeOff
                                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-grey6"
                                        size={19}
                                        onClick={() => setShowNew(prev => !prev)}
                                    />
                                ) : (
                                    <Eye
                                        size={19}
                                        onClick={() => setShowNew(prev => !prev)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-grey6"
                                    />
                                )}
                            </div>

                            {fieldState.invalid && (
                                <FieldError
                                    errors={[fieldState.error]}
                                    className="text-sm text-red-500 sm:text-[1.1rem]"
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
                            <FieldLabel className="text-base text-grey1 sm:text-[1.2rem]">
                                Confirm Password
                            </FieldLabel>

                            <div className="relative">
                                <Input
                                    {...field}
                                    className={`w-full rounded-lg border bg-grey3 p-2.5 pr-10 text-sm text-grey7 outline-none ring-0 focus-within:ring-0 sm:p-3 sm:pr-11 sm:text-[1.1rem] ${
                                        fieldState.invalid ? 'border-red-500' : ''
                                    }`}
                                    type={showConfirm ? "text" : "password"}
                                />

                                {!showConfirm ? (
                                    <EyeOff
                                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-grey6"
                                        size={19}
                                        onClick={() => setShowConfirm(prev => !prev)}
                                    />
                                ) : (
                                    <Eye
                                        size={19}
                                        onClick={() => setShowConfirm(prev => !prev)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-grey6"
                                    />
                                )}
                            </div>

                            {fieldState.invalid && (
                                <FieldError
                                    errors={[fieldState.error]}
                                    className="text-sm text-red-500 sm:text-[1.1rem]"
                                />
                            )}
                        </Field>
                    )}
                />

                {errMsg && (
                    <p className="text-sm text-red-500 sm:text-base">{errMsg}</p>
                )}

                <button
                    type="submit"
                    disabled={!isDirty || isSubmitting}
                    className={`mt-2 flex cursor-pointer items-center justify-center rounded-lg bg-primary5 px-5 py-2.5 text-center text-sm font-semibold text-grey1 transition-all hover:brightness-115 disabled:cursor-not-allowed disabled:opacity-50 sm:mt-3 sm:px-6 sm:py-3 sm:text-[1.1rem] lg:max-w-[40%] ${!isDirty ? 'opacity-80' : ''}`}
                >
                    {isSubmitting ? <LoadingSpinner /> : 'Save'}
                </button>
            </form>
        </FormProvider>
    );
}
