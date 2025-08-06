// this api will create a cloudinary upload singnature for the client to use
import { NextRequest, NextResponse } from 'next/server';
import cloudinary from "@/lib/cloudinary";
// you got to know what does signing this actually do
// so what this does is this will sign the parameters that you send to cloudinary
// signing basically means that it will create a hash of the parameters that you send to cloudinary
// on the cloudinary side, it will verify that the parameters are valid and not tampered with
// Kinda like an access token but for uploading files
export async function POST(request: NextRequest) {
    const body = await request.json();
    const { public_id} = body;
    const timestamp = Math.floor(Date.now() / 1000);
    const params = {
        timestamp,
        
        public_id,
    };
    // okay that is pretty cool
    const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET || '');

    return NextResponse.json({
        signature,
        timestamp,
        public_id,
        apiKey: process.env.CLOUDINARY_API_KEY,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        
    });
}