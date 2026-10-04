import Image from "next/image";





export default function ProfileIcon(){
    return(
        <div className="flex items-center gap-2">
            <div className="relative rounded-full">
                <Image
                alt="user logo"
                width={35}
                height={35}
                className="object-cover rounded-full"
                src='/userPfp.png'/>
            </div>
            <span className="text-[0.9rem] text-grey1">rahimTheGreat</span>
        </div>
    )
}