'use client'

import Image from "next/image";
import { Camera, LoaderCircle } from "lucide-react";
import { pfpSchema } from "@/schemas/userSchema";
import { Controller, ControllerRenderProps, useForm } from 'react-hook-form'
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@base-ui/react";
import { FieldError, FieldLabel } from "../ui/field";
import React, { useState } from "react";
import { useUserStore } from "@/lib/store/userStore";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { changeAvatar } from "@/lib/services/user";
import { toast } from "sonner";

export type PfpValue = z.infer<typeof pfpSchema>

export default function ChangePfp({ onClose }: { onClose?: () => void }) {
    const { cachedUserInfos, updateUserInfos } = useUserStore();
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const { avatar } = cachedUserInfos;

    const form = useForm<PfpValue>({
        resolver: zodResolver(pfpSchema),
        defaultValues: {
            profileImage: avatar || '/callbackAvatar.webp'
        }
    })

    const currentPfp = form.watch('profileImage');

    const handleFileChange = async (
        file: File | undefined,
        field: ControllerRenderProps<PfpValue, 'profileImage'>
    ) => {
        if (!file) {
            return
        }

        try {
            setIsUploading(true)
            const uploaded = await uploadToCloudinary(file, 'avatars');

            if (!uploaded) {
                throw Error('Failed to upload!')
            }

            const value = { profileImage: uploaded.url };
            const url = uploaded.url;

            field.onChange(url);
            await handleChangingPfp(value);
        }
        catch (error) {
            console.log('Error processing image:', error)
        }
        finally {
            setIsUploading(false);
        }
    }

    const handleChangingPfp = async (value: PfpValue) => {
        try {
            const response = await changeAvatar(value);

            if (!response.success) {
                toast.error('Failed to upload profile picture');
                return;
            }

            updateUserInfos({ avatar: value.profileImage });
            onClose?.();
        }
        catch (error) {
            toast.error('Something went wrong, please try again')
        }
    }

    return (
        <form
            onSubmit={form.handleSubmit(handleChangingPfp)}
            className="relative"
        >
            <Controller
                name="profileImage"
                control={form.control}
                render={({ field, fieldState }) => (
                    <FieldLabel className="group relative block h-20 w-20 cursor-pointer overflow-hidden rounded-full shadow-md sm:h-32 sm:w-32">

                        <Image
                            alt="Profile"
                            fill
                            sizes="(max-width: 640px) 80px, 128px"
                            loading="eager"
                            src={currentPfp}
                            className="object-cover"
                            unoptimized
                        />

                        <div
                            className={`absolute inset-0 flex flex-col items-center justify-center bg-black/40 transition-opacity ${
                                isUploading
                                    ? "opacity-100"
                                    : "opacity-0 group-hover:opacity-100"
                            }`}
                        >
                            <Input
                                className="hidden"
                                type="file"
                                accept="image/*"
                                disabled={isUploading}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    handleFileChange(e.target.files?.[0], field)
                                }
                            />

                            {isUploading ? (
                                <LoaderCircle className="h-6 w-6 animate-spin text-white sm:h-8 sm:w-8" />
                            ) : (
                                <Camera className="mb-1 h-6 w-6 text-white sm:h-8 sm:w-8" />
                            )}
                        </div>

                        {fieldState.invalid && (
                            <FieldError
                                errors={[fieldState.error]}
                                className="text-red-500"
                            />
                        )}
                    </FieldLabel>
                )}
            />
        </form>
    )
}