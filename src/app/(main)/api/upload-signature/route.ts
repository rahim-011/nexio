import cloudinary from "@/lib/cloudinary";
import { NextRequest, NextResponse } from "next/server";





export async function GET(req:NextRequest,res:NextResponse) {
    try{
        const timeStamp = Math.round((new Date()).getTime() / 1000);
        const preset = "signed_posts_preset";
        const folder = "posts";
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;


        const signature = cloudinary.utils.api_sign_request({
            folder,timeStamp,preset
        },process.env.CLOUDINARY_KEY_SECRET as string)

        return NextResponse.json({
            signature,
            folder,
            timeStamp,
            preset,
            cloudName,
            apiKey
        },{status:200})
    }
    catch(error){
        return NextResponse.json({
            success:false,
            error:"Internal server error"
        },{status:500})
    }
}