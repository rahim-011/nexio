'use client'

import { editEmailSchema } from "@/schemas/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "@base-ui/react";
import { useState } from "react";
import VerifyEmailModel from "./VerifyEmailModel";
import Overlay from "../Overlay";
import { useUserStore } from "@/lib/store/userStore";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import LoadingSpinner from "../LoadingSpinner";

export type EditEmailValue = z.infer<typeof editEmailSchema>;

export default function EditEmailForm() {
    const [errMsg, setErrMsg] = useState<string | null>(null);
    const { cachedUserInfos } = useUserStore();
    const { email } = cachedUserInfos;
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const form = useForm<EditEmailValue>({
        resolver: zodResolver(editEmailSchema),
        defaultValues: {
            email: email || ''
        }
    });

    const { formState: { isDirty, isSubmitting } } = form;

    const handleEditEmail = async (value: EditEmailValue) => {
        try {
            const { error } = await authClient.emailOtp.sendVerificationOtp({
                email: value.email,
                type: 'email-verification'
            });

            if (error && error.message) {
                setErrMsg(error.message);
                return;
            }

            setIsOpen(true);
        } catch (error) {
            toast.error('Something went wrong, please try again.');
        }
    };

    return (
        <>
            <FormProvider {...form}>
                <form
                    className="mb-4 flex flex-col gap-2 sm:mb-5"
                    onSubmit={form.handleSubmit(handleEditEmail)}
                >
                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel className="text-base text-grey1 sm:text-[1.2rem]">
                                    Email
                                </FieldLabel>

                                <Input
                                    {...field}
                                    className={`h-10 w-full rounded-lg border bg-grey3 px-3 py-0 text-sm text-grey7 outline-none ring-0 focus-within:ring-0 sm:h-12 sm:text-[1.1rem] ${
                                        fieldState.invalid
                                            ? "border-red-500"
                                            : "border-transparent"
                                    }`}
                                />

                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[fieldState.error]}
                                        className="text-sm text-red-500 sm:text-[1.1rem]"
                                    />
                                )}
                            </Field>
                        )}
                    />

                    <button
                        type="submit"
                        disabled={!isDirty || isSubmitting}
                        className={`${!isDirty ? 'opacity-80' : ''} mt-2 flex cursor-pointer items-center justify-center rounded-lg bg-primary5 px-5 py-2.5 text-center text-sm font-semibold text-grey1 transition-all hover:brightness-115 disabled:cursor-not-allowed disabled:opacity-50 sm:mt-3 sm:px-6 sm:py-3 sm:text-[1.1rem] lg:max-w-[40%]`}
                    >
                        {isSubmitting ? <LoadingSpinner /> : 'Submit'}
                    </button>

                    {errMsg && (
                        <p className="text-sm text-red-500 sm:text-[1rem]">
                            {errMsg}
                        </p>
                    )}
                </form>
            </FormProvider>

            {isOpen && (
                <>
                    <Overlay closeModel={() => setIsOpen(false)} />
                    <div className="fixed inset-0 z-[52] flex items-center justify-center px-3 sm:px-4">
                        <div className="w-full max-w-3xl">
                            <VerifyEmailModel
                                newEmail={form.getValues('email')}
                                onClose={() => setIsOpen(false)}
                            />
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
