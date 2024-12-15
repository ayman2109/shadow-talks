import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import UserModel from "@/model/User";



export const usernameValidation = z.string()
.min(6, "User name must be atleast 6 characters")
.max(20 , "User name should not exceed 20 characters")
.regex(/^[a-zA-Z0-9]+$/, "User name should not contain special characters")




export async function GET(req: Request) {

    await dbConnect();
    
    try {
        const { searchParams } = new URL(req.url);
        const username = searchParams.get('username');
       
        // Validating with Zod
        const result = usernameValidation.safeParse(username);
        
        if (!result.success) {

            
            // If validation fails, return error response with Zod errors
            return new Response(
                JSON.stringify({
                    success: false,
                    message: result.error.issues[0].message,
                    errors: result.error.issues, // Zod errors
                }),
                { status: 400 }
            );
        }

        // Check username uniqueness in the database
        const existingUser = await UserModel.findOne({ username, isVerified: true });
        if (existingUser) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Username is already taken",
                }),
                { status: 409 }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "Username is available",
            }),
            { status: 200 }
        );
    } catch (error) {
        console.log("Error occurred while checking username uniqueness", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Internal Server Error",
            }),
            { status: 500 }
        );
    }
}
