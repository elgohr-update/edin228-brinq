import { Button, useTheme } from '@nextui-org/react'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import PageHeader from '../../../components/ui/pageheaders/PageHeader'
import PageTitle from '../../../components/ui/pageheaders/PageTitle'
import { useAppContext } from '../../../context/state'
import AppLayout from '../../../layouts/AppLayout'
import { CgFileDocument } from 'react-icons/cg';
import { AiFillPlusCircle } from 'react-icons/ai';
import ProposalNavbar from '../../../components/ui/navbar/ProposalNavbar'
import CostComparisonContainer from '../../../components/costcomparison/CostComparisonContainer'

export default function CostComparison() {
  const router = useRouter()
  const { isDark, type } = useTheme()
  const { state, setState } = useAppContext()
  const [templates, setTemplates] = useState([])

  return (
    <main className="flex w-full flex-col h-full">
      <PageHeader>
        <PageTitle icon={<CgFileDocument />} text="Cost Comparison Templates" />
        <ProposalNavbar />
      </PageHeader>
      <div className="flex flex-col md:flex-row w-full h-full px-4 md:space-x-2">
            <div className={`flex flex-col md:w-[300px] p-2 panel-flat-${type} ${type}-shadow h-full rounded-lg`}>
                <Button color="gradient" size="sm">
                    <AiFillPlusCircle /> NEW
                </Button>
                <div className="flex flex-col w-full">
                    <div className="flex items-center justify-center py-4 border-b">
                        <h3>Templates</h3>
                    </div>
                    <div className="flex flex-col w-full overflow-y-auto">
                    {
                        templates.length < 1 ? 
                        <div className="flex items-center justify-center py-4">
                            <h4>No Templates</h4>
                        </div>
                        : null
                    }
                    </div>
                </div>
            </div>
            <CostComparisonContainer/>
      </div>
    </main>
  )
}

CostComparison.getLayout = function getLayout(page) {
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
