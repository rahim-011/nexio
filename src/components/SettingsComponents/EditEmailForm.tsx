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

export type EditEmailValue = z.infer<typeof editEmailSchema>;

export default function EditEmailForm() {
    const {cachedUserInfos} = useUserStore();
    const {email}  = cachedUserInfos;
    const [isOpen,setIsOpen] = useState<boolean>(false);
    const form = useForm<EditEmailValue>({
        resolver: zodResolver(editEmailSchema),
        defaultValues: {
            email: email || ''
        }
    });

    const { formState: { isDirty, isSubmitting } } = form;

    const handleEditEmail = async (value: EditEmailValue) => {
        try {
        } catch (error) {
        }
    };

    return (
        <>
            <FormProvider {...form}>
                <form
                    className="flex flex-col gap-2 mb-5"
                    onSubmit={form.handleSubmit(handleEditEmail)}
                >
                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel className="text-grey1 text-[1.2rem]">
                                    Email
                                </FieldLabel>

                                <Input
                                    {...field}
                                    className={`ring-0 focus-within:ring-0 text-grey7 rounded-lg px-3 py-0 bg-grey3 outline-none text-[1.1rem] w-full h-12 border ${
                                        fieldState.invalid
                                            ? "border-red-500"
                                            : "border-transparent"
                                    }`}
                                />

                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[fieldState.error]}
                                        className="text-[1.1rem] text-red-500"
                                    />
                                )}
                            </Field>
                        )}
                    />

                    <button
                        onClick={()=>setIsOpen(true)}
                        type="submit"
                        disabled={!isDirty || isSubmitting}
                        className="text-grey1 text-center px-6 py-3 rounded-lg bg-primary5 hover:brightness-115 transition-all cursor-pointer mt-3 lg:max-w-[40%] text-[1.1rem] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Submit
                    </button>
                </form>
            </FormProvider>
            {isOpen && 
                <>
                    <Overlay closeModel={()=>setIsOpen(false)}/>
                        <div className="fixed inset-0 max-w-3xl top-1/2 z-[52]">
                            <VerifyEmailModel email={email}/>
                        </div>

                </>

            }
        </>
        
    );
}