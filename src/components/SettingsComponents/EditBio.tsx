'use client'

import { bioSchema } from "@/schemas/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Field, FieldLabel } from "../ui/field";

export type BioValue = z.infer<typeof bioSchema>;

export default function EditBio(){
    const form = useForm({
        resolver: zodResolver(bioSchema),
        defaultValues:{
            bio: ''
        }
    })

    const {formState:{isDirty,isSubmitting}, watch} = form;
    const bioValue = watch("bio") || "";

    return(
        <div className="flex flex-col gap-3 mt-4 lg:max-w-[70%]">
            <h3 className="text-white text-[1.4rem] font-medium">Bio</h3>
            <div className="">
                <Controller 
                control={form.control}
                name="bio"
                render={({field,fieldState})=>(
                    <Field className="relative flex flex-col">
                        <FieldLabel htmlFor="bio" className="absolute"></FieldLabel>
                        <div className="relative w-full">
                            <textarea 
                                {...field} 
                                maxLength={160}
                                rows={5}
                                placeholder="Bio"
                                className="w-full bg-[#0b192c] text-white text-[1.1rem] p-4 rounded-xl border border-blue-900/50 focus:outline-none focus:border-blue-500 resize-none placeholder:text-gray-500"
                            />
                            <span className="absolute bottom-3 right-4 text-xs text-gray-500">
                                {bioValue.length}/160
                            </span>
                        </div>
                    </Field>
                )}/>
            </div>
            <button className="w-full bg-primary5 text-white text-[1.1rem] font-medium rounded-xl px-6 py-2.5 hover:brightness-110 transition-all cursor-pointer">Save</button>
        </div>
    )
}