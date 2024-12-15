
import { auth } from "../../../auth"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";



export async function POST(request: Request) {
    await dbConnect()

    const session = await auth()
    const user = session?.user

    
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401})
    }

    const userID = user?._id

    const { acceptMessages } = await request.json()
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userID, { isAcceptingMessages: acceptMessages}, { new: true})
        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "Unable to update the user"
            }, { status: 401})
        }

        return Response.json({
            success: true,
            message: "User update",
            updatedUser
        }, { status: 200})


    } catch (error) {
        console.log("Failed to update user to accept messages", error)
        return Response.json({
            success: false,
            message: "Failed to update user to accept messages"
        }, { status: 401})
    }



}

export async function GET() {
    await dbConnect()

    const session = await auth()
    const user = session?.user

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401})
    }
    
    const userID = user?._id
    try {
    const foundUser = await UserModel.findById(userID)
    if (!foundUser) {
        return Response.json({
            success: false,
            message: "user not found"
        }, { status: 404})
    
    }
    return Response.json({
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessages
    }, { status: 200 })
    }  catch (err) {
        console.log("Error occured while finding user for isAcceptingMessage", err)
        return Response.json({
            success: false,
            message: "Error accepting messages"
        }, { status: 500})
    }
    
}