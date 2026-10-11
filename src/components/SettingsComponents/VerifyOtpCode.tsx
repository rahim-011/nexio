import { otpCodeSchema } from "@/schemas/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "@base-ui/react";




export type OtpCodeValue = z.infer<typeof otpCodeSchema>;

export default function VerifyOtpCode(){

    const form  = useForm({
        resolver: zodResolver(otpCodeSchema),
        defaultValues:{
            otpCode: ''
        }
    })

    const {formState:{isDirty,isSubmitting}} = form;
    

    const onSubmit = () => {
        try{
            
        }
        catch(error){

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
                <button className="rounded-lg text-grey1 text-center px-6 py-3 bg-primary5 hover:brightness-110 transition-all cursor-pointer">Verify</button>
            </form>
        </FormProvider>
    )
}