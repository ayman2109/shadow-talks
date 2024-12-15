import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";
import { NextApiRequest } from "next";



export async function DELETE(request: NextApiRequest, { params }: { params: Promise<{ messageid: string }> } ) {

    
    const messageid = (await params).messageid
    await dbConnect();

    const session = await auth();

    if (!session || !session.user) {
        return new Response(JSON.stringify({
            success: false,
            message: "Not Authenticated"
        }), { status: 401 });
    }

    const messageID = new mongoose.Types.ObjectId(messageid as string);
    const userID = new mongoose.Types.ObjectId(session.user._id);

    try {
        const updatedResult = await UserModel.updateOne(
            { _id: userID },
            { $pull: { messages: { _id: messageID } } }
        );

        if (updatedResult.modifiedCount === 0) {
            return new Response(JSON.stringify({
                success: false,
                message: "Already Deleted or Message not found"
            }), { status: 404 });
        }

        return new Response(JSON.stringify({
            success: true,
            message: "Message deleted successfully"
        }), { status: 200 });
    } catch (err) {
        console.error("Error in delete message route:", err);
        return new Response(JSON.stringify({
            success: false,
            message: "Error deleting message"
        }), { status: 500 });
    }
}
