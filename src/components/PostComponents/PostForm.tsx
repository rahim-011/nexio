
"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema } from "@/schemas/userSchema";
import z from "zod";
import { toast } from "sonner";
import { usePostStore } from "@/lib/store/postStore";
import MediaForm from "./MediaForm";
import MediaOverview from "./MediaOverview";
import CaptionContainer from "./CaptionContainer";
import { createPost } from "@/lib/services/posts";
import { useRouter } from "next/navigation";

export type PostFormValues = z.infer<typeof postSchema>;

export default function PostForm({onClose}:{onClose:()=>void}) {
    const { currentStep } = usePostStore();
    const router = useRouter();
    const form = useForm<PostFormValues>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            postCaption: "",
            media: {},
        },
    });

    const media = form.watch("media");

    const onSubmit = async (values: PostFormValues) => {
        try {
            const result = await createPost(values);
            if (!result.success){
                toast.error("Failed to create post. Please try again.");
                return;
            }
            toast.success("Post created successfully!");
            onClose();
            usePostStore.setState({currentStep:0});
            router.refresh();
        } catch {
            toast.error("Something went wrong, please try again.");
        }
    };

    return (
        <FormProvider {...form}>
            <form
                id="post-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex h-full min-h-0 w-full flex-col"
            >
                {currentStep === 0 && (
                    <div className="flex h-full min-h-0 w-full flex-1 flex-col">
                        <MediaForm />
                    </div>
                )}

                {currentStep === 1 && (
                    <div className="h-full min-h-0 w-full flex-1 overflow-hidden rounded-xl bg-primary7">
                        {media?.url && media?.resourceType ? (
                            <MediaOverview
                                url={media.url}
                                resourceType={media.resourceType}
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-sm text-gray-400">
                                No media selected
                            </div>
                        )}
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="grid h-full min-h-0 w-full flex-1 grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                        <div className="hidden min-h-0 overflow-hidden rounded-xl bg-primary7 md:block">
                            {media?.url && media?.resourceType && (
                                <MediaOverview
                                    url={media.url}
                                    resourceType={media.resourceType}
                                />
                            )}
                        </div>

                        <div className="flex min-h-0 min-w-0 flex-col">
                            <CaptionContainer />
                        </div>
                    </div>
                )}
            </form>
        </FormProvider>
    );
}
