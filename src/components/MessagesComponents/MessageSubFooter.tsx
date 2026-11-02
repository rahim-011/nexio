"use client";

import Image from "next/image";
import { Paperclip, Send, X } from "lucide-react";
import { useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { messageSchema } from "@/schemas/chatSchema";
import { Chat, ResourceTypes, User } from "@prisma/client";
import z from "zod";
import { toast } from "sonner";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { createNewMessage } from "@/lib/services/message";
import { socket,verifyConnection } from "@/lib/socket";
import { DisplayMessage } from "./MessageSub";
import { useUserStore } from "@/lib/store/userStore";

export interface SelectedImage {
  publicId: string;
  url: string;
  resourceType: ResourceTypes;
}
interface MessageSubFooterProps {
    chatId: Chat["id"];
    currentUserId: User['id'],
    setMessages: React.Dispatch<React.SetStateAction<DisplayMessage[]>>;
    scrollToBottom: () => void,
}

export type MessageFormValueInput = z.input<typeof messageSchema>;
export type MessageFormValue = z.output<typeof messageSchema>;

export default function MessageSubFooter({
    chatId,
    setMessages,
    currentUserId,
    scrollToBottom
}: MessageSubFooterProps) {
    const [isUploading,setIsUploading] = useState<boolean>(false);
    const [images, setImages] = useState<SelectedImage[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
  const {cachedUserInfos} = useUserStore();
    const form = useForm<MessageFormValueInput, any, MessageFormValue>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
          content: "",
          chatId,
          media: [],
        },
    });

      const {
      register,
      handleSubmit,
      setValue,
      watch,
  } = form;

  const content = watch("content") ?? "";
  const canSend = Boolean(content.trim()) || images.length > 0;


    const onSubmit = async (values: MessageFormValue) => {
      //temp message to show what user sent before checking it in the server!
      
      const tempId = crypto.randomUUID();
      const optimisticMessage = {
          id: tempId,
          chatId,
          content: values.content,
          senderId: currentUserId,
          sender:{
            username: cachedUserInfos.username,
            image:cachedUserInfos.avatar ?? '/callbackAvatar.webp',
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          readAt: null,
          images: values.media,
          isMine: true,
          status: "sending"
      };
      setMessages(prev => [...prev,{...optimisticMessage,status:"sending"}]);
      requestAnimationFrame(() => {
        scrollToBottom();
      });
      form.reset();
      setImages([]);
      try {
        const result = await createNewMessage({chatId,content:values.content,media:values.media});
        if (!result.success || !result.newMessage){
            toast.error('Failed to submit message!');
            setMessages(prev => prev.filter(message => message?.id != tempId));
            return;
        }
        setMessages(prev => prev.map(message => {
          if (message.id !== tempId) return message;
          return {
              ...message,
              ...result.newMessage,
              isMine: true,
              sender: {
                  username: result.newMessage.sender.username,
                  image: result.newMessage.sender.image ?? '/callbackAvatar.webp'
              },
              status: "sent" as const
          };
      }));
        try {
        await verifyConnection();
        socket.emit("message:send",result.newMessage);
        } catch (error) {
          console.error("Socket connection failed:", error);
        }
      }
      catch(error) {
        setMessages(prev => prev.filter(message => message?.id !== tempId));
        toast.error('Somthing went wrong,please try again.')
      }
    };
    const handleProcessFile = async (e:React.ChangeEvent<HTMLInputElement>) =>{
        try{
            const file = e.target.files?.[0];
            if (!file) return;
            setIsUploading(true);
            const uploadedFile = await uploadToCloudinary(file,`chat/${chatId}`);
            const updatedImages = [...images,uploadedFile];
            setImages(updatedImages)
            setValue("media",updatedImages,{
              shouldValidate:true,
              shouldDirty:true
            });
        }
        catch(error){
            toast.error('Failed to process file!')
            console.log(error);
        }
        finally{
            setIsUploading(false);
            e.target.value = "";
        }
    }

  return (
    <div className="mt-auto w-full shrink-0 bg-[#9fb3c8] px-3 py-2 sm:px-4 sm:py-3">
      {images.length > 0 && (
        <div className="mb-3 flex w-full gap-2 overflow-x-auto pb-1">
          {images.map((image) => (
            <div
              key={image.publicId}
              className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[#243b53] sm:h-20 sm:w-20"
            >
              <Image
                src={image.url}
                alt="Selected image"
                fill
                sizes="80px"
                className="object-cover"
              />

              <button
                type="button"
                aria-label="Remove image"
                onClick={() =>
                  setImages((prev) =>
                    prev.filter((item) => item.publicId!== image.publicId)
                  )
                }
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-red-500"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <FormProvider {...form}>
        <form
          onSubmit={handleSubmit(
            onSubmit
          )}
          className="flex w-full items-end gap-2 sm:gap-3"
        >
          <input
            ref={fileInputRef}
            onChange={(e) => handleProcessFile(e)}
            type="file"
            accept="image/*"
            className="hidden"
          />

          <button
            type="button"
            aria-label="Attach images"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-[#243b53] text-white transition hover:opacity-90 active:scale-95 sm:h-14 sm:w-14"
          >
            <Paperclip size={23} className="rotate-45 sm:hidden" />
            <Paperclip size={25} className="hidden rotate-45 sm:block" />
          </button>

          <textarea
            {...register("content")}
            placeholder="Type your message..."
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey){
                e.preventDefault();
                form.handleSubmit(onSubmit)();
              }
            }}
            className="max-h-32 min-h-12 min-w-0 flex-1 resize-none rounded-xl bg-[#eef2f6] px-4 py-3 text-base leading-6 text-[#102a43] outline-none transition placeholder:text-[#627d98] focus:ring-2 focus:ring-[#486581]/40 sm:min-h-14 sm:px-5 sm:py-4 sm:text-lg"
          />

          <button
            type="submit"
            aria-label="Send message"
            disabled={isUploading || !canSend}
            className={`flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-[#243b53] text-white transition hover:opacity-90 active:scale-95 disabled:opacity-50 sm:h-14 sm:w-14 ${!canSend ? 'opacity-80' : ''}`}
          >
              <Send size={25} className="hidden sm:block" />
              <Send size={22} className="sm:hidden" />
          </button>
        </form>
      </FormProvider>
    </div>
  );
}