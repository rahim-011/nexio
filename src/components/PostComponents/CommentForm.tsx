"use client";

import { commentSchema } from "@/schemas/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Smile } from "lucide-react";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { Field, FieldError } from "../ui/field";
import { useEffect, useRef, useState } from "react";

export type CommentFormValue = z.infer<typeof commentSchema>;

export default function CommentForm() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const closingRef = useRef<HTMLDivElement| null>(null);
    const form = useForm({
        resolver: zodResolver(commentSchema),
        defaultValues: {
        postComment: "",
        },
    });

    const {
        formState: { isDirty, isSubmitting },
    } = form;

    const comment = form.watch("postComment");

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        form.setValue("postComment", comment + emojiData.emoji, {
        shouldDirty: true,
        shouldValidate: true,
        });
        setIsOpen(false);
    };

    const onSubmit = async (value: CommentFormValue) => {
        try {
        } catch (error) {
        toast.error("Something went wrong, please try again");
        }
    };

    useEffect(()=>{
        function closeEmojiPicker(e:MouseEvent){
            if (closingRef.current && !closingRef.current.contains(e.target as Node)){
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown',closeEmojiPicker);
        return () => document.removeEventListener('mousedown',closeEmojiPicker);
    },[isOpen])
  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2"
      >
        <Controller
          control={form.control}
          name="postComment"
          render={({ field, fieldState }) => (
            <Field>
              <div className="flex flex-col gap-2 rounded-xl border border-primary5 bg-primary9 p-3 transition-colors focus-within:border-primary2">
                <textarea
                  {...field}
                  maxLength={160}
                  placeholder="Add a comment..."
                  rows={2}
                  className="w-full resize-none bg-transparent text-sm leading-6 text-grey1 outline-none placeholder:text-grey2"
                />

                <div className="flex items-center justify-between gap-3 border-t border-primary5 pt-2">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <button
                        type="button"
                        aria-label="Open emoji picker"
                        aria-expanded={isOpen}
                        onClick={() => setIsOpen((prev) => !prev)}
                        className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                          isOpen
                            ? "bg-primary5 text-primary2"
                            : "text-grey2 hover:bg-primary5 hover:text-grey1"
                        }`}
                      >
                        <Smile className="h-5 w-5" />
                      </button>

                      {isOpen && (
                        <div className="absolute bottom-12 left-0 z-[100] overflow-hidden rounded-xl border border-primary5 shadow-2xl" ref={closingRef}>
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

                    <span
                      className={`text-xs tabular-nums ${
                        field.value.length >= 140
                          ? "text-red-400"
                          : "text-grey2"
                      }`}
                    >
                      {field.value.length}/160
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={
                      !isDirty || isSubmitting || !field.value.trim()
                    }
                    className="cursor-pointer rounded-lg bg-primary6 px-4 py-2 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? "Posting..." : "Post"}
                  </button>
                </div>
              </div>

              {fieldState.error && (
                <FieldError
                  errors={[fieldState.error]}
                  className="text-[1rem] text-red-500"
                />
              )}
            </Field>
          )}
        />
      </form>
    </FormProvider>
  );
}