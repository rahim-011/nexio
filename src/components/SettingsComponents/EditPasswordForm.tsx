'use client'


import { editPasswordSchema } from "@/schemas/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "@base-ui/react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";



export type EditPasswordFormValues = z.infer<typeof editPasswordSchema>;


export default function EditPasswordForm(){
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);    
    const form = useForm({
        resolver: zodResolver(editPasswordSchema),
        defaultValues:{
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: ''
        }
    })

    const {formState:{isDirty,isSubmitting}} = form;



    const handleEditPassword = async(values:EditPasswordFormValues) =>{
        try{

        }
        catch(error){

        }
    }

    {/*Complete the controller and get the styling of them from the other forms */}
    return(
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(handleEditPassword)} className="flex flex-col gap-3">
                    <Controller
                    name="currentPassword"
                    control={form.control}
                    render={({field,fieldState})=>(
                        <Field>
                            <FieldLabel className="text-grey1 text-[1.2rem]">Current Password</FieldLabel>
                            <div className="relative">
                                <Input
                                    {...field}
                                    className={`ring-0 focus-within:ring-0 text-grey7 rounded-lg p-3 bg-grey3 outline-none text-[1.1rem] w-full border ${fieldState.invalid ? 'border-red-500' : ''}`}
                                    type={showCurrent? "text" : "password"}
                                />

                                {!showCurrent? (
                                    <EyeOff
                                        className="absolute text-grey6 top-1/2 -translate-y-1/2 right-3 cursor-pointer"
                                        size={22}
                                        onClick={() => setShowCurrent(prev => !prev)}
                                    />
                                ) : (
                                    <Eye
                                        size={22}
                                        onClick={() => setShowCurrent(prev => !prev)}
                                        className="absolute text-grey6 top-1/2 -translate-y-1/2 right-3 cursor-pointer"
                                    />
                                )}
                            </div>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-red-500 text-[1.1rem]"/>}
                        </Field>
                    )}/>
                    <Controller
                    name="newPassword"
                    control={form.control}
                    render={({field,fieldState})=>(
                        <Field>
                            <FieldLabel className="text-grey1 text-[1.2rem]">New Password</FieldLabel>
                            <div className="relative">
                                <Input
                                    {...field}
                                    className={`ring-0 focus-within:ring-0 text-grey7 rounded-lg p-3 bg-grey3 outline-none text-[1.1rem] w-full border ${fieldState.invalid ? 'border-red-500' : ''}`}
                                    type={showNew ? "text" : "password"}
                                />

                                {!showNew ? (
                                    <EyeOff
                                        className="absolute text-grey6 top-1/2 -translate-y-1/2 right-3 cursor-pointer"
                                        size={22}
                                        onClick={() => setShowNew(prev => !prev)}
                                    />
                                ) : (
                                    <Eye
                                        size={22}
                                        onClick={() => setShowNew(prev => !prev)}
                                        className="absolute text-grey6 top-1/2 -translate-y-1/2 right-3 cursor-pointer"
                                    />
                                )}
                            </div>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-red-500 text-[1.1rem]"/>}
                        </Field>
                    )}/>
                    <Controller
                    name="confirmNewPassword"
                    control={form.control}
                    render={({field,fieldState})=>(
                        <Field>
                            <FieldLabel className="text-grey1 text-[1.2rem]">Confirm Password</FieldLabel>
                             <div className="relative">
                                <Input
                                    {...field}
                                    className={`ring-0 focus-within:ring-0 text-grey7 rounded-lg p-3 bg-grey3 outline-none text-[1.1rem] w-full border ${fieldState.invalid ? 'border-red-500' : ''}`}
                                    type={showNew ? "text" : "password"}
                                />

                                {!showConfirm ? (
                                    <EyeOff
                                        className="absolute text-grey6 top-1/2 -translate-y-1/2 right-3 cursor-pointer"
                                        size={22}
                                        onClick={() => setShowNew(prev => !prev)}
                                    />
                                ) : (
                                    <Eye
                                        size={22}
                                        onClick={() => setShowConfirm(prev => !prev)}
                                        className="absolute text-grey6 top-1/2 -translate-y-1/2 right-3 cursor-pointer"
                                    />
                                )}
                            </div>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-[1.1rem] text-red-500"/>}
                        </Field>
                    )}/>
                    <button className="text-grey1 text-center px-6 py-3 rounded-lg bg-primary5 hover:brightness-115 transition-all cursor-pointer mt-3 lg:max-w-[40%] text-[1.1rem] font-semibold">Save</button>
                </form>
            </FormProvider>
    )
}