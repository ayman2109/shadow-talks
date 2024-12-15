'use client'


import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import React, { useCallback, useEffect, useState } from 'react'
import { Message } from "@/model/User"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { acceptingMessageSchema } from "@/schema/acceptMessageSchema"
import axios, { AxiosError } from "axios"
import  ApiResponse from "@/schema/apiResponse"
import z from "zod"
import { Button } from "@/components/ui/button"
import MessageCard from "@/components/MessageCard"
import { RefreshCcw, Loader2 } from 'lucide-react';
import { LoaderCircle } from "lucide-react"


const DashBoard = () => {
    
    const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [messages, setMessages] = useState<Array<Message>>([])
    const { setValue, watch, register  } = useForm<z.infer<typeof acceptingMessageSchema>>()
    const { toast } = useToast()

    const acceptMessages = watch("isAcceptingMessages")

    const { data: session } = useSession()

    const fetchAcceptingMessages = useCallback(async () => {
        setIsSwitchLoading(true)
        try {
            const response = await axios.get<ApiResponse>('/api/accept-messages')
            if (response.data.isAcceptingMessages) {
                setValue('isAcceptingMessages', response.data.isAcceptingMessages)
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: "Error",
                description: axiosError.response?.data.message,
                variant: "destructive"
            })
        }  finally {
            setIsSwitchLoading(false)
        }
    }, [setValue])

    const handleDeleteMessage = (messageID: string) => {
        
        setMessages(messages.filter(message => message._id != messageID))
    }

    const fetchMessages = useCallback(async ( refresh: boolean = false ) => {
        setIsLoading(true);
       
        try {
            const response = await axios.get<ApiResponse>('/api/get-messages')
            setMessages(response.data.messages || [])
            if(refresh) {
                toast({
                    title: "Refreshed Messages",
                    description: "Showing Latest messsages"
                   
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse> 
            toast({
                title: "Error",
                description: axiosError.response?.data.message || "Failed to load new messages",
                variant: "destructive"
            })
        }  finally {
            setIsLoading(false)
        }
    }, [setIsLoading, setIsSwitchLoading])
    
    const handleSwitchChange = async () => {
        try {
            console.log(acceptMessages)
            const response = await axios.post<ApiResponse>('/api/accept-messages', {
                acceptMessages: !acceptMessages
            });
    
            setValue('isAcceptingMessages', !acceptMessages);
            toast({
                title: response.data.message,
                description: "Message Acceptance Updated"
            });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description: axiosError.response?.data.message || "Failed to handle message settings",
                variant: "destructive"
            });
            setValue('isAcceptingMessages', acceptMessages);
        }
    };



    useEffect(() => {
        async function initialize() {
           
            await fetchAcceptingMessages()
            await fetchMessages()
            
        }
        initialize()
    }, [session, fetchAcceptingMessages, fetchMessages])

    if(!session || !session?.user) return <div className="text-center"> <LoaderCircle /> </div>

    
    const { username } = session?.user


    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const profileUrl = baseUrl + `/u/${username}`

    
    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl)
        toast({
            title: "URL copied"
        })
    }

    return (
    <>
       <div className="m-11 py-2">
        <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
            <div className="flex items-center">
              <input
                type="text"
                value={profileUrl}
                disabled
                className="input input-bordered w-full p-2 mr-2"
              />
              <Button onClick={copyToClipboard}>Copy</Button>
            </div>
        </div>


        <Switch 
      
         checked={acceptMessages}
         onCheckedChange={handleSwitchChange}
         disabled={isSwitchLoading}
        />
        
        <span className="ml-2">
              Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
        </div>

        <Separator />

        <Button
            className="m-5"
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )} Refresh
          </Button>

          
       
        <div className="m-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {messages.length > 0 ? (
              messages.map((message: Message, index) => (
                <MessageCard
                  key={message._id as string}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))
            ) : (
              <p>No messages to display.</p>
            )}
          </div>
    </>
   )
}

export default DashBoard

