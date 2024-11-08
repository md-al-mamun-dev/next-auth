import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

connect()

export async function POST(request: NextRequest) {
    try {
        const response  = NextResponse.json({message: "Logout Successfylly", success: true })
        response.cookies.set("token", "", { 
                                        httpOnly: true, 
                                        expires: new Date(0) })
        return response
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}