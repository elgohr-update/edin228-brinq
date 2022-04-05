import { User, useTheme } from '@nextui-org/react'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React from 'react'
import ClientActivity from '../../components/client/ClientActivity'
import ClientHeader from '../../components/client/ClientHeader'
import ContactCard from '../../components/contact/ContactCard'
import Panel from '../../components/ui/panel/Panel'
import { useAppContext } from '../../context/state'
import AppLayout from '../../layouts/AppLayout'

export default function Client({ client, events, emails, activity }) {
    const router = useRouter()
    const { isDark,type } = useTheme()
    const { state, setState } = useAppContext()
    return (
        <div className="flex flex-col relative md:flex-row w-full h-full flex-1 overflow-hidden">
            <div className="flex flex-col w-full">
              <div className="flex items-center w-full justify-between">
                <ClientHeader client={client} />
                <div className="flex justify-end">
                  <Panel noBg shadow={false}>
                    adsad
                  </Panel>
                </div>
              </div>
              <div className="flex flex-col md:flex-row w-full overflow-hidden">
                <div className={`relative flex flex-col space-y-2 w-full md:w-[300px] px-4 pb-2 overflow-x-hidden overflow-y-auto`}>
                    <Panel flat>
                      <div className="flex flex-col w-full">
                        <h4>
                          Contacts
                        </h4>
                        <div className={`flex flex-wrap w-full`}>
                            {client?.contacts.map( c => (
                                <ContactCard key={c.id} contact={c}  />
                            ))}
                        </div>
                      </div>
                    </Panel>
                    <Panel flat>
                      <div className="flex flex-col w-full">
                          <h4 className={`mb-2`}>
                              Reps
                          </h4>
                          <div className={`flex flex-wrap w-full space-y-2`}>
                              {client?.users.map( u => (
                                  <div className="flex" key={u.id}>
                                      <User 
                                          src={u.image_file}
                                          name={u.name}
                                      >
                                          {u.email}
                                      </User>
                                  </div>
                              ))}
                          </div>
                      </div>
                      <div className={`flex flex-col md:flex-row w-full py-2`}>
                          <div className={`flex flex-col w-full `}>
                              <h4 className={`mb-2`}>
                                  Address
                              </h4>
                              <div className="flex flex-col px-2">
                                  <h6>{client?.client_name}</h6>
                                  <h6>{client?.address}</h6>
                                  <div className="flex items-center space-x-1">
                                      <h6>{client?.city}{client?.city ? `,`:null}</h6>
                                      <h6>{client?.state}</h6>
                                      <h6>{client?.zipcode}</h6>
                                  </div>
                              </div>
                          </div>
                      </div>
                    </Panel>
                </div>
                <div className={`flex flex-col h-full flex-1`}>
                  asdasda
                </div>  
              </div>
            </div>
            <div className={`flex w-4/12 pl-4 pb-2 overflow-hidden`}>
              <Panel flat>
                <h4>Recent Activity</h4>
                <ClientActivity activity={activity} />
              </Panel>
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