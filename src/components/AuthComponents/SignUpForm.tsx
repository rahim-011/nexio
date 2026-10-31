'use client'

import { signUpSchema } from "@/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Field,FieldLabel,FieldError } from "../ui/field";
import { Input } from "@base-ui/react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Eye,EyeOff } from "lucide-react";
import z from "zod";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../LoadingSpinner";

export type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpForm(){
    const [errMsg,setErrMsg] = useState<string | null>(null)
    const [showPass,setShowPass] = useState<boolean>(false);
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(signUpSchema),
        defaultValues:{
            username: '',
            email: '',
            password: ''
        }
    })
    const {formState: {isDirty,isSubmitting}} = form;

    const onSubmit = async(values: SignUpFormValues) =>{
        try{
            setErrMsg(null);
            const {username,email,password} = values;
            const {error} = await authClient.signUp.email({
                email: email,
                password: password,
                username: username,
                name: ''
            } as any)
            console.log(error)
            if (error && error.message){
                setErrMsg(error.message);
                return;
            }

            toast.success("Account created successfully!", {
                description: "Welcome to Nexio! You're all set.",
            });
            router.push('/messages',{scroll:false})
        }
        catch(error){
            toast.error('Something went wrong, Please try again');
        }
    }

    return(
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2 sm:gap-3">
                <Controller
                    name="username"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel className="text-grey1 text-sm sm:text-[1.2rem]">
                                Username
                            </FieldLabel>

                            <Input
                                {...field}
                                className={`ring-0 focus-within:ring-0 text-grey7 rounded-lg px-3 py-0 bg-grey3 outline-none text-sm sm:text-[1.1rem] w-full h-10 sm:h-12 border ${
                                    fieldState.invalid
                                        ? "border-red-500"
                                        : "border-transparent"
                                }`}
                            />

                            {fieldState.invalid && (
                                <FieldError
                                    errors={[fieldState.error]}
                                    className="text-xs sm:text-[1.1rem] text-red-500"
                                />
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel className="text-grey1 text-sm sm:text-[1.2rem]">
                                Email
                            </FieldLabel>

                            <Input
                                {...field}
                                className={`ring-0 focus-within:ring-0 text-grey7 rounded-lg px-3 py-0 bg-grey3 outline-none text-sm sm:text-[1.1rem] w-full h-10 sm:h-12 border ${
                                    fieldState.invalid
                                        ? "border-red-500"
                                        : "border-transparent"
                                }`}
                            />

                            {fieldState.invalid && (
                                <FieldError
                                    errors={[fieldState.error]}
                                    className="text-xs sm:text-[1.1rem] text-red-500"
                                />
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="password"
                    control={form.control}
                    render={({field,fieldState})=>(
                        <Field>
                            <FieldLabel className="text-grey1 text-sm sm:text-[1.2rem]">Password</FieldLabel>
                            <div className="relative w-full">
                                <Input
                                    {...field}
                                    className={`ring-0 focus-within:ring-0 text-grey7 rounded-lg pl-3 pr-11 py-0 bg-grey3 outline-none text-sm sm:text-[1.1rem] w-full h-10 sm:h-12 border ${fieldState.invalid ? 'border-red-500' : 'border-transparent'}`}
                                    type={showPass ? "text" : "password"}
                                />

                                {!showPass? (
                                    <EyeOff
                                        className="absolute text-grey6 top-1/2 -translate-y-1/2 right-3 cursor-pointer"
                                        size={20}
                                        onClick={() => setShowPass(prev => !prev)}
                                    />
                                ) : (
                                    <Eye
                                        size={20}
                                        onClick={() => setShowPass(prev => !prev)}
                                        className="absolute text-grey6 top-1/2 -translate-y-1/2 right-3 cursor-pointer"
                                    />
                                )}
                            </div>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-red-500 text-xs sm:text-[1.1rem]"/>}
                        </Field>
                    )}/>
                <button disabled={!isDirty || isSubmitting} className={`flex items-center justify-center text-grey1 text-center bg-primary5 hover:brightness-115 cursor-pointer px-5 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-[1.1rem] mt-1 sm:mt-3 transition-all ${!isDirty ? 'opacity-70' : ''}`}>{isSubmitting ? <LoadingSpinner/> : 'Sign Up'}</button>
                {errMsg && <p className="text-red-500 text-xs sm:text-[1rem]">{errMsg}</p>}
            </form>
        </FormProvider>

    )
}