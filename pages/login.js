import { useTheme as useNextTheme } from 'next-themes'
import { Button, Input, Row, Switch, useTheme } from '@nextui-org/react'
import BlankLayout from '../layouts/BlankLayout'
import { AiFillLock } from 'react-icons/ai'
import { useSession, signIn, signOut, getProviders } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Login() {
  const { type } = useTheme()
  const { data: session } = useSession()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const router = useRouter()

  useEffect(() => {
    const checkDate = new Date() < new Date(session?.exp * 1000)
    if (session && checkDate) {
      router.push('/dashboard')
    }
  }, [session])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const signin = await signIn('username-login', { username, password })
  }

  return (
    <main className="flex items-center justify-center w-full h-full px-4 py-40">
      <div className={`flex h-full w-full flex-col rounded-lg xl:w-3/12`}>
        <div className="flex flex-col items-center h-full">
          <div className={`max-w-[50%] xl:max-w-[100%] w-full rounded-t md:px-24 py-4`}>
            <img src="/brinq-logo-full-color.png" alt="brinq" />
          </div>
          <h3 className="py-6 font-bold uppercase">Login</h3>
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="flex flex-col items-center w-full h-full px-8 py-4"
          >
            <div className="flex justify-center w-full mb-4">
              <Input
                aria-label="username"
                fullWidth
                onChange={(e) => setUsername(e.target.value)}
                type="Email"
                labelLeft="@"
                placeholder="Email"
                className={`${type}-shadow w-full`}
              />
            </div>
            <div className="flex flex-col justify-center w-full mb-4">
              <Input
                aria-label="password"
                fullWidth
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                labelLeft={<AiFillLock />}
                placeholder="Password"
                className={`${type}-shadow w-full`}
              />
              <h4 className="flex justify-end w-full pr-4 mt-2 text-xs">
                Forgot Password?
              </h4>
            </div>
            <div className="flex justify-center w-full mt-2">
              <Button type="submit" color="gradient">
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
  return <BlankLayout>{page}</BlankLayout>
}
