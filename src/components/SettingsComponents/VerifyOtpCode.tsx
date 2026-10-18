import { otpCodeSchema } from "@/schemas/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, useForm } from "react-hook-form";
import z, { set } from "zod";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "@base-ui/react";
import LoadingSpinner from "../LoadingSpinner";
import { toast } from "sonner";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { changeUserEmail } from "@/lib/services/user";
import { EditEmailValue } from "./EditEmailForm";




export type OtpCodeValue = z.infer<typeof otpCodeSchema>;
interface VerifyOtpCodeProps{
    newEmail:  EditEmailValue['email']
    onClose: () => void,
}



export default function VerifyOtpCode({newEmail,onClose}:VerifyOtpCodeProps){
    const [errMsg,setErrMsg] = useState<string | null>(null);
    const form  = useForm({
        resolver: zodResolver(otpCodeSchema),
        defaultValues:{
            otpCode: ''
        }
    })

    const {formState:{isDirty,isSubmitting}} = form;
    

    const onSubmit = async(value:OtpCodeValue) => {
        try{
            setErrMsg('');
            const {error} = await authClient.emailOtp.verifyEmail({
                email:newEmail,
                otp:value.otpCode
            })
            if (error && error.message){
                setErrMsg(error.message);
                return;
            }
            try{
                const result = await changeUserEmail({email:newEmail});
                if (!result.success && result.error){
                    setErrMsg(result.error);
                    return;
                }
                toast.success('Email has been changed successfully.');
                form.reset();
            }
            catch(error){
                toast.error('Something went wrong, please try again.');
            }
            onClose();
        }
        catch(error){
            toast.error('Something went wrong, please try again.')
        }
    }
    return(
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <Controller
                control={form.control}
                name="otpCode"
                render={({field,fieldState})=>(
                    <Field>
                        <FieldLabel className="text-grey1 text-[1.2rem]"></FieldLabel>
                        <Input maxLength={6} placeholder="000000" {...field} className={`tracking-wider text-center ring-0 focus-within:ring-0 text-grey7 rounded-lg px-3 py-0 bg-grey3 outline-none text-[1.3rem] w-full h-12 border ${
                                        fieldState.invalid
                                            ? "border-red-500"
                                            : "border-transparent"
                                    }`}/>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-red-500 text-[1.1rem]"/>}
                    </Field>
                )}/>
                <button className={`flex items-center justify-center ${!isDirty ?  'opacity-80' : ''} rounded-lg text-grey1 text-center px-6 py-3 bg-primary5 hover:brightness-110 transition-all cursor-pointer`}>{isSubmitting ? <LoadingSpinner/> : 'Verify'}</button>
                {errMsg && <p className="text-red-500 text-[1rem]">{errMsg}</p>}
            </form>
        </FormProvider>
    )
}