"use client";

import { signIn } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { signInSchema } from "@/schema/signInSchema";
import z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FormData {
  identifier: string; // This will now accept either email or username
  password: string;
}

export default function SignInPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter()
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,  // This can be either email or username
      password: data.password,
    });

    console.log(result);
    if (result?.error) {
      toast({
        title: "SignIn failed",
        description: "Check your credentials",
        variant: "destructive",
      });
      setIsSubmitting(false);  // Fixing the error where state wasn't being reset
    }

    if (result?.url) {
      toast({
        title: "Sign in successful",
      });
      setIsSubmitting(false);
      router.replace('/dashboard')
      
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50"> {/* Background is light gray */}
      
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-md"
      >
        <h1 className="text-center mb-4 text-2xl font-bold">🥷🏿 SHADOW TALKS</h1>
        <h2 className="text-2xl text-center mb-6 text-black">Sign In</h2> {/* Text color is black */}
        <div className="mb-4">
          <label
            htmlFor="credentials-identifier"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email or Username
          </label>
          <input
            type="text"
            id="credentials-identifier"
            {...register("identifier", {
              required: "Email or Username is required",
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600"
          />
          {errors.identifier && (
            <p className="text-red-500 text-sm mt-1">{errors.identifier.message}</p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="credentials-password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="credentials-password"
            {...register("password", {
              required: "Password is required",
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
        <div className="text-center mt-4">
          Not a member ? {' '}
          <Link href='/sign-up' className="text-blue-400 hover:text-blue-800">
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}
