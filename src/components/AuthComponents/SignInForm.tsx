'use client'


import { signInSchema, signUpSchema } from "@/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Field,FieldLabel,FieldError } from "../ui/field";
import { Input } from "@base-ui/react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Eye,EyeOff } from "lucide-react";
import z from "zod";
import Link from "next/link";



export type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInForm(){
    const [showPass,setShowPass] = useState<boolean>(false);
    const form = useForm({
        resolver: zodResolver(signInSchema),
        defaultValues:{
            email: '',
            password: ''
        }
    })
    const {formState: {isDirty,isSubmitting,errors}} = form;

    const onSubmit = (values: SignInFormValues) =>{
        try{

        }
        catch(error){

        }
    }
    
    return(
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
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
                <Controller
                    name="password"
                    control={form.control}
                    render={({field,fieldState})=>(
                        <Field>
                            <FieldLabel className="text-grey1 text-[1.2rem]">Password</FieldLabel>
                            <div className="relative flex flex-col gap-2">
                                <Input
                                    {...field}
                                    className={`ring-0 focus-within:ring-0 text-grey7 rounded-lg p-3 bg-grey3 outline-none text-[1.1rem] w-full border ${fieldState.invalid ? 'border-red-500' : ''}`}
                                    type={showPass ? "text" : "password"}
                                />

                                {!showPass? (
                                    <EyeOff
                                        className="absolute text-grey6 top-1/2 -translate-y-1/2 right-3 cursor-pointer"
                                        size={22}
                                        onClick={() => setShowPass(prev => !prev)}
                                    />
                                ) : (
                                    <Eye
                                        size={22}
                                        onClick={() => setShowPass(prev => !prev)}
                                        className="absolute text-grey6 top-1/2 -translate-y-1/2 right-3 cursor-pointer"
                                    />
                                )}
                                {!errors.password && <Link href="/reset-password" className="text-error3 hover:brightness-110 underline cursor-pointer self-end">Forget password?</Link>}
                            </div>
                            {errors.password && <div className="flex items-center justify-between">
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-red-500 text-[1.1rem]"/>}
                                <Link href="/reset-password" className="text-error3 hover:brightness-110 underline cursor-pointer">Forget password?</Link>
                            </div>}
                            
                        </Field>
                    )}/>
                <button className="text-grey1 text-center bg-primary5 hover:brightness-115 cursor-pointer px-6 py-3 rounded-lg text-[1.1rem] mt-4 transition-all">Login</button>
            </form>
        </FormProvider>
        
    )
}



