import { Archive } from "lucide-react";
import Link from "next/link";



export default function EmptyRequests(){
    return(
        <div className="flex flex-col gap-3 items-center justify-center p-5 md:p-8 lg:p-10  min-h-96 rounded-lg w-full">
            <div className="rounded-full p-5 border border-grey1">
                <Archive size={70} className="text-grey3" strokeWidth={1}/>
            </div>
            <div className="flex flex-col gap-4 text-grey1 text-center">
                <h2 className="text-2xl">No friend requests yet</h2>
                <p className="text-[0.9rem]">Search for friends using their username to connect and start chatting</p>
            </div>
            <Link href='add-friends' className="flex items-center gap-3 rounded-lg bg-primary5 hover:brightness-115 py-2 px-6 text-grey1 transition-all mt-4">Find Friends</Link>
        </div>
    )
}