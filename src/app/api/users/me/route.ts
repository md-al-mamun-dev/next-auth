import { NextRequest, NextResponse } from "next/server"
import { connect } from "@/dbConfig/dbConfig"
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect()

export async function POST(request: NextRequest){
    const token = request.cookies.get("token")?.value || ""        
    try {
        return NextResponse.json({
                                    success: true, 
                                    message: "User found...",
                                    data: await getDataFromToken(token) 
                                },  { status: 200 })
    } catch (error) {        
        const response =  NextResponse
                            .json({ error: "Authorization error..." }, { status: 401 })
              response.cookies.set("token", "", { httpOnly: true, 
                                                expires: new Date(0) })
        return response 
    }
        
}