import Link from "next/link";
import ChangePfp from "./ChangePfp";




export default function ProfileTitle(){
    return(
        <div className="rounded-lg flex flex-col gap-3 bg-primary9 p-4">
            <div className="  flex items-center  gap-5">
                <ChangePfp/>
                <div className="flex flex-col gap-2 text-grey1 justify-center">
                    <h3 className="text-[1.4rem]">rahimTheGreat</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-[1rem]">0 posts</span>
                        <span className="text-[1rem]">0 friends</span>
                    </div>
                    <span className="text-[1.1rem]">Good things take time</span>
                </div>
            </div>
            <Link href='/settings/edit-profile' className="rounded-lg text-center text-grey1 px-6 py-3 bg-primary5 hover:brightness-115 max-w-[60%] cursor-pointer text-[1.1rem]">Edit Profile</Link>
        </div>
        
    )
}