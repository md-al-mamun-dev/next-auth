import nodemailer from 'nodemailer'
import User from '@/models/userModel';
import bcrypt from 'bcryptjs'

export const mailer = async ({emailType, userId}:any)=> {
    try {
        // Generate unique token 
        const hashedToken = await bcrypt.hash(userId.toString(), 10)
       
        const { email } = await updateUser({ _id: userId ,
                                            type: emailType, 
                                           token: hashedToken})

        return sendMail({   sender: 'next-auth', 
                          receiver: email, 
                              type: emailType, 
                             token: hashedToken })
        // send verification mail
        // const transporter = nodemailer.createTransport({
        //     host: process.env.MAILTRAP_HOST,
        //     port: parseInt(process.env.MAILTRAP_PORT!),
        //     auth: { user: process.env.MAILTRAP_USER, 
        //             pass: process.env.MAILTRAP_PASS }
        // });
        // const mailOptions = {
        //     from: '<mamunofficialmail.email>',
        //     to: data?.email,
        //     subject: emailType === 'VERIFY' ? "Verify your email": "Reset your password",
        //     html: `<p> Click 
        //                 <a href="${process.env.DOMAIN}/verify-email?token=${hashedToken}"> here
        //                 </a> to${emailType==="VERIFY" 
        //                             ? "verify your email" 
        //                             : "reset your password"}
        //                 or copy and past the link bellow in your browser.
        //                 <br/> ${process.env.DOMAIN}/verify-email?token=${hashedToken}
        //             </p>`,
        //     }
        // return await transporter.sendMail(mailOptions)
        // return mailResponse  


        // TODO : Configure mail for useage 
        // if(emailType === "VERIFY"){
        //     const data = await User.findByIdAndUpdate(   userId, {
        //                                                             $set: {     
        //                                                                         verifyToken: hashedToken, 
        //                                                                   verifyTokenExpiry: Date.now() + 3600000
        //                                                                 }
        //                                                         }
        //                                         )
        //     const { email: userEmail, verifyToken } = data

        //     const mailOptions = {
        //         from: '<mamunofficialmail.email>',
        //         to: userEmail,
        //         subject: emailType === 'VERIFY' ? "Verify your email": "Reset your password",
        //         html: `<p> Click 
        //                     <a href="${process.env.DOMAIN}/verifyemail?token=${verifyToken}">
        //                         here
        //                     </a> to${emailType==="VERIFY" 
        //                                 ? "verify your email" 
        //                                 : "reset your password"}
        //                     or copy and past the link bellow in your browser.
        //                     <br/> ${process.env.DOMAIN}/verifyemail?token=${verifyToken}
        //                 </p>`,
        //         }
        //     const mailResponse = await transporter.sendMail(mailOptions)
        //     return mailResponse
        // }else if(emailType === "RESET"){
        //     const data = await User.findByIdAndUpdate(   userId, {      
        //                                         $set: {
        //                                             forgotPasswordToken: hashedToken, 
        //                                       forgotPasswordTokenExpiry: Date.now() + 3600000
        //                                         }
        //                                     })
        //     const { email: userEmail, forgotPasswordToken} = data

        //     const mailOptions = {
        //         from: '<mamunofficialmail.email>',
        //         to: userEmail,
        //         subject: emailType === 'VERIFY' ? "Verify your email": "Reset your password",
        //         html: `<p> Click 
        //                     <a href="${process.env.DOMAIN}/verifyemail?token=${forgotPasswordToken}">
        //                         here
        //                     </a> to${emailType==="VERIFY" 
        //                                 ? "verify your email" 
        //                                 : "reset your password"}
        //                     or copy and past the link bellow in your browser.
        //                     <br/> ${process.env.DOMAIN}/verifyemail?token=${forgotPasswordToken}
        //                 </p>`,
        //         }
        //     const mailResponse = await transporter.sendMail(mailOptions)
        //     return mailResponse                                            

        // }
    } catch (error: any) {
        throw new Error(error.message)
    }
}

async function updateUser({_id, type, token}:any) {
    if(type  === "VERIFY"){
        return await User.findByIdAndUpdate(_id, {
                                                $set: {     
                                                            verifyToken: token, 
                                                    verifyTokenExpiry: Date.now() + 3600000
                                                        }
                                                }
                                            ).select('email')

    }
    if(type  === "RESET"){
        return await User.findByIdAndUpdate(_id, {
                                                $set: {     
                                                            forgotPasswordToken: token, 
                                                    forgotPasswordTokenExpiry: Date.now() + 3600000
                                                        }
                                                }
                                            ).select('email')
                        }
}

async function sendMail({sender, receiver, type, token}: any) {
    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: parseInt(process.env.MAILTRAP_PORT!),
        auth: { user: process.env.MAILTRAP_USER, 
                pass: process.env.MAILTRAP_PASS }
    });
    const mailOptions = {
        from: sender,
        to: receiver,
        subject: type === 'VERIFY' ? "Verify your email": "Reset your password",
        html: `<p> Click 
                    <a href="${process.env.DOMAIN}/verify-email?token=${token}"> here
                    </a> to${type==="VERIFY" 
                                ? "verify your email" 
                                : "reset your password"}
                    or copy and past the link bellow in your browser.
                    <br/> ${process.env.DOMAIN}/verify-email?token=${token}
                </p>`,
        }
    return await transporter.sendMail(mailOptions)
}