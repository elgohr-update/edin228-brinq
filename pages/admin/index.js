import { useTheme } from '@nextui-org/react'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React from 'react'
import { useAppContext } from '../../context/state'
import { MdOutlineAdminPanelSettings } from 'react-icons/md'
import AdminLayout from '../../layouts/AdminLayout'
import PageHeader from '../../components/ui/pageheaders/PageHeader'
import PageTitle from '../../components/ui/pageheaders/PageTitle'
import PolicyTypeSettings from '../../components/admin/PolicyTypeSettings/PolicyTypeSettings'
import UsersControlPanel from '../../components/admin/users/UsersControlPanel'
import Agency from '../../components/admin/agency/Agency'
import AdminNavbar from '../../components/admin/AdminNavbar'

export default function Admin() {
  const router = useRouter()
  const { isDark, type } = useTheme()
  const { state, setState } = useAppContext()

  return (
    <main className="flex w-full flex-col">
      <PageHeader>
        <PageTitle icon={<MdOutlineAdminPanelSettings />} text="Admin" />
      </PageHeader>
      <div className="flex flex-col w-full pl-4">
          <AdminNavbar />
          <Agency />
          <PolicyTypeSettings />
          <UsersControlPanel />
      </div>
    </main>
  )
}

Admin.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>
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
