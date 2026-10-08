import Image from "next/image";





export default function SocialProviders(){
    return(
        <div className="w-full flex items-center gap-15 justify-center mb-3">
            <div className="cursor-pointer hover:scale-105 transition-all">
                <Image alt="fb logo"
                src="/facebook.png"
                width={35}
                height={35}
                className="object-cover"/>
            </div>
            <div className="cursor-pointer hover:scale-105 transition-all">
                <Image alt="google logo"
                src="/google.png"
                width={35}
                height={35}
                className="object-cover"/>
            </div>
        </div>
    )
}