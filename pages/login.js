
import { useTheme as useNextTheme } from 'next-themes'
import { Button, Input, Row, Switch, useTheme } from '@nextui-org/react'
import BlankLayout from '../layouts/BlankLayout'
import { AiFillLock } from 'react-icons/ai';
import { useSession, signIn, signOut, getProviders } from "next-auth/react"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';


export default function Login() {
    const { type } = useTheme();
    const { data: session } = useSession()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    
    const router = useRouter();
    
    useEffect(() => {
        if (session) {
            router.push("/dashboard");
        }
    }, [session]);

    return (
        <main className="flex h-full w-full justify-center px-4 py-40 md:py-64 overflow-hidden items-center">      
            <div className={`flex flex-col w-full md:w-3/12 h-full rounded-lg panel-theme-${type} ${type}-shadow`}>
                <div className="flex flex-col items-center h-full">
                    <div className={`panel-theme-${type} rounded-t w-full px-24 md:px-40 py-4`}>
                        <img  src="/brinq-logo-full-color.png" alt="brinq" />
                    </div>
                    <h2 className="py-6 uppercase font-bold">Login</h2>
                    <form className="flex flex-col px-8 py-4 items-center h-full w-full">
                        <div className="flex justify-center mb-4 w-full">
                            <Input fullWidth onChange={(e) => setUsername(e.target.value)} type="Email" labelLeft="@" placeholder="Email"  className={`${type}-shadow w-full`}/>
                        </div>
                        <div className="flex flex-col justify-center mb-4 w-full">
                            <Input fullWidth onChange={(e) => setPassword(e.target.value)} type="password" labelLeft={<AiFillLock/>} placeholder="Password"  className={`${type}-shadow w-full`}/>
                            <div className="flex justify-end w-full text-xs mt-2">
                                Forgot Password?
                            </div>
                        </div>
                        <div className="mt-8 w-full flex justify-center">
                            <Button color="gradient" shadow onClick={() => signIn("credentials", { username, password })}>
                                Sign In
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    )
}

Login.getLayout = function getLayout(page) {
  return (
    <BlankLayout>
      {page}
    </BlankLayout>
  )
}