import { FormProvider, useForm } from "react-hook-form";
import PictureForm from "./PictureForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema } from "@/schemas/userSchema";


export default function PostForm(){


    const form = useForm({
        resolver: zodResolver(postSchema),
        defaultValues:{
            postCaption: '',
            postPicture: '',
        }
    })
    

    return(
        <div className="flex flex-col">
            <FormProvider {...form}>
                <form className="">
                    <PictureForm/>
                </form>
            </FormProvider>
        </div>
    )
}