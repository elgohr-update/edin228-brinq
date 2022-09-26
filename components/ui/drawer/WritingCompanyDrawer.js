import { Button, Tooltip, useTheme } from '@nextui-org/react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import HiddenBackdrop from '../../util/HiddenBackdrop'
import {
  ClientDrawerWrapper,
  useClientDrawerContext,
  useWritingCompanyDrawerContext,
} from '../../../context/state'
import {
  getConstantIcons,
  sumFromArrayOfObjects,
  timeout,
  useNextApi,
} from '../../../utils/utils'
import { useRouter } from 'next/router'
import DrawerLoader from '../loaders/DrawerLoader'
import { motion } from 'framer-motion'
import LineIcon from '../../util/LineIcon'
import SummaryCard from '../card/SummaryCard'
import CarrierSummaryCard from '../card/CarrierSummaryCard'
import PanelTitle from '../title/PanelTitle'
import CompanyPerformanceChart from '../../charts/CompanyPerformanceChart'
import { AiOutlineClose } from 'react-icons/ai'
import CompanyPremAndVolumeChart from '../../charts/CompanyPremAndVolumeChart'
import ClientDrawer from './ClientDrawer'

const WritingCompanyDrawer = () => {
  const { writingCompanyDrawer, setWritingCompanyDrawer } =
    useWritingCompanyDrawerContext()
  const { clientDrawer, setClientDrawer } = useClientDrawerContext()
  const router = useRouter()
  const { type } = useTheme()
  const [company, setCompany] = useState(null)
  const [clients, setClients] = useState(null)
  const [parents, setParents] = useState(null)
  const [parentsChartData, setParentsChartData] = useState(null)
  const [performance, setPerformance] = useState(null)

  const [showParentData, setShowParentData] = useState(true)
  const [showPerformance, setShowPerformance] = useState(true)

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
      await timeout(100)
      if (!isCancelled) {
        fetchData()
        fetchClients()
        fetchParents()
        fetchPerformance()
      }
    }
    handleChange()
    return () => {
      isCancelled = true
    }
  }, [])

  useEffect(() => {
    router.events.on('routeChangeStart', () => {
      closeDrawer()
    })
  }, [router.events])

  const fetchData = async () => {
    const companyId = writingCompanyDrawer.companyId
    const res = await useNextApi('GET', `/api/company/writing/${companyId}`)
    setCompany(res)
  }
  const fetchClients = async () => {
    const companyId = writingCompanyDrawer.companyId
    const res = await useNextApi(
      'GET',
      `/api/company/writing/${companyId}/clients`
    )
    setClients(res)
  }
  const fetchParents = async () => {
    const companyId = writingCompanyDrawer.companyId
    const res = await useNextApi(
      'GET',
      `/api/company/writing/${companyId}/parents`
    )
    const formatted = res?.filter((x) => x.policies.length > 0)
    setParents(formatted)
    const labels = []
    const data = { premium: [], policies: [] }
    formatted?.forEach((r) => {
      labels.push(r.name)
      let prem = sumFromArrayOfObjects(r.policies, 'premium')
      data.premium.push(prem)
      data.policies.push(r.policies.length)
    })
    setParentsChartData({ labels, data })
  }
  const fetchPerformance = async () => {
    const companyId = writingCompanyDrawer.companyId
    const res = await useNextApi(
      'GET',
      `/api/company/writing/${companyId}/performance`
    )
    setPerformance(res)
  }

  const closeDrawer = () => {
    const setDefault = {
      isOpen: false,
      companyId: null,
    }
    setWritingCompanyDrawer(setDefault)
  }

  const premSum = () => {
    return sumFromArrayOfObjects(clients?.policies, 'premium')
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
      className={`fixed top-0 left-0 z-[999999]`}
    >
      <div
        className={`fixed right-0 flex h-full w-full flex-col overflow-hidden xl:w-[1000px] ${type}-shadow panel-theme-${type}`}
      >
        {!company ? (
          <DrawerLoader />
        ) : (
          <div className="flex flex-auto shrink-0 flex-col overflow-hidden py-4">
            <div className="relative flex flex-col px-2 pb-2 font-bold">
              <div className="flex w-full flex-col text-left xl:flex-row xl:items-center xl:justify-between">
                <div className="flex text-left">{company.name}</div>
                <div className="flex space-x-2">
                  <div className="flex items-center justify-center">
                    <Tooltip content={'Commercial Lines'}>
                      <LineIcon
                        iconSize={18}
                        size="sm"
                        line={'Commercial Lines'}
                        active={company.cl}
                      />
                    </Tooltip>
                  </div>
                  <div className="flex items-center justify-center">
                    <Tooltip content={'Personal Lines'}>
                      <LineIcon
                        iconSize={18}
                        size="sm"
                        line={'Personal Lines'}
                        active={company.pl}
                      />
                    </Tooltip>
                  </div>
                  <div className="flex items-center justify-center">
                    <Tooltip content={'Benefits'}>
                      <LineIcon
                        iconSize={18}
                        size="sm"
                        line={'Benefits'}
                        active={company.b}
                      />
                    </Tooltip>
                  </div>
                </div>
                <div
                  className="absolute top-0 right-[10px] flex text-3xl font-bold md:hidden"
                  onClick={() => closeDrawer()}
                >
                  {getConstantIcons('circleX')}
                </div>
              </div>
              <div className={`bottom-border-flair pink-to-blue-gradient-1`} />
            </div>
            <div className="flex h-[90vh] w-full flex-col overflow-y-auto xl:h-[94vh]">
              <div className="flex shrink-0 items-center space-x-2 overflow-x-auto p-4">
                <SummaryCard
                  vertical={false}
                  isIcon={true}
                  val={premSum()}
                  panel
                  shadow
                  color="teal"
                  gradientColor="green-to-blue-2"
                  icon={getConstantIcons('dollarSign')}
                  title="Premium"
                  money
                />
                <SummaryCard
                  vertical={false}
                  val={clients?.clients.length}
                  color="fuchsia"
                  gradientColor="pink-to-blue"
                  panel
                  shadow
                  title="Clients"
                  icon={getConstantIcons('client')}
                />
                <SummaryCard
                  vertical={false}
                  val={clients?.policies.length}
                  color="fuchsia"
                  gradientColor="orange-to-red-2"
                  panel
                  shadow
                  title="Policies"
                  icon={getConstantIcons('policy')}
                />
              </div>
              <div className="mt-2 flex w-full flex-col px-4">
                <div className="flex pl-4">
                  <PanelTitle title={`Performance`} color="teal" />
                  <div
                    className="flex cursor-pointer items-center px-2 text-xs"
                    onClick={() => setShowPerformance(!showPerformance)}
                  >
                    {showPerformance
                      ? getConstantIcons('up')
                      : getConstantIcons('down')}
                  </div>
                </div>
                {showPerformance ? (
                  <div className={`mb-4 flex h-full w-full`}>
                    <div className={`flex h-[200px] w-full rounded-lg`}>
                      <CompanyPerformanceChart fullData={performance} />
                    </div>
                  </div>
                ) : null}
              </div>
              {parents?.length > 0 ? (
                <div className="flex w-full flex-col px-4 xl:flex-row xl:gap-2">
                  <div className="flex flex-col space-y-2">
                    <div className="flex pl-4">
                      <PanelTitle title={`Parent Companies`} color="indigo" />
                      <div
                        className="flex cursor-pointer items-center px-2 text-xs"
                        onClick={() => setShowParentData(!showParentData)}
                      >
                        {showParentData
                          ? getConstantIcons('up')
                          : getConstantIcons('down')}
                      </div>
                    </div>
                    {showParentData ? (
                      <div
                        className={`flex h-auto xl:h-[375px] min-w-[200px] flex-col space-y-2 overflow-y-auto rounded-lg py-2 panel-theme-${type} ${type}-shadow `}
                      >
                        {parents?.map((p, i) => (
                          <motion.div
                            key={p.id}
                            className="flex w-full"
                            custom={i}
                            initial="hidden"
                            animate="visible"
                            variants={{
                              visible: {
                                opacity: 1,
                                transition: {
                                  delay: i * 0.1,
                                },
                                y: 0,
                              },
                              hidden: { opacity: 0, y: -10 },
                            }}
                            transition={{ ease: 'easeInOut', duration: 0.25 }}
                          >
                            <CarrierSummaryCard data={p} />
                          </motion.div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  {showParentData && parents ? (
                    <div className={`flex h-full w-full`}>
                      <div className={`flex h-[425px] w-full rounded-lg`}>
                        <CompanyPremAndVolumeChart
                          fullData={parentsChartData}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div className="flex w-full flex-col px-4">
                <div className="flex pl-4">
                  <PanelTitle title={`Clients`} color="orange" />
                </div>
                <div>table</div>
              </div>
            </div>
          </div>
        )}
        {/* {!company ? null : (
          <div className="flex shrink-0 justify-end px-2 pt-1 pb-4">
            <Link href={`/company/${writingCompanyDrawer.companyId}`}>
              <a className="w-full">
                <Button color="gradient" className="w-full">
                  View More
                </Button>
              </a>
            </Link>
          </div>
        )} */}
      </div>
      {writingCompanyDrawer.isOpen && !clientDrawer.isOpen ? (
        <HiddenBackdrop onClick={() => closeDrawer()} />
      ) : null}
    </motion.div>
  )
}

export default WritingCompanyDrawer
