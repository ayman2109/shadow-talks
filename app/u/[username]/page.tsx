'use client'

import Image from "../../../public/matrix-5361690_1280.png"

import { useToast } from '@/hooks/use-toast'
import axios, { AxiosError} from "axios"
import ApiResponse from '@/schema/apiResponse'
import { useForm, SubmitHandler } from 'react-hook-form'
import React from 'react'
import { useParams } from 'next/navigation'

type FormData = {
  content: string
}

const Page = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    mode: "onSubmit"
  });
  
  const { username } = useParams<{ username: string }>()
  const { toast } = useToast()

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
           username: username,
           content: data.content
      })
      
      toast({
        title: "You submitted the following values:",
        description: (
          <>
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data.content, null, 2)}</code>
          </pre>
          <div>{response.data.message}</div>
          </>
        ),
      })
    } catch(error) {
      const axiosError = error as AxiosError<ApiResponse>
      console.log(axiosError)
      toast ({
        title: "Error",
        description: axiosError.response?.data.message || "An occured",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center " style={{ backgroundImage: `url(${Image.src})`}}>
      <h2 className='text-2xl'>👤</h2>
      <h1 className='text-2xl text-white'>SHADOW TALKS - <span className='text-xl'>send message anonymously</span></h1>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg p-4 rounded-lg shadow-lg">
     
        <label className="block text-lg  mb-10 text-white">Send Message to {username}</label>
        
        <textarea
          {...register("content", { 
            required: "Message is required", 
            minLength: { value: 10, message: "Message must be at least 10 characters" }
          })}
          placeholder="Type your message here..."
          className="w-full h-90 p-4 bg-gray-800 text-white border border-gray-600 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        
        {errors.content && <p className="mt-2 text-red-500 text-sm">{errors.content.message}</p>}

        <button 
          type="submit"
          className="w-full mt-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-500"
          disabled={false}  // Disable button when necessary
        >
          Send Message
        </button>
      </form>
    </div>
  )
}

export default Page
