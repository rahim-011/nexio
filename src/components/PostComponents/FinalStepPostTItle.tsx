import { ArrowLeft } from "lucide-react";




export default function FinalStepPostTitle(){
    return(
        <div className="flex items-center justify-between p-3">
            <ArrowLeft className="text-grey1 hover:brightness-115 cursor-pointer" size={22}/>
            <h2 className="text-grey1 font-semibold text-[1.4rem]">Create new post</h2>
            <button className="text-grey1 hover:brightness-115 cursor-pointer underline-offset-1">Share</button>
        </div>
    )
}