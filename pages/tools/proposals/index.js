import { useTheme } from '@nextui-org/react'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React from 'react'
import { useAppContext } from '../../../context/state'
import AppLayout from '../../../layouts/AppLayout'

export default function Proposals() {
  const router = useRouter()
  const { isDark, type } = useTheme()
  const { state, setState } = useAppContext()

  return (
    <div className="relative flex h-full w-full flex-1 flex-col overflow-y-auto md:overflow-hidden">
      
    </div>
  )
}

Proposals.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>
}

// export async function getServerSideProps(context) {
//   const { cid } = context.params
//   const session = await getSession(context)
//   if (session) {
//     const client = await useApi('GET',`/clients/${cid}`,session.accessToken)
//     const events = await useApi('GET',`/events/client/${cid}`,session.accessToken)
//     const emails = await useApi('GET',`/emails/client/${cid}`,session.accessToken)
//     const activity = await useApi('GET',`/activity/client/${cid}`,session.accessToken)

//     return { props: { client, events, emails, activity } }
//   }
//   return { props: { client: null, events: null, emails: null, activity: null } }
// }
