'use client'

import { editProfileSchema } from "@/schemas/userSchema"
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import z from "zod"
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "@base-ui/react";



export type EditProfileFormValues = z.infer<typeof editProfileSchema>;

export default function EditProfileForm(){
    const [error,setError] = useState<string>('');
    
    const form = useForm({
        resolver: zodResolver(editProfileSchema),
        defaultValues:{
            name:'',
            username:''
        }
    })
    const {formState:{isDirty,isSubmitting}} = form;
    const handleEditProfile = async(values:EditProfileFormValues) =>{
        try{

        }
        catch(error){

        }
    }
 



    {/*Import the editProfileSchema and work with it and make sure that the submit btn is here and its not related to the pfp */}
    return(
        <FormProvider {...form}>
            <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(handleEditProfile)}>
                <div className="flex flex-col gap-4">
                    <Controller
                    name="name"
                    control={form.control}
                    render={({field,fieldState})=>(
                        <Field>
                            <FieldLabel id="name" className="text-grey1 text-[1.2rem]">Name</FieldLabel>
                            <Input {...field} className="ring-0 focus-within:ring-0 text-grey7 rounded-lg p-3 bg-grey3 outline-none text-[1.1rem]"/>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-red-500 text-[1.1rem]"/>}
                        </Field>
                    )}/>
                    <Controller
                    name="username"
                    control={form.control}
                    render={({field,fieldState})=>(
                        <Field>
                            <FieldLabel id="name" className="text-grey1 text-[1.2rem]">Username</FieldLabel>
                            <Input {...field} className="ring-0 focus-within:ring-0 text-grey7 rounded-lg p-3 bg-grey3 outline-none text-[1.1rem]"/>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-red-500 text-[1.1rem]"/>}
                        </Field>
                    )}/>
                </div>
                <button className="text-grey1 text-center rounded-lg bg-primary5 hover:brightness-115 transition-all cursor-pointer px-6 py-3 mt-5">Submit</button>
            </form>
        </FormProvider>
        
    )
}