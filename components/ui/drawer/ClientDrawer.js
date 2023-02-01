import { Button, Tooltip, useTheme } from '@nextui-org/react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import HiddenBackdrop from '../../util/HiddenBackdrop'
import {
  useAppHeaderContext,
  useClientDrawerContext,
  useReloadContext,
} from '../../../context/state'
import { BsBox, BsChevronDown, BsChevronUp } from 'react-icons/bs'
import { BiRefresh, BiLinkExternal } from 'react-icons/bi'
import PolicyCard from '../../policy/PolicyCard'
import {
  getIcon,
  sumFromArrayOfObjects,
  timeout,
  useNextApi,
} from '../../../utils/utils'
import { RiPlayListAddFill } from 'react-icons/ri'
import SummaryCard from '../card/SummaryCard'
import { AiFillDollarCircle, AiOutlineClose } from 'react-icons/ai'
import ClientHeader from '../../client/ClientTitle'
import ClientActivity from '../../client/ClientActivity'
import ClientContacts from '../../client/ClientContacts'
import ClientInfo from '../../client/ClientInfo'
import { useRouter } from 'next/router'
import ClientDrawerNavbar from '../../client/ClientDrawerNavbar'
import DrawerLoader from '../loaders/DrawerLoader'
import { motion } from 'framer-motion'
import { pusherHandler } from '../../../utils/pusher'
import NewActivityModal from '../../activity/NewActivityModal'

