import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";


export async function POST(request: Request) {
    await dbConnect()
    const { username, content } = await request.json()
    try {
        const user = await UserModel.findOne({ username })
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 401})
        }

        // is user accepting the messages
        if (!user.isAcceptingMessages) {
            return Response.json({
                success: false,
                message: "User not accepting messages"
            }, { status: 403})
        }

        const newMessage = { content, createdAt: new Date()}
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json({
            success: true,
            message: "message send successfully"
        }, { status: 200})


    } catch (error) {

        console.log("An unexpected error happened in send-messages", error)
        return Response.json({
            success: false,
            message: "can't send messages, internal server error"
        }, { status: 500})
    }

}