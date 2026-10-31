import cloudinary from "@/lib/cloudinary";
import { NextRequest, NextResponse } from "next/server";




export async function GET(req:NextRequest) {
    try{
        const {searchParams} = new URL(req.url);
        const allowedFolders = ['posts','avatars','chat'];
        const requestedFolder = searchParams.get('folder')?.split('/')[0];
        if (!requestedFolder || !allowedFolders.includes(requestedFolder)){
            return NextResponse.json({error:'Invalid folder'},{status:400})
        }
        const timestamp = Math.round((new Date()).getTime() / 1000);
        const preset = "signed_preset";
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET as string;


        const signature = cloudinary.utils.api_sign_request({
            folder: requestedFolder,timestamp,upload_preset:preset
        },apiSecret)

        return NextResponse.json({
            signature,
            requestedFolder,
            timestamp,
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