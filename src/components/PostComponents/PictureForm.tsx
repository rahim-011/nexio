import { useFormContext } from "react-hook-form";
import IconStack from "./IconStack";
import { Input } from "@base-ui/react";




export default function PictureForm(){
    const {control} = useFormContext();

    const handleFileChange = () =>{
        try{

        }
        catch(error){

        }
    }
    return(
        <div className="flex items-center justify-center">
            <div className="flex flex-col gap-2">
                <IconStack/>
                <h3 className="text-grey1 font-semibold text-[1.3rem]">Drag photos and videos here</h3>
                <label className="rounded-lg px-6 py-3 bg-primary5 hover:brightness-110 transition-all text-grey1 text-[1.3rem]">
                    <Input className="hidden" type="file" accept="image/*" onChange={handleFileChange}/>
                </label>
            </div>
        </div>
    )
}