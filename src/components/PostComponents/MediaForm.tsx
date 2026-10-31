"use client";

import { Controller, ControllerRenderProps, useFormContext } from "react-hook-form";
import React, { useRef, useState } from "react";
import IconStack from "./IconStack";
import { usePostStore } from "@/lib/store/postStore";
import { PostFormValues } from "./PostForm";
import { Input } from "@base-ui/react";
import Image from "next/image";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";

export default function MediaForm() {
    const [localPreview, setLocalPreview] = useState({ url: "", type: "" });
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const { updateCurrentStep } = usePostStore();
    const { control, watch } = useFormContext<PostFormValues>();
    const media = watch("media");

    const processFile = async (
        file: File | undefined,
        field: ControllerRenderProps<PostFormValues, "media">
    ) => {
        if (!file) return;

        if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
            setErrorMessage("Only photos and videos are allowed");
            return;
        }

        setErrorMessage("");
        const objectUrl = URL.createObjectURL(file);

        setLocalPreview({ url: objectUrl, type: file.type });
        setIsUploading(true);

        try {
            const uploaded = await uploadToCloudinary(file, "posts");
            field.onChange(uploaded);
            updateCurrentStep("forward");
        } catch (error) {
            field.onChange(undefined);
            setErrorMessage("Upload failed, please try again");
            console.log("Failed on uploading: ", error);
        } finally {
            setIsUploading(false);
            setLocalPreview({ url: "", type: "" });
            URL.revokeObjectURL(objectUrl);

            if (inputRef.current) {
                inputRef.current.value = "";
            }
        }
    };

    return (
        <Controller
            name="media"
            control={control}
            render={({ field, fieldState }) => (
                <div
                    onDragOver={(e) => {
                        e.preventDefault();
                        if (!isUploading) setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);

                        if (!isUploading) {
                            processFile(e.dataTransfer.files?.[0], field);
                        }
                    }}
                    className={`flex h-full min-h-0 w-full flex-1 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-2 text-center transition-all duration-200 sm:rounded-2xl sm:p-6 ${
                        isDragging
                            ? "border-primary5 bg-primary5/10"
                            : "border-white/15 bg-white/[0.03] hover:border-white/25"
                    }`}
                >
                    {isUploading && localPreview.url ? (
                        <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center gap-2 sm:gap-4">
                            <div className="relative min-h-0 w-full max-w-2xl flex-1 overflow-hidden rounded-lg bg-black/20 sm:rounded-xl">
                                {localPreview.type.startsWith("image/") ? (
                                    <Image
                                        src={localPreview.url}
                                        alt="Uploading preview"
                                        fill
                                        sizes="(max-width: 768px) 100vw, 672px"
                                        className="object-contain opacity-60"
                                        unoptimized
                                    />
                                ) : (
                                    <video
                                        src={localPreview.url}
                                        className="h-full w-full object-contain opacity-60"
                                        muted
                                        autoPlay
                                        playsInline
                                    />
                                )}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white sm:h-10 sm:w-10" />
                                </div>
                            </div>
                            <p className="shrink-0 text-xs text-white/70 sm:text-sm">
                                Uploading...
                            </p>
                        </div>
                    ) : media?.url ? (
                        <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center gap-2 sm:gap-4">
                            <div className="relative min-h-0 w-full max-w-2xl flex-1 overflow-hidden rounded-lg bg-black/20 sm:rounded-xl">
                                {media.resourceType === "image" ? (
                                    <Image
                                        src={media.url}
                                        alt="Uploaded media"
                                        fill
                                        sizes="(max-width: 768px) 100vw, 672px"
                                        className="object-contain"
                                        unoptimized
                                    />
                                ) : (
                                    <video
                                        src={media.url}
                                        controls
                                        playsInline
                                        className="h-full w-full object-contain"
                                    />
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => inputRef.current?.click()}
                                className="shrink-0 cursor-pointer rounded-lg bg-primary5 px-4 py-2 text-xs font-medium text-white transition-all hover:brightness-110 sm:px-5 sm:py-2.5 sm:text-sm"
                            >
                                Change file
                            </button>
                        </div>
                    ) : (
                        <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center gap-3 text-center sm:gap-4">
                            <IconStack />
                            <div className="space-y-1">
                                <h3 className="text-base font-semibold text-white sm:text-lg">
                                    Drag photos and videos here
                                </h3>
                                <p className="text-xs text-white/50 sm:text-sm">
                                    or select a file from your device
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => inputRef.current?.click()}
                                className="cursor-pointer rounded-lg bg-primary5 px-4 py-2 text-xs font-medium text-white transition-all hover:brightness-110 sm:px-5 sm:py-2.5 sm:text-sm"
                            >
                                Select a file
                            </button>
                        </div>
                    )}

                    <Input
                        ref={inputRef}
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        disabled={isUploading}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            processFile(e.target.files?.[0], field)
                        }
                    />

                    {(errorMessage || fieldState.error) && (
                        <p className="mt-2 shrink-0 text-xs text-red-400 sm:mt-3 sm:text-sm">
                            {errorMessage || fieldState.error?.message}
                        </p>
                    )}
                </div>
            )}
        />
    );
}