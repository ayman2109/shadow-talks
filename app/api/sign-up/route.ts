import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import UserModel from "@/model/User";
import { sendVerificationCode } from "@/helper/sendEmail";


export async function POST(request: Request) {
    await dbConnect();


    const verificationCode = Math.floor(Math.random() * 900000) + 100000;

    
    const expiryDate = new Date()
    expiryDate.setHours(expiryDate.getHours() + 1)
    

    try {
        const { username, email, password }: { username: string; email: string; password: string } = await request.json();

        // Checking if Verified Username Exists
        const existingUserByUsername = await UserModel.findOne({username, isVerified: true})
        if (existingUserByUsername) {
           return  Response.json({message: "Username Already Exists", success: false}, {status: 400})    
        }
        // Checking if Email Exists already in DB
        const existingUserByEmail = await UserModel.findOne({email})
        if(existingUserByEmail) {
            // If it's verified then sending response saying user exists already
            if (existingUserByEmail.isVerified) {
                return Response.json({message: "User with this email Already Exists", success: false}, {status: 400})
            } else {
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.username = username
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verificationCode.toString()
                existingUserByEmail.verifyCodeExpiry = expiryDate

                await existingUserByEmail.save()
            }
        } else {
            // TODO : solve this duplicate hashing
            const hashedPassword = await bcrypt.hash(password, 10)
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode: verificationCode.toString(),
                isVerified:  false,
                verifyCodeExpiry: expiryDate,
                isAcceptingMessage: true,
                message: [],
            })

            await newUser.save()
        }
        console.log("sign-up done properly")
        // send Verfication Email
        const { success, message } = await sendVerificationCode(email, username, verificationCode.toString())
        if(!success) {
            return Response.json({success: false, message}, {status: 500})
        }
        return Response.json({ success, message }, { status: 201 })
        }
     catch(err) {
        console.error("Error In Signing UP", err);
        return Response.json({ success: false, message: "Error In Signing UP"}, {status: 500})
    }
}
