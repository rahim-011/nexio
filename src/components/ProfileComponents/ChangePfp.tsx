'use client'

import Image from "next/image";
import { Camera } from "lucide-react";
import { pfpSchema } from "@/schemas/userSchema";
import {useForm} from 'react-hook-form'
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {Input } from "@base-ui/react";
import {FieldError } from "../ui/field";
import React, { useEffect, useState } from "react";
import imageCompression from "browser-image-compression";
import { fileToBase64 } from "@/lib/utils";

export type PfpValue = z.infer<typeof pfpSchema>

export default function ChangePfp(){    
    const form = useForm({
        resolver: zodResolver(pfpSchema),
        defaultValues:{
            profileImage:''
        }
    })
    const {formState:{isDirty,isSubmitting}} = form;
    const currentPfp = form.watch('profileImage');


    const handleFileChange =  async (e: React.ChangeEvent<HTMLInputElement>) =>{
        const file = e.target.files?.[0];
        if (!file){
            return
        }
        try{
            const options = {
                maxSizeMB: 0.3, 
                maxWidthOrHeight: 400, 
                useWebWorker: true,
            };
            const compressedAvatar = await imageCompression(file,options);
            const fileString = await fileToBase64(compressedAvatar);
            form.setValue("profileImage",fileString,{
                shouldValidate:true,
                shouldDirty:true,
                shouldTouch:true
            })
        }
        catch(error){
            console.log('Error processing image:',error)
        }
    }

    const handleChangingPfp = async (value:PfpValue) =>{
        try{

        }
        catch(error){

        }
    }
    


    return(
        <form
            onSubmit={form.handleSubmit(handleChangingPfp)}
            className="relative"
        >
            <label className="relative block w-32 h-32 rounded-full overflow-hidden group cursor-pointer shadow-md">
                
                <Image
                    alt="Profile"
                    fill
                    sizes="128px"
                    loading="eager"
                    src={currentPfp|| "/callbackAvatar.webp"}
                    className="object-cover"
                />

                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    
                    <Input
                        className="hidden"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />

                    <Camera className="w-8 h-8 text-white mb-1" />
                </div>
            </label>
            {form.formState.errors.profileImage && (
                <FieldError
                    errors={[form.formState.errors.profileImage]}
                    className="text-red-500"
                />
            )}
        </form>
    )
}