import nodemailer from 'nodemailer'
import User from '@/models/userModel';
import bcrypt from 'bcryptjs'


export const sendEmail = async ({email, emailType, userId}:any)=> {
    try {
        const hashedToken = await bcrypt.hash(userId.toString(), 10)

        // TODO : Configure mail for useage 
        if(emailType === "VERIFY"){
            await User.findByIdAndUpdate(   userId, {
                                                $set: {
                                                    verifyToken: hashedToken, 
                                              verifyTokenExpiry: Date.now() + 3600000
                                                    }
                                                })
        }else if(emailType === "RESET"){
            await User.findByIdAndUpdate(   userId, {      
                                                $set: {
                                                    forgotPasswordToken: hashedToken, 
                                              forgotPasswordTokenExpiry: Date.now() + 3600000
                                                }
                                            })

        }


        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: parseInt(process.env.MAILTRAP_PORT as string),
            auth: {
                    user: process.env.MAILTRAP_USER, 
                    pass: process.env.MAILTRAP_PASS
                }
          });

          const mailOptions = {
            from: '<mamunofficialmail.email>',
            to: email,
            subject: emailType === 'VERIFY' ? "Verify your email": "Reset your password",
            html: `<p> Click 
                        <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">
                            here
                        </a> to${emailType==="VERIFY" 
                                    ? "verify your email" 
                                    : "reset your password"}
                        or copy and past the link bellow in your browser.
                        <br/> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
                    </p>`,
          }

          const mailResponse = await transporter.sendMail(mailOptions)
          return mailResponse
    } catch (error: any) {
        throw new Error(error.message)
    }
}