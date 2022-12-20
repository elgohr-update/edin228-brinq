import { Button, Input, Modal, useTheme } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import {
  downloadExcel,
  getIcon,
  getSearch,
  timeout,
} from '../../../utils/utils'
import { motion } from 'framer-motion'
import DashboardPolicyCard from '../policy/DashboardPolicyCard'
import ContactCard from '../../contact/ContactCard'
import { useAgencyContext } from '../../../context/state'
import { useSession } from 'next-auth/react'
import BrinqSelect from '../../ui/select/BrinqSelect'
import ClientCard from '../../client/ClientCard'

function AuditCard({
  init = null,
  title = null,
  color = null,
  usePolicyCard = false,
  useContactCard = false,
  useClientCard = false,
}) {
  const { type, isDark } = useTheme()
  const { data: session } = useSession()
  const [openModal, setOpenModal] = useState(false)
  const { agency, setAgency } = useAgencyContext()
  const [data, setData] = useState(null)
  const [raw, setRaw] = useState(null)
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
        setData(init)
        setRaw(init)
        if (useClientCard || usePolicyCard) {
          const userOptions = agency.users
            .filter((y) => y.is_active)
            .map((x) => {
              return { id: x.id, value: x.name }
            })
          const users = agency.users.map((x) => x.id)
          setUserFilterOptions(userOptions)
          setUserFilter(users)
        }
      }
    }
    handleChange()
    return () => {
      isCancelled = true
    }
  }, [init])

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
      setData(newData)
    }
  }

  const getColor = () => {
    const def = { bg: ``, text: ``, shadow: '' }
    switch (color) {
      case 'emerald':
        return {
          bg: `bg-emerald-500`,
          text: `text-emerald-400`,
          shadow: 'blue-shadow',
        }
      case 'sky':
        return { bg: `bg-sky-500`, text: `text-sky-400`, shadow: 'blue-shadow' }
      case 'purple':
        return {
          bg: `bg-purple-500`,
          text: `text-purple-400`,
          shadow: 'pink-shadow',
        }
      case 'pink':
        return {
          bg: `bg-pink-500`,
          text: `text-pink-400`,
          shadow: 'pink-shadow',
        }
      case 'teal':
        return {
          bg: `bg-teal-500`,
          text: `text-teal-400`,
          shadow: 'blue-shadow',
        }
      case 'amber':
        return {
          bg: `bg-amber-500`,
          text: `text-amber-400`,
          shadow: 'orange-shadow',
        }
      case 'fuchsia':
        return {
          bg: `bg-fuchsia-500`,
          text: `text-fuchsia-400`,
          shadow: 'pink-shadow',
        }
      case 'rose':
        return {
          bg: `bg-rose-500`,
          text: `text-rose-400`,
          shadow: 'pink-shadow',
        }
      case 'violet':
        return {
          bg: `bg-violet-500`,
          text: `text-violet-400`,
          shadow: 'purple-shadow',
        }
      case 'indigo':
        return {
          bg: `bg-indigo-500`,
          text: `text-indigo-400`,
          shadow: 'purple-shadow',
        }
      case 'cyan':
        return {
          bg: `bg-cyan-500`,
          text: `text-cyan-400`,
          shadow: 'blue-shadow',
        }
      case 'red':
        return { bg: `bg-red-500`, text: `text-red-400`, shadow: 'pink-shadow' }
      case 'rose':
        return {
          bg: `bg-rose-500`,
          text: `text-rose-500`,
          shadow: 'pink-shadow',
        }
      case 'yellow':
        return {
          bg: `bg-yellow-500`,
          text: `text-yellow-400`,
          shadow: 'orange-shadow',
        }
      case 'orange':
        return {
          bg: `bg-orange-500`,
          text: `text-orange-400`,
          shadow: 'orange-shadow',
        }
      case 'lime':
        return {
          bg: `bg-lime-500`,
          text: `text-lime-400`,
          shadow: 'green-shadow',
        }
      default:
        return def
    }
  }

  const search = (val) => {
    if (val.length > 1) {
      const filtered = getSearch(raw, val)
      setData(filtered)
    } else {
      setData(raw)
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

  return (
    <>
      <div
        className={`flex h-full w-full flex-auto cursor-pointer flex-col items-center rounded-lg py-6 transition duration-200 ease-out  ${
          isDark ? 'hover:bg-zinc-600/20' : 'hover:bg-zinc-400/20'
        }`}
        onClick={() => setOpenModal(true)}
      >
        <div className={`text-3xl font-bold ${getColor().text}`}>
          {data ? data?.length : 0}
        </div>
        <div
          className="flex items-center justify-center h-full px-2 tracking-widest text-center uppercase opacity-70"
          style={{ fontSize: '0.65rem' }}
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
        open={openModal}
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header className="flex flex-col w-full px-4">
          <div className="text-xs tracking-widest opacity-60">{title}</div>
        </Modal.Header>
        <Modal.Body className="flex flex-col w-full px-4">
          <div className="relative w-full">
            <div className="flex items-center w-full py-4">
              <Input
                className={`z-10`}
                type="search"
                aria-label="Activity Search Bar"
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

export default AuditCard
