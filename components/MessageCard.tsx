'use client'

import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from './ui/button'
import { X } from 'lucide-react'
import { Message } from '@/model/User'
import { useToast } from '@/hooks/use-toast'
import axios, { AxiosError } from 'axios'
import ApiResponse from '@/schema/apiResponse'


type MessageCardProps = {
    message: Message,
    onMessageDelete: (messageID: string) => void
}
const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
    
    const { toast } = useToast()
    const handleDeleteConfirm = async () => {
        
        try {
        
        const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
        toast({
            title: response.data.message,
        })
        onMessageDelete(message._id as string)
    } catch(error) {
        const axiosError  = error as AxiosError<ApiResponse>
        toast({
            title: 'Error Deleting Message',
            description: axiosError.response?.data.message,
            variant: 'destructive'
        })
    }
    }

    const date = new Date(message.createdAt)
    const formattedDate = date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });


    return (
        <Card>
            <CardHeader>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                    <div className="flex justify-end">
  <Button
    className="bg-red-500 hover:bg-red-600 text-white font-medium rounded-md flex items-center justify-center"
  >
    Delete
  </Button>
</div>

                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                message and remove your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <CardContent><p className='text-xl'>{message.content}</p></CardContent>
            </CardHeader>
            <CardFooter>
                <p>{formattedDate}</p>
            </CardFooter>
        </Card>

    )
}

export default MessageCard