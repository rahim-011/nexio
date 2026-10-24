
"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Field } from "../ui/field";
import { Smile } from "lucide-react";
import { useState } from "react";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import type { PostFormValues } from "./PostForm";

export default function CaptionForm() {
    const { control, watch, setValue } = useFormContext<PostFormValues>();
    const caption = watch("postCaption") || "";
    const [isOpen, setIsOpen] = useState(false);

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setValue("postCaption", caption + emojiData.emoji, {
            shouldDirty: true,
            shouldValidate: true,
        });
        setIsOpen(false);
    };

    return (
        <Controller
            control={control}
            name="postCaption"
            render={({ field }) => (
                <Field className="relative flex h-full min-h-0 flex-col rounded-xl border border-white/10 bg-[#0a192f] p-4 text-white">
                    <textarea
                        {...field}
                        value={caption}
                        onChange={(e) =>
                            setValue("postCaption", e.target.value, {
                                shouldDirty: true,
                                shouldValidate: true,
                            })
                        }
                        rows={4}
                        maxLength={200}
                        placeholder="Add a caption ..."
                        className="min-h-0 w-full flex-1 resize-none bg-transparent text-sm leading-6 text-white outline-none placeholder:text-gray-500"
                    />

                    <div className="flex shrink-0 items-center justify-between border-t border-gray-800 pt-3 text-gray-400">
                        <div className="relative">
                            <button
                                type="button"
                                aria-label="Open emoji picker"
                                className="rounded-lg p-1 transition-colors hover:bg-white/10 hover:text-white"
                                onClick={() => setIsOpen((prev) => !prev)}
                            >
                                <Smile className="h-5 w-5 cursor-pointer" />
                            </button>

                            {isOpen && (
                                <div className="absolute bottom-10 left-0 z-[100] overflow-hidden rounded-xl border border-slate-700 shadow-2xl">
                                    <EmojiPicker
                                        onEmojiClick={handleEmojiClick}
                                        theme={Theme.DARK}
                                        width={320}
                                        height={380}
                                        searchPlaceHolder="Search emoji..."
                                        previewConfig={{ showPreview: false }}
                                        skinTonesDisabled
                                    />
                                </div>
                            )}
                        </div>

                        <span className="text-xs tabular-nums">
                            {caption.length}/200
                        </span>
                    </div>
                </Field>
            )}
        />
    );
}
