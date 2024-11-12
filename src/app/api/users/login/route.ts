import { connect } from "@/dbConfig/dbConfig"
import User from "@/models/userModel"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken" 

connect()

export async function POST(request: NextRequest, response: NextResponse){
    try {
        const reqBody = await request.json()
        const { email, password } = reqBody
        
        // validation
        const user = await User.findOne({email}).select('+password')

        if(!user){
            return NextResponse.json({ error: "User not exist...!" }, { status: 400 })
        }
        const validPassword = await bcrypt.compare(password, user.password)
        
        if(!validPassword){
            return NextResponse.json({ error: "Check your credentials" }, { status: 400 })
        }
        const tokenData =   {
                                      id: user._id,
                                username: user.username,
                                   email: user.email
                            }

        const token =   jwt.sign(   tokenData,
                                    process.env.TOKEN_SECRET!,
                                    { expiresIn: '1h' } )

        const response = NextResponse.json({
                                                message:" Loggied In Success",
                                                success: true 
                                            })

        response.cookies.set("token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 1})
        
        return response; 

    } catch (error:any){
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}