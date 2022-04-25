import { Button, Loading, useTheme } from '@nextui-org/react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import HiddenBackdrop from '../../util/HiddenBackdrop'
import { useAppContext } from '../../../context/state'
import { BsBox, BsChevronDown, BsChevronUp } from 'react-icons/bs'
import PolicyCard from '../../policy/PolicyCard'
import { sumFromArrayOfObjects, timeout, useNextApi } from '../../../utils/utils'
import SummaryCard from '../card/SummaryCard'
import { AiFillDollarCircle, AiOutlineClose } from 'react-icons/ai'
import ClientHeader from '../../client/ClientTitle'
import ClientActivity from '../../client/ClientActivity'
import ClientContacts from '../../client/ClientContacts'
import ClientInfo from '../../client/ClientInfo'
import { useRouter } from 'next/router'
import ClientDrawerNavbar from '../../client/ClientDrawerNavbar'

const ClientDrawer = () => {
  const { state, setState } = useAppContext()
  const router = useRouter()
  const { month, year } = router.query
  const { type } = useTheme()
  const [client, setClient] = useState(null)
  const [policies, setPolicies] = useState([])
  const [showMore1, setShowMore1] = useState(false)

  useEffect(() => {
    let isCancelled = false;
    const handleChange = async () => {
      await timeout(100);
      if (!isCancelled){
        fetchClient().then(() => fetchPolicies())
      }
    }
    handleChange()
    return () => {
      isCancelled = true;
    }
  }, [])

  useEffect( () => {
    if (state.reloadTrigger.policies){
      let isCancelled = false;
      const handleChange = async () => {
        await timeout(100);
        if (!isCancelled){
          fetchPolicies()
          setState({
              ...state,reloadTrigger:{...state.reloadTrigger,policies:false}
          })
        }
      }
      handleChange()
      return () => {
        isCancelled = true;
      }  
    }
  },[state.reloadTrigger])

  useEffect(() => {
    router.events.on('routeChangeStart', () => {
      closeDrawer()
    })
  }, [router.events])

  const fetchClient = async () => {
    const clientId = state.drawer.client.clientId
    const res = await useNextApi(
      'GET',
      `/api/clients/${clientId}?onlyInfo=true`
    )
    setClient(res)
  }
  const fetchPolicies = async () => {
    const clientId = state.drawer.client.clientId
    const queryUrl = state.drawer.client.isRenewal
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
    setState({ ...state, drawer: { ...state.drawer, client: setDefault } })
  }
  const iconBg = () => {
    return client?.line === 'Commercial Lines'
      ? `bg-color-primary`
      : client?.line === 'Personal Lines'
      ? `bg-color-error`
      : client?.line === 'Benefits'
      ? `bg-color-success`
      : ''
  }

  return (
    <div className={`fixed top-0 left-0 z-[999999] flex h-full w-full`}>
      <div
        className={`fixed right-0 flex h-full w-full flex-col md:w-[800px] ${type}-shadow panel-theme-${type}`}
      >
        {!client ? (
          <div className="flex h-full w-full flex-1 items-center justify-center">
            <Loading
              type="points"
              size="xl"
              color="secondary"
              textColor="primary"
            />
          </div>
        ) : (
          <div className="flex h-full flex-1 py-4">
            <div className={`flex w-full flex-col`}>
              <div className={`relative mb-2 flex w-full px-2`}>
                <div className="relative flex w-full flex-col md:flex-row md:pt-2">
                  <ClientHeader client={client} />
                  <div className="flex w-full items-center justify-center pl-4 pr-8 md:justify-end">
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
                className={`mt-2 flex h-[78vh] w-full flex-col overflow-auto`}
              >
                <ClientInfo client={client} horizontal />
                <ClientContacts client={client} />
                <div className={`flex w-full flex-col`}>
                  <ClientDrawerNavbar />
                  {state.drawer.client.nav === 1 ? (
                    policies ? (
                      <div
                        className={`relative z-10 flex w-full flex-col rounded`}
                      >
                        <div
                          className={`flex h-full w-full flex-col space-y-1 overflow-hidden px-4 py-1 transition-all duration-100 ease-out`}
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
                      <div className="flex w-full items-center justify-center">
                        <Loading
                          type="points-opacity"
                          size="lg"
                          color="secondary"
                          textColor="primary"
                        />
                      </div>
                    )
                  ) : state.drawer.client.nav == 2 ? (
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
                {client? (
                  <div className="mt-4">
                    <ClientActivity clientId={state.drawer.client.clientId} />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
        {!client ? null : (
          <div className="flex w-full justify-end px-2 pt-1 pb-4">
            <Link href={`/clients/${state.drawer.client.clientId}`}>
              <a className="w-full">
                <Button shadow color="gradient" className="w-full">
                  View More
                </Button>
              </a>
            </Link>
          </div>
        )}
      </div>
      {state.drawer.client.isOpen ? (
        <HiddenBackdrop onClick={() => closeDrawer()} />
      ) : null}
    </div>
  )
}

export default ClientDrawer
