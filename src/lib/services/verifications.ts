import { cache } from "react";
import { headers } from "next/headers";
import { auth } from "../auth";






export const verifyUserSession = cache(async() =>{
    try{
        const session = await auth.api.getSession({
            headers: await headers()
        })
        if (!session || !session.user){
            throw new Error('Unauthorized')
            return;
        }
        return session;
    }
    catch(error){
        return{
            success:false,
            error:'Internal server error'
        }
    }
})



