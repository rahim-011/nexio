import Image from "next/image"
import { Heart,MessageCircle } from "lucide-react"






export default function Post({postInfos,onOpen}:{postInfos:any,onOpen:()=>void}){
    return(
        <div className="relative cursor-pointer rounded-t-lg overflow-hidden group" onClick={()=>onOpen()}>
            {postInfos.media.resourceType === 'image' ? (<Image
                alt="post image"
                src={postInfos.media.url}
                className="object-cover w-full h-full"
                width={300}
                height={300}
            />) :
            <video 
                src={postInfos.media.url}
                className="h-full w-full object-cover"
                controls
                preload="metadata"/>}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-10 text-white ">
                
                <span className="text-grey1 flex  gap-2 font-semibold text-[1.5rem]">{postInfos.likes.length}<Heart size={32}/></span>
                <span className="text-grey1 flex  gap-2 font-semibold text-[1.5rem]">{postInfos.comments.length}<MessageCircle size={32}/></span>
            </div>
        </div>
    )
}