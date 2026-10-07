import { ArrowLeft } from "lucide-react"




export default function FirstStepPostTitle(){
    return(
        <div className="flex items-center justify-between p-3 h-20">
            <ArrowLeft size={22} className="text-grey1 hover:brightness-115 cursor-pointer"/>
            <button className="text-grey1 hover:brightness-115 underline-offset-1 cursor-pointer">Next</button>
        </div>
    )
}