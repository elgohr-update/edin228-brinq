import { Button, Input, Modal, useTheme } from '@nextui-org/react'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { useAgencyContext } from '../../../context/state'
import {
  downloadExcel,
  getIcon,
  getSearch,
  timeout,
} from '../../../utils/utils'
import ClientCard from '../../client/ClientCard'
import ContactCard from '../../contact/ContactCard'
import BrinqSelect from '../../ui/select/BrinqSelect'
import DashboardPolicyCard from '../policy/DashboardPolicyCard'
import { motion } from 'framer-motion'

function DashboardGlanceSummaryCard({
  title = null,
  data = [],
  gradient = null,
  shadowColor = null,
  usePolicyCard = false,
  useContactCard = false,
  useClientCard = false,
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

  return (
    <>
      <div
        className={`content-dark relative flex flex-auto cursor-pointer flex-col items-end transition duration-200 hover:scale-105 panel-theme-${type} h-[120px] w-full 2xl:w-[208px] overflow-hidden rounded-lg p-4 ${gradient} ${getShadowColor()}`}
        onClick={() => setShowModal(!showModal)}
      >
        <div className="z-30 flex items-end justify-end w-full h-full text-5xl font-bold">
          <div className="flex font-bold">{data.length}</div>
        </div>

        <div
          className={`z-30 flex h-[50px] items-end justify-end text-right font-bold xl:text-xl`}
        >
          {title}
        </div>
      </div>
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
        <Modal.Header className="flex flex-col w-full px-4">
          <div className="text-xs font-bold tracking-widest opacity-60">
            {title}
          </div>
        </Modal.Header>
        <Modal.Body className="flex flex-col w-full px-4">
          <div className="relative w-full">
            <div className="flex items-center w-full py-4">
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
          <div className="flex flex-col w-full h-full overflow-x-hidden">
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
        <Modal.Footer autoMargin={false} className="flex w-full p-4 space-x-2">
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

export default DashboardGlanceSummaryCard
