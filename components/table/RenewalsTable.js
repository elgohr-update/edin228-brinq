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
  getCurrentMonth,
  getCurrentYear,
} from '../../utils/utils'
import UserAvatar from '../user/Avatar'
import {
  useAgencyContext,
  useAppContext,
  useClientDrawerContext,
} from '../../context/state'
import LineIcon from '../util/LineIcon'
import ClientTableCell from './ClientTableCell'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'

export default function RenewalsTable(data) {
  const router = useRouter()
  const { month, year } = router.query
  const { type } = useTheme()
  const { agency, setAgency } = useAgencyContext()
  const { data: session } = useSession()
  const [rows, setRows] = useState(
    data.data.map((x) => {
      return {
        ...x,
        client_name: truncateString(x.client_name, 40),
        id: x.client_id,
      }
    })
  )
  const [tableData, setTableData] = useState(
    data.data.map((x) => {
      return {
        ...x,
        client_name: truncateString(x.client_name, 40),
        id: x.client_id,
      }
    })
  )
  const { state, setState } = useAppContext()
  const { clientDrawer, setClientDrawer } = useClientDrawerContext()
  const [showRenewed, setShowRenewed] = useState(false)
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

  const runOnce = useRef(true)
  const runUsers = useRef(true)
  const produc = agency?.users?.filter((u) => u.is_active && u.producer)
  const ams = agency?.users?.filter((u) => u.is_active && u.account_manager)

  const currentUser = session?.user

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
    if (runOnce.current && data && bUsers) {
      const dat = data.data.map((x) => {
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
      const isCurrentMonth =
        month == getCurrentMonth() && year == getCurrentYear()
      if (isCurrentMonth) {
        setShowRenewed(true)
      } else {
        const filtered = !showRenewed
          ? dat.filter((x) => x.isRenewed == false)
          : dat
        setTableData(filtered)
      }

      runOnce.current = false
    }
    runOnce.current = true
  }, [data, bUsers])

  useEffect(() => {
    const filtered = !showRenewed
      ? rows.filter((x) => x.isRenewed == false)
      : rows
    setTableData(filtered)
  }, [showRenewed])

  useEffect(() => {
    runFilter()
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

  const columns = [
    {
      key: 'line',
      label: 'LINE',
    },
    {
      key: 'client_name',
      label: 'NAME',
    },
    {
      key: 'expiration_date',
      label: 'EXPIRING',
    },
    {
      key: 'isRenewedCount',
      label: 'Renewed',
    },
    {
      key: 'premium',
      label: 'PREMIUM',
    },
    {
      key: 'progressPercent',
      label: 'PROGRESS',
    },
    {
      key: 'reps',
      label: 'REPS',
    },
  ]

  const renderCell = (client, columnKey) => {
    const cellValue = client[columnKey]
    switch (columnKey) {
      case 'line':
        return (
          <div className="flex items-center justify-center">
            <Tooltip content={cellValue}>
              <LineIcon iconSize={18} size="sm" line={cellValue} />
            </Tooltip>
          </div>
        )
      case 'client_name':
        return (
          <ClientTableCell
            cellValue={cellValue}
            clientId={client.id}
            tags={client.tags}
            type={type}
            isRnwl={true}
            month={month}
            year={year}
          />
        )
      case 'policy_count':
        return (
          <div className="flex justify-center text-xs">
            <div className="flex w-[50px] justify-end font-bold text-sky-500">
              {cellValue}
            </div>
          </div>
        )
      case 'isRenewedCount':
        return (
          <div className="flex justify-center text-xs">
            <div className="flex w-[50px] justify-end font-bold">
              <span className={`mx-1 ${cellValue == 0 ? 'text-red-500' : ''}`}>
                {cellValue}
              </span>{' '}
              /<span className="mx-1">{client.policy_count}</span>
            </div>
          </div>
        )
      case 'premium':
        return (
          <div className="flex justify-center text-xs font-bold">
            <div className="flex w-[90px] justify-end text-teal-500">
              {`$ ${formatMoney(cellValue)}`}
            </div>
          </div>
        )
      case 'progressPercent':
        const percentage = Math.round(client.progressPercent)
        return (
          <div className="flex flex-col px-4">
            <div className="flex justify-end w-full text-xs tracking-widest">
              {Number(percentage) ? percentage : 0}%
            </div>
            <Progress
              shadow={true}
              size="sm"
              color="gradient"
              value={percentage}
            />
          </div>
        )
      case 'expiration_date':
        return (
          <div className="flex justify-center text-xs letter-spacing-1">
            {getFormattedDate(client.expiration_date)}
          </div>
        )
      case 'reps':
        const ordered = sortByProperty(client.users, 'producer')
        return (
          <div className="flex items-center justify-center">
            <Avatar.Group
              count={client.users.length > 3 ? client.users.length : null}
            >
              {ordered.map((u) => (
                <UserAvatar
                  tooltip={true}
                  tooltipPlacement="topEnd"
                  isUser={true}
                  passUser={u}
                  key={u.id}
                  isGrouped={true}
                  squared={false}
                  size={`sm`}
                />
              ))}
            </Avatar.Group>
          </div>
        )
      default:
        return cellValue
    }
  }

  const collator = useCollator({ numeric: true })

  async function sort(sortDescriptor) {
    setSortDescriptor(sortDescriptor)
    const sorted = tableData.sort((a, b) => {
      let first = a[sortDescriptor.column]
      let second = b[sortDescriptor.column]
      let cmp = collator.compare(first, second)
      if (sortDescriptor.direction === 'descending') {
        cmp *= -1
      }
      return cmp
    })
    // setState({
    //   ...state,
    //   reports: {
    //     ...state.reports,
    //     data: {
    //       ...state.reports.data,
    //       policies: { ...state.reports.data.policies, filtered: sorted },
    //     },
    //   },
    // })
  }

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

  return (
    <div className="flex flex-col w-full h-full md:flex-row">
      {showFilter ? (
        <motion.div
          className={`flex h-auto w-full flex-col space-y-4 rounded-lg py-4 px-4 md:w-[400px] panel-flat-${type} ${type}-shadow`}
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
            <h4 className="mb-2">Reps</h4>
            <div className="flex flex-col space-y-2">
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
      <div className="flex flex-col w-full h-full md:px-2">
        <div className="flex items-center justify-between w-full h-16 py-4">
          <div className="flex items-center justify-end px-4">
            <div className="px-2">
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
          </div>
          <div className="flex w-[140px] items-center justify-end px-4">
            <div className="flex flex-col items-end">
              <h4>Show Renewed</h4>
              <Switch
                checked={showRenewed}
                size="xs"
                onChange={(e) => setShowRenewed(e.target.checked)}
              />
            </div>
          </div>
        </div>
        {bUsers ? (
          <Table
            hoverable={true}
            compact
            sticked
            bordered={false}
            animated="true"
            shadow={false}
            lined={true}
            aria-label="Renewals Table"
            sortDescriptor={sortDescriptor}
            onSortChange={(s) => sort(s)}
            css={{
              height: '100%',
              minWidth: '100%',
              borderWidth: '0px',
            }}
          >
            <Table.Header columns={columns}>
              {(column) =>
                column.key === 'client_name' ? (
                  <Table.Column key={column.key} allowsSorting>
                    <div className="pl-5 text-xs table-column-header">
                      {column.label}
                    </div>
                  </Table.Column>
                ) : column.key === 'line' || column.key === 'reps' ? (
                  <Table.Column key={column.key} allowsSorting>
                    <div className="flex items-center justify-center px-1 text-xs table-column-header">
                      {column.label}
                    </div>
                  </Table.Column>
                ) : column.key === 'progress' ? (
                  <Table.Column key={column.key} allowsSorting>
                    <div className="px-1 text-xs table-column-header">
                      {column.label}
                    </div>
                  </Table.Column>
                ) : (
                  <Table.Column key={column.key} allowsSorting>
                    <div className="flex items-center justify-center px-1 text-xs table-column-header">
                      {column.label}
                    </div>
                  </Table.Column>
                )
              }
            </Table.Header>
            <Table.Body items={tableData}>
              {(item) => (
                <Table.Row>
                  {(columnKey) => (
                    <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>
                  )}
                </Table.Row>
              )}
            </Table.Body>
            {tableData.length > 14 ? (
              <Table.Pagination
                shadow
                align="start"
                noMargin
                total={Math.ceil(Number(tableData.length / 14))}
                rowsPerPage={14}
              />
            ) : null}
          </Table>
        ) : null}
      </div>
    </div>
  )
}
