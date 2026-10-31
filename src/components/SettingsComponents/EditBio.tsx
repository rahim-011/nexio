'use client'


import { bioSchema } from "@/schemas/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { Field, FieldLabel } from "../ui/field";
import { useUserStore } from "@/lib/store/userStore";
import { toast } from "sonner";
import { changeUserBio } from "@/lib/services/user";
import { useState } from "react";
import LoadingSpinner from "../LoadingSpinner";

export type BioValue = z.infer<typeof bioSchema>;

export default function EditBio() {
    const [errMsg, setErrMsg] = useState<string | null>(null);
    const { cachedUserInfos, updateUserInfos } = useUserStore();
    const { bio } = cachedUserInfos;

    const form = useForm<BioValue>({
        resolver: zodResolver(bioSchema),
        defaultValues: {
            bio: bio || ''
        }
    });

    const { formState: { isDirty, isSubmitting }, watch } = form;
    const bioValue = watch("bio") || "";

    const handleChangeBio = async (value: BioValue) => {
        try {
            setErrMsg('');
            const response = await changeUserBio(value);

            if (!response.success && response.error) {
                setErrMsg(response.error);
                return;
            }

            form.reset();
            updateUserInfos({ bio: value.bio });
            toast.success(response.message);
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="mt-3 flex flex-col gap-2 lg:mt-4 lg:max-w-[70%]">
            <h3 className="text-lg font-medium text-white sm:text-[1.4rem]">Bio</h3>

            <FormProvider {...form}>
                <form className="flex flex-col" onSubmit={form.handleSubmit(handleChangeBio)}>
                    <Controller
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <Field className="relative flex flex-col">
                                <FieldLabel htmlFor="bio" className="absolute"></FieldLabel>
                                <div className="relative w-full">
                                    <textarea
                                        {...field}
                                        maxLength={160}
                                        rows={5}
                                        placeholder="Bio"
                                        className="w-full resize-none rounded-xl border border-blue-900/50 bg-[#0b192c] p-3 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:outline-none sm:p-4 sm:text-[1.1rem]"
                                    />
                                    <span className="absolute bottom-3 right-3 text-[10px] text-gray-500 sm:right-4 sm:text-xs">
                                        {bioValue.length}/160
                                    </span>
                                </div>
                            </Field>
                        )}
                    />

                    {errMsg && <p className="text-xs text-red-500 sm:text-sm">{errMsg}</p>}

                    <button
                        disabled={!isDirty || isSubmitting}
                        className={`flex w-full cursor-pointer items-center justify-center rounded-xl bg-primary5 px-4 py-2 text-sm font-medium text-white transition-all hover:brightness-110 sm:px-6 sm:py-2.5 sm:text-[1.1rem] ${!isDirty ? 'opacity-70' : ''}`}
                    >
                        {isSubmitting ? <LoadingSpinner /> : 'Save'}
                    </button>
                </form>
            </FormProvider>
        </div>
        );
}