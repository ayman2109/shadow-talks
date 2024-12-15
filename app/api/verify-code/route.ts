import dbConnect from "@/lib/dbConnect";
import { verifyCodeSchema } from "@/schema/verifyCodeSchema";
import UserModel from "@/model/User";


export async function POST(request: Request) {
    await dbConnect()
   
    try {
        
        const { username, code } = await request.json()
        console.log(code)
        const decodedUsername = decodeURIComponent(username)


        const result = verifyCodeSchema.safeParse({ code })
        if (!result.success) {
            return Response.json({
                success: false,
                message: "Verfication Code size must be 6 digits"
            }, { status: 500 })
        }


        const user = await UserModel.findOne({ username: decodedUsername })

        if (!user) {
            return Response.json({
                success: false,
                message: "User not exists"
            }, { status: 500 })
        }

        const isCodeValid = code == user.verifyCode
        const isCodeExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (isCodeExpired && isCodeValid) {
            user.isVerified = true
            await user.save()

            return Response.json({
                success: true,
                message: "User Verified Successfully"

            }, { status: 200})
        } else if(!isCodeExpired) {
            return Response.json({
                success: false,
                message: "Verfication Code expired"
            }, { status: 500 })
        } else {
            return Response.json({
                success: false,
                message: "Incorrect Verification Code"
            }, { status: 500 })
        }


    } catch (err) {
        console.log('errror', err)
    }
}