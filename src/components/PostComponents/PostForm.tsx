import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema } from "@/schemas/userSchema";
import MediaForm from "./MediaForm";
import z from "zod";


export type PostFormValues = z.infer<typeof postSchema>;

export default function PostForm(){


    const form = useForm<PostFormValues>({
        resolver: zodResolver(postSchema),
        defaultValues:{
            postCaption: '',
            media: {}
        }
    })



    const onSubmit = async(values:PostFormValues) =>{
        try{

        }
        catch(error){
            console.log(error)
        }
    }
    return(

            <FormProvider {...form}>
                <form className="">
                    <MediaForm/>
                </form>
            </FormProvider>

    )
}