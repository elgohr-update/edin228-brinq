import {
  Table,
  useTheme,
  Input,
  Avatar,
  Tooltip,
  Progress,
  useCollator,
  Button,
  Switch,
  Checkbox,
  User,
  Pagination,
} from '@nextui-org/react'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { FaFilter } from 'react-icons/fa'
import {
  truncateString,
  formatMoney,
  getSearch,
  getFormattedDate,
  getPercentage,
  getIcon,
  basicSort,
  sortByProperty,
  isCurrentMonthYear,
  isMobile,
} from '../../utils/utils'
import UserAvatar from '../user/Avatar'
import { useAgencyContext, useAppHeaderContext } from '../../context/state'
import LineIcon from '../util/LineIcon'
import ClientTableCell from './ClientTableCell'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import BrinqSelect from '../ui/select/BrinqSelect'
import ClientDrawer from '../ui/drawer/ClientDrawer'
import TagBasic from '../ui/tag/TagBasic'
import PolicyTableRow from '../policy/PolicyTableRow'
import ClientRenewalNote from '../client/ClientRenewalNote'
import RenewalTableRow from './RenewalTableRow'

export default function RenewalsTableNew(data) {
  const mobile = isMobile()
  const router = useRouter()
  const [pageSize, setPageSize] = useState(15)
  const [currentPage, setCurrentPage] = useState(1)

  const { month, year } = router.query
  const { type } = useTheme()
  const { agency, setAgency } = useAgencyContext()
  const { appHeader, setAppHeader } = useAppHeaderContext()
  const { data: session } = useSession()
  const currentUser = session?.user
  const [rows, setRows] = useState(
    data?.data?.map((x) => {
      return {
        ...x,
        client_name: truncateString(x.client_name, 40),
        id: x.client_id,
      }
    })
  )
  const [tableData, setTableData] = useState(
    data?.data?.map((x) => {
      return {
        ...x,
        client_name: truncateString(x.client_name, 40),
        id: x.client_id,
      }
    })
  )
  const [showRenewed, setShowRenewed] = useState(true)
  const [showFilter, setShowFilter] = useState(true)
  const [minPrem, setMinPrem] = useState(null)
  const [maxPrem, setMaxPrem] = useState(null)
  const [minPolicies, setMinPolicies] = useState(null)
  const [maxPolicies, setMaxPolicies] = useState(null)
  const [visibleReps, setVisibleReps] = useState(null)
  const [lineList, setLineList] = useState([
    'Commercial Lines',
    'Personal Lines',
    'Benefits',
  ])
  const [sortDescriptor, setSortDescriptor] = useState('ascending')
  const [bUsers, setBUsers] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [clientDrawer, setClientDrawer] = useState(null)
  const [expandAllRows, setExpandAllRows] = useState(false)

  const runOnce = useRef(true)
  const runUsers = useRef(true)
  const produc = agency?.users?.filter((u) => u.is_active && u.producer)
  const ams = agency?.users?.filter((u) => u.is_active && u.account_manager)

  const pageSizeOptions = [
    { id: 15, value: '15' },
    { id: 20, value: '20' },
    { id: 25, value: '25' },
    { id: 30, value: '30' },
    { id: 35, value: '35' },
    { id: 40, value: '40' },
    { id: 45, value: '45' },
    { id: 50, value: '50' },
  ]

  useEffect(() => {
    if (runUsers.current && agency.id) {
      const baseUsers = agency.users.filter((u) => u.is_active)
      const pIds = baseUsers.map((x) => x.uid)
      setVisibleReps(pIds)
      setBUsers(baseUsers)
      runUsers.current = false
    }
  }, [agency])

  useEffect(() => {
    if (mobile == true) {
      setShowFilter(false)
    } else {
      setShowFilter(true)
    }
  }, [mobile])

  useEffect(() => {
    const handleUpdate = () => {
      const dat = data?.data?.map((x) => {
        const isRenewed =
          x.policies.filter((y) => y.renewed).length == x.policies.length
        return {
          ...x,
          client_name: truncateString(x.client_name, 70),
          id: x.client_id,
          progressPercent: getPercentage(x.tasks_completed, x.tasks_total),
          isRenewed: isRenewed,
          isRenewedCount: x.policies.filter((y) => y.renewed).length,
        }
      })
      setRows(dat)
      const filtered = !showRenewed
        ? dat.filter((x) => x.isRenewed == false)
        : dat
      setTableData(filtered)
      runOnce.current = false
    }
    if (runOnce.current && data && bUsers) {
      handleUpdate()
      runOnce.current = true
    }
    return () => {}
  }, [data, bUsers])

  // useEffect(() => {
  //   const handleChange = () => {
  //     setShowRenewed(!isCurrentMonthYear(month, year))
  //   }
  //   handleChange()
  //   return () => {}
  // }, [])

  useEffect(() => {
    if (data && bUsers) {
      const filtered = !showRenewed
        ? rows.filter((x) => x.isRenewed == false)
        : rows
      setTableData(filtered)
    }
    return () => {}
  }, [showRenewed])

  useEffect(() => {
    if (data && bUsers) {
      runFilter()
    }
    return () => {}
  }, [minPrem, maxPrem, minPolicies, maxPolicies, lineList, visibleReps, rows])

  const searchTable = (val) => {
    if (val.length > 1) {
      const filtered = getSearch(rows, val)
      setTableData(filtered)
    } else {
      runFilter()
    }
  }

  const runFilter = () => {
    const mnPrem = minPrem && minPrem != 0 ? Number(minPrem) : 0
    const mxPrem = maxPrem && maxPrem != 0 ? Number(maxPrem) : 9999999
    const mnPol = minPolicies && minPolicies != 0 ? Number(minPolicies) : 0
    const mxPol =
      maxPolicies && maxPolicies != 0 ? Number(maxPolicies) : 9999999

    function lineCheck(val) {
      if (!lineList) {
        return true
      }
      return lineList.includes(val)
    }

    const filtered = rows.filter(
      (entry) =>
        entry.premium >= mnPrem &&
        entry.premium <= mxPrem &&
        entry.policies.length >= mnPol &&
        entry.policies.length <= mxPol &&
        lineCheck(entry.line) &&
        checkRep(entry.users)
    )
    let newData = filtered
    if (sortDescriptor) {
      newData = forceSort(newData)
    }
    const renewFilter = !showRenewed
      ? newData.filter((x) => x.isRenewed == false)
      : newData
    setTableData(renewFilter)
  }

  const collator = useCollator({ numeric: true })

  const forceSort = (data) => {
    const sorted = data.sort((a, b) => {
      let first = a[sortDescriptor.column]
      let second = b[sortDescriptor.column]
      let cmp = collator.compare(first, second)
      if (sortDescriptor.direction === 'descending') {
        cmp *= -1
      }
      return cmp
    })
    return sorted
  }

  function setLineFilter(checked, line) {
    if (checked) {
      const filtered = [...lineList, line]
      setLineList(filtered)
    } else {
      const filtered = lineList.filter((x) => x != line)
      setLineList(filtered)
    }
  }

  const setRepFilter = (m) => {
    if (visibleReps?.includes(m)) {
      const newBase = visibleReps?.filter((x) => x != m)
      setVisibleReps(newBase)
    } else {
      const b = [...visibleReps, m]
      const newBase = basicSort(b)
      setVisibleReps(newBase)
    }
  }

  const hideAllReps = () => {
    if (visibleReps.length > 0) {
      setVisibleReps([])
    } else {
      const baseUsers = agency.users.filter((u) => u.is_active)
      const pIds = baseUsers.map((x) => x.uid)
      setVisibleReps(pIds)
    }
  }

  const isRepActive = (m) => {
    return visibleReps?.includes(m)
  }

  const checkRep = (d) => {
    let isInc
    if (currentUser) {
      d.filter((x) => x.uid != currentUser?.uid).forEach((u) => {
        isInc = visibleReps?.includes(u.uid)
      })
      return isInc
    }
    d.forEach((u) => {
      isInc = visibleReps?.includes(u.uid)
    })
    return isInc
  }

  const pageSizeSet = (e) => {
    setPageSize(e)
  }

  const changePage = (e) => {
    setCurrentPage(e)
  }

  const clientDrawerSet = (e) => {
    setIsOpen(true)
    setAppHeader({ ...appHeader, lowZIndex: true })
    setClientDrawer(e)
  }

  return (
    <div className="flex flex-col w-full h-full xl:flex-row">
      {showFilter ? (
        <motion.div
          className={`flex h-auto w-full flex-col space-y-4 rounded-lg py-4 px-4 xl:w-[400px] panel-flat-${type} ${type}-shadow`}
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              opacity: 1,
              x: 0,
            },
            hidden: { opacity: 0, x: -10 },
          }}
          transition={{ ease: 'easeInOut', duration: 0.25 }}
        >
          <h4>Filter Premium</h4>
          <div className="flex items-center space-x-2">
            <Input
              className={`z-10`}
              aria-label="Min Premium"
              size="sm"
              fullWidth
              underlined
              placeholder="0"
              label="Min Premium"
              type="number"
              onChange={(e) => setMinPrem(e.target.value)}
            />
            <Input
              className={`z-10`}
              aria-label="Max Premium"
              size="sm"
              fullWidth
              underlined
              placeholder="0"
              label="Max Premium"
              type="number"
              onChange={(e) => setMaxPrem(e.target.value)}
            />
          </div>
          <h4>Filter Policies</h4>
          <div className="flex items-center space-x-2">
            <Input
              className={`z-10`}
              aria-label="Min Policies"
              size="sm"
              fullWidth
              underlined
              placeholder="0"
              label="Min Policies"
              type="number"
              onChange={(e) => setMinPolicies(e.target.value)}
            />
            <Input
              className={`z-10`}
              aria-label="Max Policies"
              size="sm"
              fullWidth
              underlined
              placeholder="0"
              label="Max Policies"
              type="number"
              onChange={(e) => setMaxPolicies(e.target.value)}
            />
          </div>
          <div className="flex flex-col spacy-y-4">
            <h4>Filter Lines</h4>
            <Checkbox
              defaultSelected
              color="primary"
              labelColor="primary"
              size="xs"
              value="Commercial Lines"
              onChange={(e) => setLineFilter(e, 'Commercial Lines')}
            >
              Commercial Lines
            </Checkbox>
            <Checkbox
              defaultSelected
              color="error"
              labelColor="error"
              size="xs"
              value="Personal Lines"
              onChange={(e) => setLineFilter(e, 'Personal Lines')}
            >
              Personal Lines
            </Checkbox>
            <Checkbox
              defaultSelected
              color="success"
              labelColor="success"
              size="xs"
              value="Benefits"
              onChange={(e) => setLineFilter(e, 'Benefits')}
            >
              Benefits
            </Checkbox>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center justify-between w-full mb-2">
              <h4>Reps</h4>
              <h6
                className="transition duration-100 cursor-pointer hover:text-sky-500"
                onClick={hideAllReps}
              >
                {visibleReps?.length > 0 ? 'Hide All' : 'Show All'}
              </h6>
            </div>
            <div className="flex flex-row flex-wrap 2xl:flex-col 2xl:flex-nowrap 2xl:space-y-2">
              {currentUser?.producer
                ? ams?.map((x) => (
                    <div
                      key={x.id}
                      onClick={() => setRepFilter(x.uid)}
                      className={`cursor-pointer ${
                        isRepActive(x.uid) ? `` : `tag-inactive`
                      }`}
                    >
                      <User src={x.image_file} name={x.name} size="sm" />
                    </div>
                  ))
                : produc?.map((x) => (
                    <div
                      key={x.id}
                      onClick={() => setRepFilter(x.uid)}
                      className={`cursor-pointer ${
                        isRepActive(x.uid) ? `` : `tag-inactive`
                      }`}
                    >
                      <User src={x.image_file} name={x.name} size="sm" />
                    </div>
                  ))}
            </div>
          </div>
        </motion.div>
      ) : null}
      <div className="flex flex-col w-full h-full xl:pl-2 xl:pr-8 2xl:px-2">
        <div className="flex flex-col items-center justify-between w-full py-4 space-y-2 xl:h-16 xl:flex-row xl:space-y-0">
          <div className="flex items-center justify-end">
            <div className="xl:mr-4">
              <Button
                color="warning"
                auto
                flat
                size="xs"
                icon={<FaFilter fill="currentColor" />}
                onClick={() => setShowFilter(!showFilter)}
              >
                Filter
              </Button>
            </div>
          </div>
          <div className="flex flex-col w-full gap-4 xl:flex-row xl:gap-0">
            <div className="flex items-center w-full">
              <Input
                className={`z-10`}
                type="search"
                aria-label="Table Search Bar"
                size="sm"
                fullWidth
                underlined
                placeholder="Search"
                labelLeft={getIcon('search')}
                onChange={(e) => searchTable(e.target.value)}
              />
              <div className="flex items-center justify-end gap-4 px-4">
                <div className="mt-[-10px] flex flex-col items-end">
                  <h4 className="w-[52px]">Expand All</h4>
                  <Switch
                    checked={expandAllRows}
                    size="xs"
                    onChange={(e) => setExpandAllRows(e.target.checked)}
                  />
                </div>
                <div className="mt-[-10px] flex flex-col items-end">
                  <h4>Renewed</h4>
                  <Switch
                    checked={showRenewed}
                    size="xs"
                    onChange={(e) => setShowRenewed(e.target.checked)}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center w-full xl:w-auto">
              <div className="px-4">
                <Pagination
                  onChange={(e) => changePage(e)}
                  page={currentPage}
                  noMargin
                  shadow
                  total={Math.ceil(Number(tableData?.length / pageSize))}
                  initialPage={1}
                />
              </div>
              {/* <div>
                <BrinqSelect
                  fullWidth={false}
                  callBack={pageSizeSet}
                  initialValue={pageSize}
                  initialOptions={pageSizeOptions}
                  labelField={'value'}
                  clearable={false}
                />
              </div> */}
            </div>
          </div>
        </div>
        {data && bUsers ? (
          <div className="flex flex-col w-full h-full overflow-x-auto">
            <div className="w-full p-2">
              <div
                className={`flex w-full min-w-[960px] text-sm panel-theme-${type} ${type}-shadow rounded-lg py-1`}
              >
                <div className="w-full pl-4">Client</div>
                <div className="flex min-w-[350px] pl-4">Renewal Notes</div>
              </div>
            </div>
            {tableData
              .slice(
                pageSize * (currentPage - 1),
                currentPage == 1 ? pageSize : pageSize * currentPage
              )
              .map((tableItem) => (
                <RenewalTableRow
                  currentUser={currentUser}
                  month={month}
                  year={year}
                  key={tableItem.id}
                  tableItem={tableItem}
                  expandAllRows={expandAllRows}
                />
              ))}
          </div>
        ) : null}
        {isOpen ? (
          <ClientDrawer
            clientId={clientDrawer}
            isRenewal={true}
            callBack={() => setIsOpen(!isOpen)}
          />
        ) : null}
      </div>
    </div>
  )
}
