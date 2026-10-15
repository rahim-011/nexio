'use client'


import { signInSchema } from "@/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Field,FieldLabel,FieldError } from "../ui/field";
import { Input } from "@base-ui/react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Eye,EyeOff } from "lucide-react";
import z from "zod";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import LoadingSpinner from "../LoadingSpinner";



export type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInForm(){
    const [showPass,setShowPass] = useState<boolean>(false);
    const [errMsg,setErrMsg] = useState<string | null>('');
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(signInSchema),
        defaultValues:{
            email: '',
            password: ''
        }
    })
    const {formState: {isDirty,isSubmitting,errors}} = form;

    const onSubmit = async (values: SignInFormValues) =>{
        try{
            setErrMsg(null);
            const {email,password} = values;
            const {error} = await authClient.signIn.email({
                email:email,
                password:password
            })
            if (error && error.message){
                setErrMsg(error.message);
                return;
            }
            router.push('/messages',{scroll:false})
            toast.success('Welcome back!')
        }
        catch(error){
            toast.error('Somthing went wrong, please try again.')
            return;
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
                                        className="absolute text-grey6 top-1/3 -translate-y-1/2 right-3 cursor-pointer"
                                        size={22}
                                        onClick={() => setShowPass(prev => !prev)}
                                    />
                                ) : (
                                    <Eye
                                        size={22}
                                        onClick={() => setShowPass(prev => !prev)}
                                        className="absolute text-grey6 top-1/3 -translate-y-1/2 right-3 cursor-pointer"
                                    />
                                )}
                                {!errors.password && <Link href="/forget-password" className="text-error3 hover:brightness-110 underline cursor-pointer self-end">Forget password?</Link>}
                            </div>
                            {errors.password && <div className="flex items-center justify-between">
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-red-500 text-[1.1rem]"/>}
                                <Link href="/reset-password" className="text-error3 hover:brightness-110 underline cursor-pointer">Forget password?</Link>
                            </div>}
                            
                        </Field>
                    )}/>
                <button disabled={!isDirty || isSubmitting} className={`flex items-center justify-center text-grey1 text-center bg-primary5 hover:brightness-115 cursor-pointer px-6 py-3 rounded-lg text-[1.1rem] mt-3 transition-all ${!isDirty ? 'opacity-70' : ''}`}>{isSubmitting ? <LoadingSpinner/>  : 'Login'}</button>
                {errMsg && <p className="text-red-500 text-[1rem] text-center self-center justify-self-center">{errMsg}</p>}
            </form>
        </FormProvider>
        
    )
}