const ClientDrawer = ({
  clientId = null,
  isRenewal = false,
  companyId = null,
  parent = false,
  callBack = null,
}) => {
  const { clientDrawer, setClientDrawer } = useClientDrawerContext()
  const { appHeader, setAppHeader } = useAppHeaderContext()
  const { reload, setReload } = useReloadContext()
  const router = useRouter()
  const { month, year } = router.query
  const { type } = useTheme()
  const [client, setClient] = useState(null)
  const [policies, setPolicies] = useState([])
  const [showMore1, setShowMore1] = useState(true)
  const [showActivityModal, setShowActivityModal] = useState(false)

  const openNewActivity = () => {
    setShowActivityModal(true)
  }

  const closeActivityModal = () => {
    setShowActivityModal(false)
  }

  useEffect(() => {
    let isCancelled = false
    getData(isCancelled)
    return () => {
      isCancelled = true
    }
  }, [])

  const getData = async (isCancelled) => {
    await timeout(100)
    if (!isCancelled) {
      setAppHeader({ ...appHeader, lowZIndex: true })
      fetchClient().then(() => fetchPolicies())
    }
  }

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
    }
  }, [reload])

  useEffect(() => {
    router.events.on('routeChangeStart', () => {
      closeDrawer()
    })
  }, [router.events])

  const fetchClient = async () => {
    let cid = clientId ? clientId : clientDrawer.clientId
    const res = await useNextApi('GET', `/api/clients/${cid}?onlyInfo=true`)
    setClient(res)
  }
  const fetchPolicies = async () => {
    let cid = clientId ? clientId : clientDrawer.clientId
    const queryUrl = isRenewal ? `?month=${month}&year=${year}` : `?active=true`
    const res = await useNextApi(
      'GET',
      `/api/clients/${cid}/policies${queryUrl}`
    )
    if (clientDrawer.companyId) {
      if (clientDrawer.parent) {
        let formatted = res?.filter(
          (x) => x.carrier_id == clientDrawer.companyId
        )
        setPolicies(formatted)
      } else {
        let formatted = res?.filter(
          (x) => x.writing_id == clientDrawer.companyId
        )
        setPolicies(formatted)
      }
    } else {
      setPolicies(res)
    }
  }

  const premSum = () => {
    return sumFromArrayOfObjects(policies, 'premium')
  }

  const toggleShowMore1 = () => {
    setShowMore1(!showMore1)
  }

  const getPolicies = () => {
    if (showMore1) {
      return policies
    }
    return policies.slice(0, 4)
  }

  const closeDrawer = () => {
    if (callBack) {
      setAppHeader({ ...appHeader, lowZIndex: false })
      callBack()
    } else {
      const setDefault = {
        isOpen: false,
        clientId: null,
        isRenewal: false,
        renewalMonth: null,
        renewalYear: null,
        nav: 1,
        style: 1,
        company_id: null,
        parent: false,
        writing: false,
      }
      setAppHeader({ ...appHeader, lowZIndex: false })
      setClientDrawer(setDefault)
    }
  }

  const syncAms = async () => {
    const res = await useNextApi('GET', `/api/clients/${client.id}/ams360/sync`)
    await timeout(10000)
    getData(false)
  }
  const openAMS360Page = () => {
    const URL = `https://www.ams360.com/v2212631/nextgen/Customer/Detail/${client.ams360_customer_id}`
    window.open(URL, '_blank')
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          opacity: 1,
          x: 0,
        },
        hidden: { opacity: 0, x: 200 },
      }}
      transition={{ ease: 'easeInOut', duration: 0.25 }}
      className={`fixed top-0 left-0 z-[999999] flex h-full w-full xl:z-[999998]`}
    >
      <div
        className={`fixed ${
          clientDrawer.style == 1 ? 'right-0' : 'xl:right-[800px]'
        }  flex h-full w-full flex-col overflow-hidden xl:w-[800px] ${type}-shadow panel-theme-sidebar-${type}`}
      >
        {!client ? (
          <DrawerLoader />
        ) : (
          <div className="flex flex-auto overflow-hidden py-4 xl:py-0">
            <div className={`flex w-full shrink-0 flex-col`}>
              <div className={`w-fullshrink-0 relative mb-2 flex px-2`}>
                <div className="relative flex flex-auto shrink-0 flex-col xl:flex-row xl:pt-2">
                  <ClientHeader client={client} />
                  <div className="flex flex-auto shrink-0 flex-col items-end ">
                    <div className="flex items-center pr-8">
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
                        val={policies.length}
                        color="fuchsia"
                        gradientColor="orange-to-red-2"
                        title="Policies"
                        icon={<BsBox />}
                      />
                    </div>
                    <div className="z-10 ml-4 flex space-x-1 py-2">
                      <Tooltip
                        content="Create Activity / Suspense"
                        placement="bottomEnd"
                      >
                        <Button
                          size="xs"
                          flat
                          auto
                          onClick={() => openNewActivity()}
                        >
                          <div className="flex items-center space-x-2">
                            <RiPlayListAddFill />
                            <div className="flex ">Create Activity</div>
                          </div>
                        </Button>
                      </Tooltip>
                      <Tooltip content="Open in AMS360" placement="bottomEnd">
                        <Button
                          size="xs"
                          flat
                          auto
                          onClick={() => openAMS360Page()}
                        >
                          <div className="flex items-center space-x-2">
                            <BiLinkExternal />
                            <div className="flex ">View in AMS360</div>
                          </div>
                        </Button>
                      </Tooltip>
                      <Tooltip
                        content="Re-Sync with AMS360"
                        placement="bottomEnd"
                      >
                        <Button size="xs" flat auto onClick={() => syncAms()}>
                          <div className="flex items-center space-x-2">
                            <BiRefresh />
                            <div className="flex ">AMS360 Sync</div>
                          </div>
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                  <div
                    className="absolute top-0 right-0 flex text-3xl font-bold xl:hidden"
                    onClick={() => closeDrawer()}
                  >
                    {getIcon('circleX')}
                  </div>
                </div>
                <div
                  className={`bottom-border-flair pink-to-blue-gradient-1`}
                />
              </div>
              <div
                className={`mt-2 flex w-full flex-auto flex-col overflow-auto`}
              >
                <ClientInfo client={client} horizontal />
                <ClientContacts client={client} />
                <div className={`flex shrink-0 flex-col`}>
                  <ClientDrawerNavbar />
                  {clientDrawer.nav === 1 ? (
                    policies ? (
                      <div
                        className={`relative z-10 flex shrink-0  flex-col rounded`}
                      >
                        <div
                          className={`flex shrink-0  flex-col space-y-1 overflow-hidden px-4 py-1 transition-all duration-100 ease-out`}
                        >
                          {getPolicies().map((u) => (
                            <PolicyCard key={u.id} policy={u} />
                          ))}
                        </div>
                        {policies.length > 4 ? (
                          <div className="absolute bottom-[-23px] z-20 flex w-full items-center justify-center">
                            <Button
                              onClick={() => toggleShowMore1()}
                              auto
                              size="xs"
                              color="gradient"
                              icon={
                                !showMore1 ? <BsChevronDown /> : <BsChevronUp />
                              }
                            ></Button>
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <DrawerLoader />
                    )
                  ) : clientDrawer.nav == 2 ? (
                    <div
                      className={`relative z-10 flex w-full flex-col rounded`}
                    >
                      <div
                        className={`flex w-full flex-col overflow-hidden px-1 py-4 ${
                          showMore1 ? `` : `max-h-[250px]`
                        } `}
                      ></div>
                      {client?.deals?.length > 5 ? (
                        <div className="absolute bottom-[-30px] z-20 flex w-full items-center justify-center">
                          <Button
                            onClick={() => toggleShowMore1()}
                            auto
                            size="xs"
                            color="gradient"
                            icon={
                              !showMore1 ? <BsChevronDown /> : <BsChevronUp />
                            }
                          ></Button>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
                {client ? (
                  <div className="mt-4 flex flex-auto shrink-0">
                    <ClientActivity clientId={client.id} />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
        {!client ? null : (
          <div className="flex shrink-0 justify-end px-2 pt-1 pb-4">
            <Link href={`/clients/${client.id}`}>
              <a className="w-full">
                <Button color="gradient" className="w-full">
                  View More
                </Button>
              </a>
            </Link>
          </div>
        )}
      </div>
      <NewActivityModal
        open={showActivityModal}
        callBack={closeActivityModal}
        preLoadClient={{ id: client?.id, name: client?.client_name }}
      />
      <HiddenBackdrop onClick={() => closeDrawer()} />
    </motion.div>
  )
}

export default ClientDrawer
