import { connect } from "@/dbConfig/dbConfig"
import User from "@/models/userModel"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from 'bcryptjs'
import { sendEmail } from "@/helpers/mailer"

connect()

export async function POST(request: NextRequest, response: NextResponse){
    try {
        const reqBody = await request.json()
        const { username, email, password } = reqBody
        
        // validation
        console.log(reqBody)

        const user = await User.findOne({email})

        // When user already Exist 
        if(user){
            return NextResponse.json({ error: "User already Exist" }, { status: 400 })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
                                    username, 
                                    email, 
                                    password: hashedPassword
                                })

        const savedUser = await newUser.save()
        console.log(savedUser);

        //send verification Email 
        await sendEmail({email, emailType: 'VERIFY', userId: savedUser._id})

        return NextResponse.json({
            message: "User registered successfully",
            success: true,
            savedUser
        }, { status: 201 })
        
    } catch (error:any){
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}