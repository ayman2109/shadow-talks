import z from "zod"
export const usernameValidation = z.string()
.min(6, "User name must be atleast 6 characters")
.max(20 , "User name should not exceed 20 characters")
.regex(/^[a-zA-Z0-9]+$/, "User name should not contain special characters")

