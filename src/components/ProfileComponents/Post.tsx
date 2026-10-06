import Image from "next/image"
import { Heart,MessageCircle } from "lucide-react"






export default function Post(){
    return(
        <div className="relative cursor-pointer rounded-t-lg overflow-hidden group">
            <Image
                alt="post image"
                src='/requestPfp2.png'
                className="object-cover w-full h-full"
                width={300}
                height={300}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-10 text-white ">
                
                <span className="text-grey1 flex  gap-2 font-semibold text-[1.5rem]">22<Heart size={32}/></span>
                <span className="text-grey1 flex  gap-2 font-semibold text-[1.5rem]">22<MessageCircle size={32}/></span>
            </div>
        </div>
    )
}