import Image from "next/image";

export default function AuthOverlay(){
    return(
        <div className="fixed inset-0 -z-10 hidden sm:block">
            <Image 
                alt="background image"
                src="/background.avif"
                fill
                className="object-cover"
            />
        </div>
    )
}