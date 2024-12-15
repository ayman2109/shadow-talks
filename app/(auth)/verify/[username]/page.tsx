'use client';
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { verifyCodeSchema } from "@/schema/verifyCodeSchema";
import ApiResponse from "@/schema/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { z } from "zod";
import axios, { AxiosError } from "axios"
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
// Define the schema type for better type inference
type VerifyCodeFormData = z.infer<typeof verifyCodeSchema>;

const VerifyCodePage =  (  ) => {
  const params = useParams<{ username: string }>()
  const { toast } = useToast()
  
  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm<VerifyCodeFormData>({
    resolver: zodResolver(verifyCodeSchema) ,
  });

  const onSubmit = async  (data: VerifyCodeFormData) => {
    try {
        await axios.post('/api/verify-code', { username: params.username, code: data.code})
        toast({
          title: "verification successful"
        })
        router.replace('/sign-in')
    } catch(err) {
        const axiosError = err as AxiosError<ApiResponse>
        toast({
          title: axiosError.response?.data.message,
          variant: "destructive"
        })
    }
  };

  return (
    <div className="container mx-auto mt-8 p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Verify Code</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-slate-300 p-6">
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700">
            Enter Code
          </label>
          <input
            type="text"
            id="code"
            {...register("code")}
            className={`mt-1 block w-full rounded-md border-black-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm ${
              errors.code ? "border-red-500" : ""
            }`}
          />
          {errors.code && (
            <p className="mt-1 text-sm text-red-500">{errors.code.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default VerifyCodePage;
