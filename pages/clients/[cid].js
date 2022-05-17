import { Button, Switch, useTheme } from '@nextui-org/react'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import ClientActivity from '../../components/client/ClientActivity'
import ClientContacts from '../../components/client/ClientContacts'
import ClientHeader from '../../components/client/ClientTitle'
import ClientInfo from '../../components/client/ClientInfo'
import {
  useActivityDrawerContext,
  useAppContext,
  useAppHeaderContext,
  useReloadContext,
} from '../../context/state'
import AppLayout from '../../layouts/AppLayout'
import { BiPaperPlane, BiLinkExternal, BiRefresh } from 'react-icons/bi'
import { BsChatLeftQuoteFill } from 'react-icons/bs'
import { RiPlayListAddFill } from 'react-icons/ri'
import PolicyCard from '../../components/policy/PolicyCard'
import {
  reverseList,
  sortByProperty,
  timeout,
  useApi,
  useNextApi,
} from '../../utils/utils'
import Panel from '../../components/ui/panel/Panel'
import ClientDataNavbar from '../../components/client/ClientDataNavbar'
import ClientActionNavbar from '../../components/client/ClientActionNavbar'
import ClientPolicyInfo from '../../components/client/ClientPolicyInfo'

export default function Client({ data }) {
  const router = useRouter()
  const { isDark, type } = useTheme()
  const { state, setState } = useAppContext()
  const { activityDrawer, setActivityDrawer } = useActivityDrawerContext()
  const { reload, setReload } = useReloadContext()
  const {appHeader, setAppHeader} = useAppHeaderContext();
  const [showActive, setShowActive] = useState(true)
  const [client, setClient] = useState(data)
  const [policies, setPolicies] = useState(data?.policies)

  useEffect(() => {
    if (reload.policies) {
      let isCancelled = false
      const handleChange = async () => {
        await timeout(100)
        if (!isCancelled) {
          fetchPolicies()
          setReload({
            ...reload,
            policies: false,
          })
        }
      }
      handleChange()
      return () => {
        isCancelled = true
      }
    } else if (reload.client) {
      let isCancelled = false
      const handleChange = async () => {
        await timeout(100)
        if (!isCancelled) {
          fetchClient()
          setReload({
            ...reload,
            client: false,
          })
        }
      }
      handleChange()
      return () => {
        isCancelled = true
      }
    }
  }, [reload])

  useEffect( () => {
    setAppHeader({...appHeader,titleContent:<ClientHeader client={client} />})
  },[])

  const fetchClient = async () => {
    const clientId = router.query.cid
    const res = await useNextApi('GET', `/api/clients/${clientId}`)
    setClient(res)
  }

  const fetchPolicies = async () => {
    const clientId = router.query.cid
    const res = await useNextApi('GET', `/api/clients/${clientId}/policies`)
    setPolicies(res)
  }

  const getPolicies = (active = false) => {
    return active
      ? reverseList(
          sortByProperty(
            policies.filter(
              (x) => !x.renewed && !x.canceled && !x.nottaken && !x.nonrenewed && !x.rewritten
            ),
            'premium'
          )
        )
      : reverseList(sortByProperty(policies, 'premium'))
  }

  const syncAms = async () => {
    const clientId = router.query.cid
    const res = await useNextApi('GET', `/api/clients/${clientId}/ams360/sync`)
  }

  const openActivity = () => {
    setActivityDrawer({ isOpen: true, clientId: router.query.cid })
  }

  return (
    <div className="relative flex h-full w-full flex-1 flex-col max-h-[82vh] lg:max-h-[90vh] overflow-y-auto lg:flex-row lg:overflow-hidden">
      <div className="flex w-full flex-col">
        <div className="flex w-full flex-col lg:flex-row lg:overflow-hidden">
          <div
            className={`relative flex w-full flex-col space-y-2 py-4 px-4 lg:w-[400px] lg:py-0 lg:pb-8`}
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
          <div className="flex h-full w-full flex-col lg:overflow-hidden">
            <div className="flex items-center justify-between">
              <ClientDataNavbar />
              <div className="flex items-center space-x-2 py-2 lg:justify-end lg:py-0">
                <Button.Group size="xs" flat>
                  <Button>
                    <BiPaperPlane />
                  </Button>
                  <Button>
                    <BsChatLeftQuoteFill />
                  </Button>
                  <Button onClick={() => openActivity()}>
                    <RiPlayListAddFill />
                  </Button>
                  <Button>
                    <BiLinkExternal />
                  </Button>
                  <Button onClick={() => syncAms()}>
                    <BiRefresh />
                  </Button>
                </Button.Group>
              </div>
            </div>
            {state.client.dataNavbar === 1 ? (
              <div className="flex w-full flex-col lg:overflow-hidden">
                <div className="flex w-full items-center px-4">
                  <ClientPolicyInfo
                    client={client}
                    policies={getPolicies(true)}
                  />
                  <div>
                    <h4>Active</h4>
                    <Switch
                      checked={showActive}
                      size="xs"
                      onChange={(e) => setShowActive(e.target.checked)}
                    />
                  </div>
                </div>
                <div
                  className={`flex h-full flex-1 flex-col space-y-2 px-4 py-2 lg:max-h-[89vh] lg:overflow-y-auto lg:pb-8`}
                >
                  {getPolicies(showActive).map((u) => (
                    <Panel flat key={u.id} overflow={false} px={0} py={0}>
                      <PolicyCard policy={u} truncate={60} />
                    </Panel>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div
        className={`mt-4 flex w-full flex-col pb-2 lg:mt-0 lg:w-5/12 lg:overflow-hidden`}
      >
        <div className="lg:px-4">
          <ClientActionNavbar />
        </div>
        <div className="lg:overflow-y-auto lg:px-4">
          {state.client.actionNavbar === 1 ? (
            <ClientActivity clientId={client?.id} limit={50} />
          ) : null}
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
    const client = await useApi('GET', `/clients/${cid}`, session.accessToken)
    return { props: { data: client } }
  }
  return { props: { data: null } }
}
