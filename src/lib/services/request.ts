'use server'

import { prisma } from "../prisma";
import { getCurrentUser } from "./user";
import { verifyUserSession } from "./verifications";





export async function getUserReceivedRequests(){
    try{
        const session = await verifyUserSession();
        const userId = session.user.id;
        const userReceivedRequests = await prisma.requests.findMany({
            where:{
                receiverId:userId
            },
            select:{
                receiver:{
                    select:{
                        id:true,
                        username:true,
                        image:true
                    }
                }
            }
        })
        return{
            userReceivedRequests
        }
    }
    catch(error){
        console.log('Failed to get user requests: ',error);
        return{
            success:false,
            error:'Something went wrong, please try again.'
        }
    }
}


export type ReceivedRequestsValues = {
    id: string
    username: string
    image: string | null
}






