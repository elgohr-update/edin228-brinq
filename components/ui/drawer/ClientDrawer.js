import { Button, useTheme } from '@nextui-org/react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import HiddenBackdrop from '../../util/HiddenBackdrop'
import {
  useClientDrawerContext,
  useReloadContext,
} from '../../../context/state'
import { BsBox, BsChevronDown, BsChevronUp } from 'react-icons/bs'
import { BiRefresh } from 'react-icons/bi'
import PolicyCard from '../../policy/PolicyCard'
import {
  sumFromArrayOfObjects,
  timeout,
  useNextApi,
} from '../../../utils/utils'
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

const ClientDrawer = () => {
  const { clientDrawer, setClientDrawer } = useClientDrawerContext()
  const { reload, setReload } = useReloadContext()
  const router = useRouter()
  const { month, year } = router.query
  const { type } = useTheme()
  const [client, setClient] = useState(null)
  const [policies, setPolicies] = useState([])
  const [showMore1, setShowMore1] = useState(false)

  useEffect(() => {
    let isCancelled = false
    handleChange(isCancelled)
    return () => {
      isCancelled = true
    }
  }, [])

  const handleChange = async (isCancelled) => {
    await timeout(100)
    if (!isCancelled) {
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
    const clientId = clientDrawer.clientId
    const res = await useNextApi(
      'GET',
      `/api/clients/${clientId}?onlyInfo=true`
    )
    setClient(res)
  }
  const fetchPolicies = async () => {
    const clientId = clientDrawer.clientId
    const queryUrl = clientDrawer.isRenewal
      ? `?month=${month}&year=${year}`
      : `?active=true`
    const res = await useNextApi(
      'GET',
      `/api/clients/${clientId}/policies${queryUrl}`
    )
    setPolicies(res)
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
    const setDefault = {
      isOpen: false,
      clientId: null,
      isRenewal: false,
      renewalMonth: null,
      renewalYear: null,
      nav: 1,
    }
    setClientDrawer(setDefault)
  }

  const syncAms = async () => {
    const clientId = clientDrawer.clientId
    const res = await useNextApi('GET', `/api/clients/${clientId}/ams360/sync`)
    await timeout(10000)
    handleChange(false)
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
      className={`fixed top-0 left-0 z-[999999] flex h-full w-full`}
    >
      <div
        className={`fixed right-0 flex h-full w-full flex-col overflow-hidden md:w-[800px] ${type}-shadow panel-theme-${type}`}
      >
        {!client ? (
          <DrawerLoader />
        ) : (
          <div className="flex flex-auto overflow-hidden py-4">
            <div className={`flex w-full shrink-0 flex-col`}>
              <div className={`w-fullshrink-0 relative mb-2 flex px-2`}>
                <div className="relative flex flex-auto shrink-0 flex-col md:flex-row md:pt-2">
                  <ClientHeader client={client} />
                  <div className="flex flex-auto shrink-0 items-center justify-center pl-4 pr-8 md:justify-end">
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
                    <div className="flex ml-4">
                      <Button flat auto size="sm" onClick={() => syncAms()}>
                        <BiRefresh />
                      </Button>
                    </div>
                  </div>
                  <div
                    className="absolute top-0 right-0 flex md:hidden"
                    onClick={() => closeDrawer()}
                  >
                    <AiOutlineClose />
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
                <div className={`flex flex-auto shrink-0 flex-col`}>
                  <ClientDrawerNavbar />
                  {clientDrawer.nav === 1 ? (
                    policies ? (
                      <div
                        className={`relative z-10 flex flex-auto shrink-0  flex-col rounded`}
                      >
                        <div
                          className={`flex flex-auto shrink-0  flex-col space-y-1 overflow-hidden px-4 py-1 transition-all duration-100 ease-out`}
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
                    <ClientActivity clientId={clientDrawer.clientId} />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
        {!client ? null : (
          <div className="flex shrink-0 justify-end px-2 pt-1 pb-4">
            <Link href={`/clients/${clientDrawer.clientId}`}>
              <a className="w-full">
                <Button color="gradient" className="w-full">
                  View More
                </Button>
              </a>
            </Link>
          </div>
        )}
      </div>
      {clientDrawer.isOpen ? (
        <HiddenBackdrop onClick={() => closeDrawer()} />
      ) : null}
    </motion.div>
  )
}

export default ClientDrawer
