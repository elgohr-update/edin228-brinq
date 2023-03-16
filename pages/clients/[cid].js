import { Button, Switch, Tooltip, useTheme } from '@nextui-org/react'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import ClientActivity from '../../components/client/ClientActivity'
import ClientContacts from '../../components/client/ClientContacts'
import ClientHeader from '../../components/client/ClientTitle'
import ClientInfo from '../../components/client/ClientInfo'
import {
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
  isLaptop,
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
import NewActivityModal from '../../components/activity/NewActivityModal'
import ClientFiles from '../../components/client/ClientFiles'
import ClientSuspense from '../../components/client/ClientSuspense'

export default function Client({ data }) {
  const router = useRouter()
  const { isDark, type } = useTheme()
  const { state, setState } = useAppContext()
  const { reload, setReload } = useReloadContext()
  const { appHeader, setAppHeader } = useAppHeaderContext()
  const [showActive, setShowActive] = useState(true)
  const [client, setClient] = useState(null)
  const [policies, setPolicies] = useState([])
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [activeTab, setActiveTab] = useState(1)

  const openNewActivity = () => {
    setShowActivityModal(true)
  }

  const closeActivityModal = () => {
    setShowActivityModal(false)
  }

  const setTabCallback = (e) => {
    setActiveTab(e)
  }

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
        setActiveTab(1)
      }
    }
    handleChange()
    return () => {
      isCancelled = true
    }
  }, [data])

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
      await timeout(100)
      if (client) {
        setClient(client)
        setPolicies(client?.policies)
        setAppHeader({
          ...appHeader,
          titleContent: <ClientHeader client={client} />,
        })
        setActiveTab(1)
      }
    }
    handleChange()
    return () => {
      isCancelled = true
    }
  }, [client])

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
    // syncAms()
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
                !x.rewritten &&
                !x.expired
            ),
            'expiration_date',
            false
          )
        )
      : reverseList(sortByProperty(policies, 'expiration_date', false))
  }

  const syncAms = async () => {
    const clientId = router.query.cid
    await useNextApi('GET', `/api/clients/${clientId}/ams360/sync`)
    await timeout(10000)
    setReload({
      ...reload,
      policies: true,
    })
  }

  const openAMS360Page = () => {
    const URL = `https://www.ams360.com/v2212631/nextgen/Customer/Detail/${data.ams360_customer_id}`
    window.open(URL, '_blank')
  }

  const checkLaptop = isLaptop()

  return (
    <div className="relative flex h-full w-full flex-auto shrink-0 flex-col overflow-x-hidden xl:max-h-[92.6vh] xl:flex-row xl:overflow-hidden">
      <div className="flex xl:flex-auto xl:shrink-0 xl:w-[320px] xl:py-0 xl:pb-8">
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
      <div className="flex flex-col xl:w-full xl:overflow-hidden">
        <div className="flex flex-col-reverse items-center xl:justify-between xl:flex-row shrink-0">
          <ClientDataNavbar activeTab={activeTab} setTabCallback={setTabCallback} />
          <div className="flex items-center justify-center py-2 pr-2 space-x-2 xl:justify-end xl:py-0">
            <div className="flex items-center space-x-1">
              <Tooltip content="Create Activity / Suspense">
                <Button size="xs" flat auto onClick={() => openNewActivity()}>
                  <div className="flex items-center xl:space-x-2">
                    <RiPlayListAddFill />
                    <div className="flex ">Create Activity</div>
                  </div>
                </Button>
              </Tooltip>
              <Tooltip content="Open in AMS360">
                <Button size="xs" flat auto onClick={() => openAMS360Page()}>
                  <div className="flex items-center xl:space-x-2">
                    <BiLinkExternal />
                    <div className="flex ">View in AMS360</div>
                  </div>
                </Button>
              </Tooltip>
              <Tooltip content="Re-Sync with AMS360">
                <Button size="xs" flat auto onClick={() => syncAms()}>
                  <div className="flex items-center xl:space-x-2">
                    <BiRefresh />
                    <div className="flex ">AMS360 Sync</div>
                  </div>
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>
        <div className="h-full overflow-y-auto">
          {activeTab === 1 ? (
            <div className="flex flex-col flex-auto w-full shrink-0 xl:overflow-hidden">
              <div className="flex items-center justify-end w-full px-4 shrink-0">
                {/* <ClientPolicyInfo
                  client={client}
                  policies={getPolicies(true)}
                /> */}
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
          {activeTab === 2 ? <ClientSuspense clientId={client?.id} /> : null }
          {activeTab === 3 ? <ClientActivity clientId={client?.id} limit={50} /> : null }
          {activeTab === 5 ? <ClientFiles files={client?.attachments} /> : null }
        </div>
      </div>
      {checkLaptop ? null : (
        <div
          className={`mt-4 flex shrink-0 flex-col pb-2 xl:mt-0 xl:w-[600px]`}
        >
          <div className="xl:px-4">
            <ClientActionNavbar />
          </div>
          <div className="flex w-full xl:overflow-y-auto xl:px-4">
            {state.client.actionNavbar === 1 && client ? (
              <ClientActivity clientId={client?.id} limit={50} />
            ) : null}
            {state.client.actionNavbar === 3 && client ? (
              <ClientFiles files={client?.attachments} />
            ) : null}
          </div>
        </div>
      )}

      <NewActivityModal
        open={showActivityModal}
        callBack={closeActivityModal}
        preLoadClient={{ id: data.id, name: data.client_name }}
      />
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
