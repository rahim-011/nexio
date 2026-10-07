'use client'

import { usePostStore } from "@/lib/store/postStore";
import FirstStepPostTitle from "./PostComponents/FirstStepPostTitle";
import DefaultStepTitle from "./PostComponents/DefaultStepTitle";
import FinalStepPostTitle from "./PostComponents/FinalStepPostTItle";
import PostForm from "./PostComponents/PostForm";


export default function PostModel({closeModel}:{closeModel:()=>void}){
    const {currentStep} = usePostStore();
    return(
        <div className="bg-primary9">
            {currentStep === 0 ? 
                <DefaultStepTitle/> : 
                currentStep === 1 ? 
                <FirstStepPostTitle/> : 
                    currentStep === 2 ?
                    <FinalStepPostTitle/> : null}
            <PostForm/>
        </div>
    )
}


