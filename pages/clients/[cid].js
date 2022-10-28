import { Button, Switch, Tooltip, useTheme } from '@nextui-org/react'
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
  const { appHeader, setAppHeader } = useAppHeaderContext()
  const [showActive, setShowActive] = useState(true)
  const [client, setClient] = useState(null)
  const [policies, setPolicies] = useState([])

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
      await timeout(100)
      if (!isCancelled && data) {
        setClient(data)
        setPolicies(data?.policies)
        setAppHeader({
          ...appHeader,
          titleContent: <ClientHeader client={data} />,
        })
      }
    }
    handleChange()
    return () => {
      isCancelled = true
    }
  }, [data])

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

  useEffect(() => {
    setAppHeader({
      ...appHeader,
      titleContent: <ClientHeader client={client} />,
    })
  }, [])

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
              (x) =>
                !x.renewed &&
                !x.canceled &&
                !x.nottaken &&
                !x.nonrenewed &&
                !x.rewritten
            ),
            'expiration_date',
            false
          )
        )
      : reverseList(sortByProperty(policies, 'expiration_date', false))
  }

  const syncAms = async () => {
    const clientId = router.query.cid
    const res = await useNextApi('GET', `/api/clients/${clientId}/ams360/sync`)
    await timeout(10000)
    setReload({
      ...reload,
      policies: true,
    })
  }

  const openActivity = () => {
    setActivityDrawer({ isOpen: true, clientId: router.query.cid })
  }

  const openAMS360Page = () => {
    const URL = `https://www.ams360.com/v2212631/nextgen/Customer/Detail/${data.ams360_customer_id}`
    window.open(URL, '_blank')
  }

  return (
    <div className="relative flex h-full w-full flex-auto shrink-0 flex-col overflow-y-auto overflow-x-hidden xl:max-h-[92.6vh] xl:flex-row xl:overflow-hidden">
      <div className="flex flex-auto shrink-0 xl:w-2/12 xl:py-0 xl:pb-8">
        <div
          className={`relative flex flex-auto  flex-col space-y-2 py-4 px-4`}
        >
          <ClientInfo flat={true} shadow={true} noBg={false} client={client} />
          <ClientContacts
            flat={true}
            shadow={true}
            noBg={false}
            client={client}
          />
        </div>
      </div>
      <div className="flex flex-col flex-auto shrink-0 xl:w-6/12 xl:overflow-hidden">
        <div className="flex items-center justify-between shrink-0">
          <ClientDataNavbar />
          <div className="flex items-center py-2 pr-2 space-x-2 xl:justify-end xl:py-0">
            <div className="flex items-center space-x-1">
              {/* <Button size="xs" flat auto>
                <BiPaperPlane />
              </Button>
              <Button size="xs" flat auto>
                <BsChatLeftQuoteFill />
              </Button> */}
              <Tooltip content="Create Activity / Suspense">
                <Button size="xs" flat auto onClick={() => openActivity()}>
                  <RiPlayListAddFill />
                </Button>
              </Tooltip>
              <Tooltip content="Open in AMS360">
                <Button size="xs" flat auto onClick={() => openAMS360Page()}>
                  <BiLinkExternal />
                </Button>
              </Tooltip>
              <Tooltip content="Re-Synce with AMS360">
                <Button size="xs" flat auto onClick={() => syncAms()}>
                  <BiRefresh />
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>
        {state.client.dataNavbar === 1 ? (
          <div className="flex flex-col flex-auto w-full shrink-0 xl:overflow-hidden">
            <div className="flex items-center w-full px-4 shrink-0">
              <ClientPolicyInfo client={client} policies={getPolicies(true)} />
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
              className={`flex h-auto flex-auto shrink-0 flex-col space-y-2 px-4 py-2 xl:max-h-[82vh] xl:overflow-y-auto xl:pb-8`}
            >
              {getPolicies(showActive).map((u, indx) => (
                <Panel
                  animationDelay={indx}
                  flat
                  key={u.id}
                  overflow={false}
                  px={0}
                  py={0}
                >
                  <PolicyCard policy={u} truncate={60} />
                </Panel>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <div
        className={`mt-4 flex flex-auto flex-col pb-2 xl:mt-0 xl:w-4/12 xl:overflow-hidden`}
      >
        <div className="xl:px-4">
          <ClientActionNavbar />
        </div>
        <div className="xl:overflow-y-auto xl:px-4">
          {state.client.actionNavbar === 1 && client ? (
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
