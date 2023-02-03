import { Button, Input, Modal, useTheme } from '@nextui-org/react'
import React from 'react'
import BackgroundFillSparkline from '../../charts/BackgroundFillSparkline'
import { motion } from 'framer-motion'
import {
  downloadExcel,
  getIcon,
  getSearch,
  isLaptop,
  isMobile,
  timeout,
} from '../../../utils/utils'
import { useEffect } from 'react'
import { useState } from 'react'
import { useAgencyContext } from '../../../context/state'
import { useSession } from 'next-auth/react'
import BrinqSelect from '../select/BrinqSelect'
import DashboardPolicyCard from '../../dashboard/policy/DashboardPolicyCard'
import ContactCard from '../../contact/ContactCard'
import ClientCard from '../../client/ClientCard'

export default function DashboardSummaryCard({
  gradient,
  shadow = false,
  shadowColor = 'green',
  title,
  icon,
  chartData = null,
  content = 0,
  colors = null,
  slice = true,
  toCurrentMonth = false,
  animationDelay = 0,
  useSparkline = true,
  useModal = false,
  data = [],
  usePolicyCard = false,
  useContactCard = false,
  useClientCard = false,
  useSmallHeight = false,
  useBgIcons = false,
}) {
  const { type } = useTheme()
  const { data: session } = useSession()
  const { agency, setAgency } = useAgencyContext()
  const [raw, setRaw] = useState(null)
  const [tableData, setTableData] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [lineFilter, setLineFilter] = useState([
    'Commercial Lines',
    'Personal Lines',
    'Benefits',
  ])
  const [lineFilterOptions, setLineFilterOptions] = useState([
    { id: 'Commercial Lines', value: 'Commercial Lines' },
    { id: 'Personal Lines', value: 'Personal Lines' },
    { id: 'Benefits', value: 'Benefits' },
  ])
  const [userFilter, setUserFilter] = useState([])
  const [userFilterOptions, setUserFilterOptions] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const currentUser = session?.user

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
      await timeout(100)
      if (!isCancelled) {
        setTableData(data)
        setRaw(data)
        if (useClientCard || usePolicyCard) {
          const userOptions = agency?.users
            ?.filter((y) => y.is_active)
            .map((x) => {
              return { id: x.id, value: x.name }
            })
          const users = agency?.users.map((x) => x.id)
          setUserFilterOptions(userOptions)
          setUserFilter(users)
        }
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
      if (!isCancelled && raw) {
        runFilter()
      }
    }
    handleChange()
    return () => {
      isCancelled = true
    }
  }, [lineFilter, userFilter])

  const runFilter = () => {
    function lineCheck(val) {
      if (!lineFilter) {
        return true
      }
      return lineFilter.includes(val)
    }
    const checkRep = (d = null) => {
      if (useClientCard || usePolicyCard) {
        let isInc
        if (currentUser) {
          d?.filter((x) => x.id != currentUser?.id).forEach((u) => {
            isInc = userFilter?.includes(u.id)
          })
          return isInc
        }
        d?.forEach((u) => {
          isInc = userFilter?.includes(u.id)
        })
        return isInc
      }
      return true
    }
    if (useClientCard || usePolicyCard) {
      const filtered = raw?.filter(
        (entry) => lineCheck(entry.line) && checkRep(entry.users)
      )
      let newData = filtered
      setTableData(newData)
    }
  }

  const exportData = data?.map((x) => {
    if (usePolicyCard) {
      let format = {
        client_name: x.client_name,
        policy_number: x.policy_number,
        line: x.line,
        policy_type: x.policy_type,
        poliy_type_full: x.policy_type_full,
        effective_date: x.effective_date,
        expiration_date: x.expiration_date,
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
      x.policy_types.forEach((u, i) => {
        format['LOB_' + `${i + 1}`] = u.tag + ' ' + u.name
      })
      return format
    }
    if (useClientCard) {
      let format = {
        client_name: x.client_name,
        line: x.line,
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
    }
    if (useContactCard) {
      let format = {
        first_name: x.first_name,
        last_name: x.last_name,
        email: x.email,
        assoc_name: x.assoc_name,
        client_contact: x.client,
        carrier_contact: x.carrier,
        mobile_phone: x.mobile_phone,
        business_phone: x.business_phone,
        home_phone: x.home_phone,
      }
      return format
    }
  })

  const getShadowColor = () => {
    switch (shadowColor) {
      case 'green':
        return 'green-shadow'
      case 'blue':
        return 'blue-shadow'
      case 'orange':
        return 'orange-shadow'
      case 'purple':
        return 'purple-shadow'
      case 'pink':
        return 'pink-shadow'
    }
  }

  const search = (val) => {
    if (val.length > 1) {
      const filtered = getSearch(raw, val)
      setTableData(filtered)
    } else {
      setTableData(raw)
    }
  }
  const mobile = isMobile()
  const laptop = isLaptop()
  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            opacity: 1,
            x: 0,
            transition: {
              delay: animationDelay * 0.25,
            },
          },
          hidden: { opacity: 0, x: -10 },
        }}
        transition={{ ease: 'easeInOut', duration: 2 }}
        className={`${gradient} ${useModal ? 'cursor-pointer' : ''} ${
          mobile ? 'flex-auto' : laptop ? 'w-[300px] flex-auto' : 'w-full'
        } content-dark relative flex h-[85px] min-w-[100px] flex-col  rounded-lg xl:min-w-[200px] ${
          useSmallHeight ? 'xl:h-[75px]' : 'xl:h-[100px]'
        } overflow-hidden ${shadow ? getShadowColor() : ``}`}
        onClick={() => (useModal ? setShowModal(!showModal) : null)}
      >
        {useBgIcons ? (
          <div className="absolute right-0 h-full w-full opacity-20">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: {
                    delay: animationDelay * 5,
                  },
                },
                hidden: { opacity: 0, x: -10 },
              }}
              transition={{ ease: 'easeInOut', duration: 2 }}
            >
              <div className="absolute left-0 bottom-0 rotate-12 text-6xl">{icon}</div>
            </motion.div>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: {
                    delay: animationDelay * 5,
                  },
                },
                hidden: { opacity: 0, x: -10 },
              }}
              transition={{ ease: 'easeInOut', duration: 2 }}
            >
              <div className="absolute left-[70%] bottom-[25%] hidden rotate-45 text-2xl xl:flex">{icon}</div>
            </motion.div>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: {
                    delay: animationDelay * 5,
                  },
                },
                hidden: { opacity: 0, x: -10 },
              }}
              transition={{ ease: 'easeInOut', duration: 2 }}
            >
              <div className="absolute right-[60%] rotate-12 text-xl">{icon}</div>
            </motion.div>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: {
                    delay: animationDelay * 5,
                  },
                },
                hidden: { opacity: 0, y: -20 },
              }}
              transition={{ ease: 'easeInOut', duration: 2 }}
              
            >
              <div className="absolute right-[-12%] rotate-12 text-6xl">{icon}</div>
            </motion.div>
          </div>
        ) : null}

        <div className="relative z-20 flex h-full flex-col">
          <div
            className={`relative flex h-full items-end justify-center rounded-b-lg py-1 text-2xl font-bold `}
          >
            <div className="z-20">{content}</div>
          </div>
          {useSparkline ? (
            <BackgroundFillSparkline
              toCurrentMonth={toCurrentMonth}
              slice={slice}
              passColors={colors}
              baseData={chartData}
            />
          ) : null}
        </div>
        <div className="text-md z-40 flex flex-col items-center justify-end space-x-1 pb-2 text-center text-xs font-semibold xl:flex-row xl:items-end xl:justify-center xl:space-x-2 ">
          <div className="flex items-center space-x-2">
            <div className="flex">{icon}</div>
            <div className="flex items-center justify-center text-center uppercase tracking-widest">
              {title}
            </div>
          </div>
        </div>
      </motion.div>
      <Modal
        closeButton
        noPadding
        scroll
        width={'800px'}
        className={'flex w-full items-center justify-center'}
        aria-labelledby="modal-title"
        open={showModal}
        onClose={() => setShowModal(false)}
      >
        <Modal.Header className="flex w-full flex-col px-4">
          <div className="text-xs font-bold tracking-widest opacity-60">
            {title}
          </div>
        </Modal.Header>
        <Modal.Body className="flex w-full flex-col px-4">
          <div className="relative w-full">
            <div className="flex w-full items-center py-4">
              <Input
                className={`z-10`}
                type="search"
                aria-label="Search Bar"
                size="sm"
                fullWidth
                underlined
                placeholder="Search"
                labelLeft={getIcon('search')}
                onChange={(e) => search(e.target.value)}
              />

              <div className="flex items-center gap-2 px-2">
                {useClientCard || usePolicyCard ? (
                  <Button
                    color="warning"
                    auto
                    flat
                    size="xs"
                    icon={getIcon('filter')}
                    onClick={() => setShowFilter(!showFilter)}
                  >
                    Filter
                  </Button>
                ) : null}
              </div>
            </div>
            {showFilter ? (
              <div className="flex flex-col py-2 ">
                <div>
                  <BrinqSelect
                    title={'Lines'}
                    fullWidth={false}
                    initialValue={lineFilter}
                    initialOptions={lineFilterOptions}
                    labelField={'value'}
                    clearable={true}
                    multiple={true}
                    callBack={setLineFilter}
                  />
                </div>
                <div>
                  <BrinqSelect
                    title={'Users'}
                    color={'indigo'}
                    fullWidth={false}
                    initialValue={userFilter}
                    initialOptions={userFilterOptions}
                    labelField={'value'}
                    clearable={true}
                    multiple={true}
                    callBack={setUserFilter}
                  />
                </div>
              </div>
            ) : null}
            {/* <div className="z-30 flex w-full search-border-flair pink-to-blue-gradient-1" /> */}
          </div>
          <div className="flex h-full w-full flex-col overflow-x-hidden">
            {data?.map((u, i) => (
              <motion.div
                key={u.id}
                className="relative"
                custom={i}
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    opacity: 1,
                    transition: {
                      delay: i * 0.05,
                    },
                    y: 0,
                  },
                  hidden: { opacity: 0, y: -10 },
                }}
                transition={{ ease: 'easeInOut', duration: 0.25 }}
              >
                {usePolicyCard ? <DashboardPolicyCard policy={u} /> : null}
                {useContactCard ? <ContactCard contact={u} /> : null}
                {useClientCard ? <ClientCard client={u} /> : null}
              </motion.div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer autoMargin={false} className="flex w-full space-x-2 p-4">
          <div>{data?.length} Total</div>
          <Button
            color="success"
            auto
            flat
            size="xs"
            icon={getIcon('spreadsheet')}
            onClick={() => downloadExcel(exportData, title)}
          >
            Export
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
