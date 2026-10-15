'use client'

import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";



export default function SocialProviders({type}:{type:'sign-in' | 'sign-up'}){
    const handleProvider = async(provider = 'google') =>{
        try{
            await authClient.signIn.social({
                provider: provider,
                callbackURL: '/messages'
            })
            const message = type === 'sign-in' ? 'Welcome back!' :  type === 'sign-up' ? "Welcome to Nexio! You're all set." : '';
            toast.success(message);
        }
        catch(error){
            toast.error('Something went wrong, please try again');
        }
    }
    return(
        <div className="w-full flex items-center gap-15 justify-center mb-3">
            <div className="cursor-pointer hover:scale-105 transition-all" onClick={()=>handleProvider('facebook')}>
                <Image alt="fb logo"
                src="/facebook.png"
                width={35}
                height={35}
                className="object-cover"/>
            </div>
            <div className="cursor-pointer hover:scale-105 transition-all" onClick={()=>handleProvider('google')}>
                <Image alt="google logo"
                src="/google.png"
                width={35}
                height={35}
                className="object-cover"/>
            </div>
        </div>
    )
}