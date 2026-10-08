import Image from "next/image";




export default function AuthOverlay(){
    return(
        <div className="inset-0 fixed -z-10">
            <Image 
            alt="background image"
            src="/background.avif"
            fill
            className="object-cover"/>
        </div>
    )
}