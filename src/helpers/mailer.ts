import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs'
import User from '@/models/userModel';

export const sendEmail = async ({ email, emailType, userID }: any) => {
    try {

        //Tdo: configure mail for usage 
        const hasedToken = await bcryptjs.hash(userID.toString(), 10)

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userID,
                { verifyToken: hasedToken, verifyTokenExpiry: Date.now() + 3600000 })
        }
        else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userID,
                {
                    forgotPasswordToken: hasedToken,
                    forgotPasswordTokenExpiry: Date.now() + 3600000
                })
        }


        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "967a536ef3ed3e",
                pass: "b04b5e5f0db808"
            }
        });

        const mailOptions = {
            from: 'nitiket@nitiket.ai',
            to: email,
            subject: emailType === 'VERIFY' ? "Verify your email" : "Reset your password",

            html: `<p>click <a href="${process.env.DOMAIN}/verifyemail?token=${hasedToken}">here</a> to 
            ${emailType === 'VERIFY' ? "Verify your email" : "Reset your password"}
            or copy and paste the link blow in your browser.
            <br>${process.env.DOMAIN}/verifyemail?token=${hasedToken} 
            </p>`,

        }

        const mailResponse = await transport.sendMail(mailOptions)
        return mailResponse
    } catch (error: any) {
        throw new error
    }
}