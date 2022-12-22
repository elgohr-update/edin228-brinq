import { Button, Tooltip, useTheme } from '@nextui-org/react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import HiddenBackdrop from '../../util/HiddenBackdrop'
import {
  useClientDrawerContext,
  useParentCompanyDrawerContext,
} from '../../../context/state'
import {
  downloadExcel,
  getIcon,
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
import CompanyPremAndVolumeChart from '../../charts/CompanyPremAndVolumeChart'
import CompanyClientsTable from '../../table/CompanyClientsTable'

const ParentCompanyDrawer = () => {
  const { parentCompanyDrawer, setParentCompanyDrawer } =
    useParentCompanyDrawerContext()
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
    const companyId = parentCompanyDrawer.companyId
    const res = await useNextApi('GET', `/api/company/parent/${companyId}`)
    console.log(res)
    setCompany(res)
  }
  const fetchClients = async () => {
    const companyId = parentCompanyDrawer.companyId
    const res = await useNextApi(
      'GET',
      `/api/company/parent/${companyId}/clients`
    )
    setClients(res)
  }
  const fetchParents = async () => {
    const companyId = parentCompanyDrawer.companyId
    const res = await useNextApi(
      'GET',
      `/api/company/parent/${companyId}/writing`
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
    const companyId = parentCompanyDrawer.companyId
    const res = await useNextApi(
      'GET',
      `/api/company/parent/${companyId}/performance`
    )
    setPerformance(res)
  }

  const closeDrawer = () => {
    const setDefault = {
      isOpen: false,
      companyId: null,
    }
    setParentCompanyDrawer(setDefault)
  }

  const premSum = () => {
    return sumFromArrayOfObjects(clients?.policies, 'premium')
  }

  const parentCompaniesExportData = parents?.map((x, indx) => {
    let format = {
      name: x.name,
      policies: x.policies.length,
      premium: sumFromArrayOfObjects(x.policies, 'premium'),
    }
    return format
  })

  const clientsExportData = clients?.clients?.map((x, indx) => {
    let format = {
      name: x.client_name,
      policies: x.policies.length,
      premiumWith: x.premium_with,
      totalPremium: x.total_premium,
    }
    return format
  })

  const policiesExportData = clients?.policies?.map((x, indx) => {
    let format = {
      client_name: x.client_name,
      policy_number: x.policy_number,
      line: x.line,
      policy_type: x.policy_type,
      poliy_type_full: x.policy_type_full,
      effective_date: x.effective_date,
      expiration_date: x.expiration_date,
      carrier: x.carrier,
      writing: x.writing,
      premium: x.premium,
    }
    const countAM = x.users.filter((x) => x.account_manager)
    const countAE = x.users.filter((x) => x.producer)

    countAM.forEach((u, i) => {
      format['account_manager_' + `${i + 1}`] = u.name
    })
    countAE.forEach((u, i) => {
      format['account_executive_' + `${i + 1}`] = u.name
    })
    return format
  })

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
      className={`fixed top-0 left-0 z-[999998] xl:z-[999999]`}
    >
      <div
        className={`fixed right-0 flex h-full w-full flex-col overflow-hidden md:w-[800px] ${type}-shadow panel-theme-sidebar-${type}`}
      >
        {!company ? (
          <DrawerLoader />
        ) : (
          <div className="flex flex-col flex-auto py-4 overflow-hidden shrink-0">
            <div className="relative flex flex-col px-2 pb-2 font-bold">
              <div className="flex flex-col w-full text-left xl:flex-row xl:items-center xl:justify-between">
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
                  {getIcon('circleX')}
                </div>
              </div>
              <div className={`bottom-border-flair pink-to-blue-gradient-1`} />
            </div>
            <div className="flex h-[90vh] w-full flex-col overflow-y-auto xl:mt-2 xl:h-[94vh]">
              <div className="flex items-center p-4 space-x-2 overflow-x-auto shrink-0">
                <SummaryCard
                  vertical={false}
                  isIcon={true}
                  val={premSum()}
                  panel
                  shadow
                  color="teal"
                  gradientColor="green-to-blue-2"
                  icon={getIcon('dollarSign')}
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
                  icon={getIcon('client')}
                />
                <SummaryCard
                  vertical={false}
                  val={clients?.policies.length}
                  color="fuchsia"
                  gradientColor="orange-to-red-2"
                  panel
                  shadow
                  title="Policies"
                  icon={getIcon('policy')}
                />
              </div>
              <div className="flex flex-col w-full px-4 mt-2">
                <div className="flex pl-4">
                  <PanelTitle title={`Performance`} color="teal" />
                  <div
                    className="flex items-center px-2 text-xs cursor-pointer"
                    onClick={() => setShowPerformance(!showPerformance)}
                  >
                    {showPerformance ? getIcon('up') : getIcon('down')}
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
                <div className="flex flex-col w-full px-4 xl:gap-2">
                  <div className="flex items-center w-full pl-4">
                    <PanelTitle title={`Writing Companies`} color="indigo" />
                    <div className="px-2">
                      <Button
                        color="success"
                        auto
                        ghost
                        size="xs"
                        icon={getIcon('spreadsheet')}
                        onClick={() =>
                          downloadExcel(
                            parentCompaniesExportData,
                            `${company.name}-WritingCompanies`
                          )
                        }
                      >
                        Export
                      </Button>
                    </div>
                    <div
                      className="flex items-center px-2 text-xs cursor-pointer"
                      onClick={() => setShowParentData(!showParentData)}
                    >
                      {showParentData ? getIcon('up') : getIcon('down')}
                    </div>
                  </div>
                  <div className="flex flex-col w-full lg:flex-row">
                    <div className="flex flex-col space-y-2">
                      {showParentData ? (
                        <div
                          className={`flex h-auto min-w-[200px] flex-col space-y-2 overflow-y-auto rounded-lg py-2 xl:h-[375px] `}
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
                </div>
              ) : null}

              <div className="flex flex-col w-full px-4">
                <div className="flex items-center w-full pl-4 space-x-2 lg:gap-2 lg:space-x-0">
                  <div className="flex">
                    <PanelTitle title={`Clients`} color="orange" />
                  </div>
                  <div>
                    <Button
                      color="success"
                      auto
                      ghost
                      size="xs"
                      icon={getIcon('spreadsheet')}
                      onClick={() =>
                        downloadExcel(
                          clientsExportData,
                          `${company.name}-Clients`
                        )
                      }
                    >
                      Export Clients
                    </Button>
                  </div>
                  <div>
                    <Button
                      color="success"
                      auto
                      ghost
                      size="xs"
                      icon={getIcon('spreadsheet')}
                      onClick={() =>
                        downloadExcel(
                          policiesExportData,
                          `${company.name}-Policies`
                        )
                      }
                    >
                      Export Policies
                    </Button>
                  </div>
                </div>
                <div>
                  {clients ? (
                    <CompanyClientsTable
                      data={clients?.clients}
                      companyId={company?.id}
                      writing={false}
                      parent={true}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* {!company ? null : (
          <div className="flex justify-end px-2 pt-1 pb-4 shrink-0">
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
      {parentCompanyDrawer.isOpen && !clientDrawer.isOpen ? (
        <HiddenBackdrop onClick={() => closeDrawer()} />
      ) : null}
    </motion.div>
  )
}

export default ParentCompanyDrawer
