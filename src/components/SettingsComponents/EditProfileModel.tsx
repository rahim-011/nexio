import { X } from "lucide-react";
import ChangePfp from "../ProfileComponents/ChangePfp";
import EditProfileForm from "./EditProfileForm";

export default function EditProfileModel({onClose}:{onClose:()=>void}){
    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-primary9 rounded-xl p-6 w-full max-w-lg shadow-xl pointer-events-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-grey1 text-2xl font-semibold ">
                    Edit Profile
                    </h1>
                    <X size={25} className="text-grey1 hover:scale-105 transition-all cursor-pointer" onClick={()=>onClose()}/>
                </div>
                

                <div className="flex flex-col gap-6">
                    <div className="self-center">
                        <ChangePfp/>
                    </div>
                    <EditProfileForm/>
                </div>
            </div>
        </div>
    )
}