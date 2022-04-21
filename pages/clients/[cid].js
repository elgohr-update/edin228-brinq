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
import { reverseList, useApi } from '../../utils/utils'
import Panel from '../../components/ui/panel/Panel'
import ClientDataNavbar from '../../components/client/ClientDataNavbar'
import ClientActionNavbar from '../../components/client/ClientActionNavbar'
import ClientPolicyInfo from '../../components/client/ClientPolicyInfo'

export default function Client({ client, events, emails, activity, policyTypes }) {
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

  return (
    <div className="relative flex h-full w-full flex-1 flex-col overflow-y-auto md:flex-row md:overflow-hidden">
      <div className="flex w-full flex-col">
        <div className="flex w-full flex-col overflow-hidden md:flex-row">
          <div
            className={`relative flex w-full flex-col space-y-2 py-4 px-4 md:w-[300px] md:py-0`}
          >
            <ClientHeader client={client} />
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
            <div className="flex items-center justify-between">
              <ClientDataNavbar />
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
            {
              state.client.dataNavbar === 1 ?
              <div className="flex flex-col w-full md:overflow-hidden">
                <div>
                  <ClientPolicyInfo client={client} policyTypes={policyTypes} policies={getPolicies(true)} />
                </div>
                <div
                  className={`flex h-full flex-1 flex-col space-y-2 overflow-y-auto px-4 py-2 md:max-h-[89vh]`}
                >
                  {getPolicies().map((u) => (
                    <Panel flat key={u.id} overflow={false} px={0} py={0}>
                      <PolicyCard policy={u} truncate={60} />
                    </Panel>
                  ))}
                </div>
              </div>
              : null
            }
            
          </div>
        </div>
      </div>
      <div
        className={`flex w-full flex-col pb-2 md:w-4/12 md:overflow-hidden`}
      >
        <div className="md:px-4">
          <ClientActionNavbar />
        </div>
        <div className="md:overflow-y-auto md:px-4">
          {
            state.client.actionNavbar === 1 ?
              <ClientActivity activity={activity} />
            : null
          }
        </div>
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
    const client = await useApi('GET',`/clients/${cid}`,session.accessToken)
    const events = await useApi('GET',`/events/client/${cid}`,session.accessToken)
    const emails = await useApi('GET',`/emails/client/${cid}`,session.accessToken)
    const activity = await useApi('GET',`/activity/client/${cid}`,session.accessToken)
    const policyTypes = await useApi('GET',`/policytypes/`, session.accessToken)

    return { props: { client, events, emails, activity, policyTypes } }
  }
  return { props: { client: null, events: null, emails: null, activity: null, policyTypes:null } }
}
