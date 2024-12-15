'use client'

import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from "react-hook-form"
import axios , { AxiosError } from "axios"
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import ApiResponse from '@/schema/apiResponse';

import useDebounce from '@/hooks/use-debounce';

interface FormData {
  username: string;
  email: string;
  password: string;
}

const SignUp = () => {
  
  const router = useRouter()
  const { toast } = useToast()
  const { register, handleSubmit, watch,  formState: { errors } } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [userNameMessage, setUsernameMessage] = useState<string>()
  const [isCheckingUsername,setIsCheckingUsername] = useState<boolean>()
  const debounceValue = useDebounce(watch("username"), 500)

  


  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debounceValue) {
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
          const response = await axios.get(`/api/usr-name-unique?username=${debounceValue}`)
          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setUsernameMessage(axiosError.response?.data.message ?? "Error checking username")
        } finally {
          setIsCheckingUsername(false)
        }
      } 
    }
    checkUsernameUnique()

  }, [debounceValue])


  // Handle form submission
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true)
    try {
        await axios.post("/api/sign-up", data)
        toast({
            title: "sign-up successful"
        })
        
        router.replace(`/verify/${data.username}`)
    } catch(err) {
        const axiosError = err as AxiosError<ApiResponse>
        toast({
            title: "sign-up error",
            description: axiosError.response?.data.message,
            variant: "destructive"
        })
    }  finally {
        setIsSubmitting(false)
    }
  };

  return (
    <div className="max-w-md w-full p-6 mx-auto bg-white rounded-lg shadow-lg m-40">
      <h2 className="text-2xl font-bold text-center mb-2">🥷🏿 SHADOW TALKS</h2>
      <p className='text-center mb-6  text-xl'>Create an account</p>
      <form onSubmit={handleSubmit(onSubmit)}>

        {/* Username Field */}
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-semibold text-gray-700">Username</label>
          <input
            type="text"
            id="username"
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            {...register('username', { required: 'Username is required' })}
          />
          {}
          {isCheckingUsername && <Loader2 className='animate-spin'/>}
          <p className={`text-sm ${userNameMessage === "Username is available" ? 'text-green-400' : 'text-red-600'} mt-2`}>{userNameMessage}</p>
          {errors.username && <p className="text-sm text-red-500 mt-2">{errors.username.message}</p>}
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            {...register('email', { 
              required: 'Email is required', 
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Invalid email format'
              }
            })}
          />
          {errors.email && <p className="text-sm text-red-500 mt-2">{errors.email.message}</p>}
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' }
            })}
          />
          {errors.password && <p className="text-sm text-red-500 mt-2">{errors.password.message}</p>}
        </div>

        {/* Submit Button */}
     
        <button
          type="submit"
          className="w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing Up..." : "Sign Up"}
        </button>
        <div className="text-center mt-4">
          Already a member ? {' '}
          <Link href='/sign-in' className="text-blue-400 hover:text-blue-800">
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
