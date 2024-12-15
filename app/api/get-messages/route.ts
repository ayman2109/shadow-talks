import { auth } from "../../../auth"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";


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

    const userID = new mongoose.Types.ObjectId(user?._id)

    try {
      const currentUser = await UserModel.aggregate([
        { $match: { _id: userID } }, 
        { $unwind: { path: '$messages', preserveNullAndEmptyArrays: true } }, // Allow unwind to handle empty messages array
        { $sort: { 'messages.createdAt': -1 } }, 
        { $group: { _id: "$_id", messages: { $push: '$messages' } } }
      ]);
    
      if (!currentUser || currentUser.length === 0) {
        return Response.json({
          success: false,
          message: "User not found"
        }, { status: 401 });
      }
    
      const messages = currentUser[0].messages.filter(Boolean); // Remove null values
    
      if (messages.length === 0) {
        return Response.json({
          success: false,
          message: "No messages found"
        }, { status: 404 });
      }
    
      return Response.json({
        success: true,
        messages: messages
      }, { status: 200 });
      
    }
    
    catch(err) {
        console.log("An error while finding user in get-messages", err)
        return Response.json({
            success: false,
            message: "error while finding user"
        }, { status: 500})
    }

}