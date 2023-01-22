import { getCookie } from 'cookies-next'
import { rcsdk } from '../../utils/ringcentral'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import AppLayout from '../../layouts/AppLayout'
import { timeout } from '../../utils/utils'
import { Loading } from '@nextui-org/react'

function RCRedirect() {
  const router = useRouter()
  const { code } = router.query
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
      const cv = getCookie('codeVerifier')
      if (cv && code && !isCancelled) {
        const loginOptions = {
          code: code,
          code_verifier: cv,
        }
        const login = await rcsdk.login(loginOptions).then(async (e) => {
          router.replace('/dashboard')
        })
      }
    }
    handleChange()
    return () => {
      isCancelled = true
    }
  }, [router])

  return (
    <div className="flex w-full h-full">
      <div className="flex flex-col items-center justify-center w-full xl:mt-[-200px]">
        <Loading size="xl" color="primary" textColor="primary" />
        <div className="mt-5 tracking-widest uppercase opacity-80">Loading</div>
      </div>
    </div>
  )
}

export default RCRedirect

RCRedirect.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>
}

// export default async function handler(req, res) {
//   const router = Router

//   const { query } = req
//   const cv = getCookie('codeVerifier', { req, res })
//   if (cv) {
//     const loginOptions = {
//       code: query.code,
//       code_verifier: cv,
//     }
//     const login = await rcsdk.login(loginOptions).then(async (e) => {
//       res.status(200).json(e.body)
//     })
//   }
// }
