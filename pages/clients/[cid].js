import { Button, useTheme } from '@nextui-org/react'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React from 'react'
import ClientActivity from '../../components/client/ClientActivity'
import ClientContacts from '../../components/client/ClientContacts'
import ClientHeader from '../../components/client/ClientTitle'
import ClientInfo from '../../components/client/ClientInfo'
import { useAppContext } from '../../context/state'
import AppLayout from '../../layouts/AppLayout'
import { BiPaperPlane, BiLinkExternal, BiRefresh } from 'react-icons/bi'
import { BsChatLeftQuoteFill } from 'react-icons/bs'
import { RiPlayListAddFill } from 'react-icons/ri'
import PolicyCard from '../../components/policy/PolicyCard'
import { reverseList, sumFromArrayOfObjects } from '../../utils/utils'
import Panel from '../../components/ui/panel/Panel'
import SummaryCard from '../../components/ui/card/SummaryCard'
import { AiFillDollarCircle } from 'react-icons/ai'
import { BsBox } from 'react-icons/bs'

export default function Client({ client, events, emails, activity }) {
  const router = useRouter()
  const { isDark, type } = useTheme()
  const { state, setState } = useAppContext()

  const getPolicies = (active = false) => {
    return active
      ? reverseList(
          client.policies.filter(
            (x) =>
              !x.renewed &&
              !x.canceled &&
              !x.nottaken &&
              !x.nonrenewed &&
              !x.ams360quote
          )
        )
      : reverseList(client.policies)
  }

  const premSum = () => {
    return sumFromArrayOfObjects(client.policies, 'premium')
  }

  return (
    <div className="relative flex h-full w-full flex-1 flex-col overflow-y-auto md:flex-row md:overflow-hidden">
      <div className="flex w-full flex-col">
        <div className="flex w-full flex-col items-center justify-between md:flex-row">
          <ClientHeader client={client} />
          <div className="flex w-full flex-col items-center md:flex-row md:justify-between">
            <div className="flex w-full items-center justify-between md:justify-start">
              <SummaryCard
                isIcon={false}
                autoWidth
                val={premSum()}
                color="teal"
                gradientColor="green-to-blue-2"
                icon={<AiFillDollarCircle />}
                title="Premium"
                money
              />
              <SummaryCard
                isIcon={false}
                autoWidth
                val={getPolicies(true).length}
                color="fuchsia"
                gradientColor="orange-to-red-2"
                title="Policies"
                icon={<BsBox />}
              />
            </div>
            <div className="flex items-center space-x-2 py-2 md:justify-end md:py-0">
              <Button.Group size="xs" flat>
                <Button>
                  <BiPaperPlane />
                </Button>
                <Button>
                  <BsChatLeftQuoteFill />
                </Button>
                <Button>
                  <RiPlayListAddFill />
                </Button>
                <Button>
                  <BiLinkExternal />
                </Button>
                <Button>
                  <BiRefresh />
                </Button>
              </Button.Group>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col overflow-hidden md:flex-row">
          <div
            className={`relative flex w-full flex-col space-y-2 py-4 px-4 md:w-[300px] md:py-0`}
          >
            <ClientInfo
              flat={true}
              shadow={true}
              noBg={false}
              client={client}
            />
            <ClientContacts
              flat={true}
              shadow={true}
              noBg={false}
              client={client}
            />
          </div>
          <div className="flex h-full w-full flex-col overflow-hidden">
            <div className="flex items-center justify-center space-x-2 px-4 pb-1 md:justify-start">
              <div>Policies</div>
              <div>Deals</div>
              <div>Quotes</div>
              <div>Emails</div>
              <div>Suspenses</div>
            </div>
            <div
              className={`flex h-full flex-1 flex-col space-y-2 overflow-y-auto px-4 py-2 md:max-h-[81vh]`}
            >
              {getPolicies().map((u) => (
                <Panel flat key={u.id} overflow={false} px={0} py={0}>
                  <PolicyCard policy={u} />
                </Panel>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div
        className={`flex w-full flex-col pb-2 md:w-4/12 md:overflow-y-auto md:px-4`}
      >
        <h4 className="flex w-full items-center px-4">Recent Activity</h4>
        <ClientActivity activity={activity} />
      </div>
    </div>
  )
}

Client.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>
}

export async function getServerSideProps(context) {
  const { cid } = context.params
  const session = await getSession(context)
  if (session) {
    const clientRes = await fetch(
      `${process.env.FETCHBASE_URL}/clients/${cid}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    )
    const client = await clientRes.json()
    const eventsRes = await fetch(
      `${process.env.FETCHBASE_URL}/events/client/${cid}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    )
    const events = await eventsRes.json()
    const emailsRes = await fetch(
      `${process.env.FETCHBASE_URL}/emails/client/${cid}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    )
    const emails = await emailsRes.json()
    const activityRes = await fetch(
      `${process.env.FETCHBASE_URL}/activity/client/${cid}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    )
    const activity = await activityRes.json()

    return { props: { client, events, emails, activity } }
  }
  return { props: { client: null, events: null, emails: null, activity: null } }
}
