"use client"
import { Button } from "./ui/button"
import { useSession } from "next-auth/react"
import { User } from "next-auth"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"

export const NavBar = () => {
    const router = useRouter()
    const { data: session, status } = useSession()
    
    if(status == "loading") {
        return <p className="text-2xl text-center mt-7 font-medium">Loading.....</p>
    }

    const user : User = session?.user as User
    return (
        <nav className="p-4 md:p-6 shadow-md">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <Link href="/">Shadow Talks</Link>
                {
                    session ? ( <>
                    <span>Welcome, {user.username} </span>
                    <Button onClick={async () => {
                    
                        await signOut()
    
                    }
                    }> LogOut </Button>
                    </>
                ) : (
                    <Button onClick={() => {
                        console.log('clicked')
                        router.replace('/sign-in')
                    }}> Login </Button>
                )
                }
            </div>
        </nav>
    )
}