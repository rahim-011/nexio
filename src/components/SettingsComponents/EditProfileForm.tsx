'use client'

import { editProfileSchema } from "@/schemas/userSchema"
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import z from "zod"
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "@base-ui/react";
import { useUserStore } from "@/lib/store/userStore";
import { toast } from "sonner";
import { changeUserProfile } from "@/lib/services/user";
import LoadingSpinner from "../LoadingSpinner";



export type EditProfileFormValues = z.infer<typeof editProfileSchema>;

export default function EditProfileForm({onClose}:{onClose:()=>void}){
    const [errMsg,setErrMsg] = useState<string>('');
    const {cachedUserInfos,updateUserInfos} = useUserStore();
    const {name,username} = cachedUserInfos;
    const form = useForm<EditProfileFormValues>({
        resolver: zodResolver(editProfileSchema),
        defaultValues:{
            name: name || '',
            username: username || ''
        }
    })
    const {formState:{isDirty,isSubmitting}} = form;
    const handleEditProfile = async(values:EditProfileFormValues) =>{
        try{
            setErrMsg('');
            const response = await changeUserProfile(values);
            if (!response.success && response.error){
                setErrMsg(response.error);
                return;
            }
            updateUserInfos({name:values.name,username:values.username});
            toast.success(response.message);
            form.reset();
            onClose();
        }
        catch(error){
            toast.error('Somthing went wrong, please try again!')
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
                {errMsg && <p className="text-red-500">{errMsg}</p>}
                <button type="submit" disabled={!isDirty || isSubmitting} className={`${!isDirty ? 'opacity-80' : ''} text-grey1 text-center rounded-lg bg-primary5 hover:brightness-115 transition-all cursor-pointer px-6 py-3 mt-5 flex items-center justify-center`}>{isSubmitting ? <LoadingSpinner/> : 'Submit'}</button>
            </form>
        </FormProvider>
        
    )
}