import {
  Table,
  useTheme,
  Button,
  Input,
  Avatar,
  Tooltip,
  useCollator,
  Checkbox,
  Loading,
  User,
} from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { FaFilter, FaSearch } from 'react-icons/fa'
import {
  truncateString,
  formatMoney,
  getSearch,
  getFormattedDate,
  getMonths,
  basicSort,
} from '../../utils/utils'
import UserAvatar from '../user/Avatar'
import { useAgencyContext, useAppContext } from '../../context/state'
import LineIcon from '../util/LineIcon'
import TagBasic from '../ui/tag/TagBasic'
import ClientTableCell from './ClientTableCell'
import { DateTime } from 'luxon'
import CopyTextToClipboard from '../ui/CopyTextToClipboard'

const NewBusinessTable = ({ year = 2022, month = 1 }) => {
  const { type } = useTheme()
  const { state, setState } = useAppContext()
  const { agency, setAgency } = useAgencyContext()
  const [showFilter, setShowFilter] = useState(true)
  const [minPrem, setMinPrem] = useState(0)
  const [maxPrem, setMaxPrem] = useState(null)
  const [producers, setProducers] = useState(null)
  const [effective, setEffective] = useState([])
  const [visibleReps, setVisibleReps] = useState([])
  const [lineList, setLineList] = useState([
    'Commercial Lines',
    'Personal Lines',
  ])
  const [sortDescriptor, setSortDescriptor] = useState('ascending')

  const rows = state.reports.data.nb.raw
  const tableData = state.reports.data.nb.filtered
  const prods = agency?.users?.filter((u) => u.producer && u.is_active)

  const searchTable = (val) => {
    if (val.length > 1) {
      const filtered = getSearch(rows, val)
      setState({
        ...state,
        reports: {
          ...state.reports,
          data: {
            ...state.reports.data,
            nb: { ...state.reports.data.nb, filtered: filtered },
          },
        },
      })
    } else {
      const filtered = rows
      setState({
        ...state,
        reports: {
          ...state.reports,
          data: {
            ...state.reports.data,
            nb: { ...state.reports.data.nb, filtered: filtered },
          },
        },
      })
    }
  }

  const startingEffective = () => {
    const today = DateTime.local()
    if (today.year == year) {
      const m = month
      const months = Array.from(Array(m + 1).keys()).map((x) => x)
      return months
    }
    const months = Array.from(Array(12).keys()).map((x) => x)
    return months
  }

  useEffect(() => {
    const getProds = () => {
      const pIds = prods?.map((x) => x.id)
      setVisibleReps(pIds)
    }
    getProds()
  }, [producers])

  useEffect(() => {
    const prods = getProducers()
    setProducers(prods)
    setEffective(startingEffective())
  }, [])

  useEffect(() => {
    setEffective(startingEffective())
  }, [year, month])

  useEffect(() => {
    const mnPrem = minPrem && minPrem != 0 ? Number(minPrem) : 0
    const mxPrem = maxPrem && maxPrem != 0 ? Number(maxPrem) : 9999999

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
        lineCheck(entry.line) &&
        checkMonth(entry.effective_date) &&
        checkRep(entry.users)
    )
    let newData = filtered
    if (sortDescriptor) {
      newData = forceSort(newData)
    }
    setState({
      ...state,
      reports: {
        ...state.reports,
        data: {
          ...state.reports.data,
          nb: { ...state.reports.data.nb, filtered: newData },
        },
      },
    })
  }, [minPrem, maxPrem, rows, lineList, effective, visibleReps])

  const columns = [
    {
      key: 'line',
      label: 'LINE',
    },
    {
      key: 'policy_type',
      label: 'POLICY',
    },
    {
      key: 'policy_number',
      label: 'POLICY NUMBER',
    },
    {
      key: 'client_name',
      label: 'NAME',
    },
    {
      key: 'carrier',
      label: 'CARRIER',
    },
    {
      key: 'premium',
      label: 'PREMIUM',
    },
    {
      key: 'effective_date',
      label: 'EFF DATE',
    },
    {
      key: 'reps',
      label: 'REPS',
    },
  ]

  const getProducers = () => {
    return agency?.users?.filter((u) => u.producer && u.is_active)
  }

  const renderCell = (policy, columnKey) => {
    const cellValue = policy[columnKey]
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
          <CopyTextToClipboard val={cellValue}>
            <ClientTableCell
              cellValue={cellValue}
              clientId={policy.client.id}
              tags={policy.client.tags}
              type={type}
            />
          </CopyTextToClipboard>
        )
      case 'policy_number':
        return (
          <CopyTextToClipboard val={policy.policy_number}>
            <div className={`relative flex flex-col`}>
              <h6 className={`font-semibold`}>
                {truncateString(String(policy.policy_number), 16)}
              </h6>
              <h4 className={``}>{policy.policy_type_full}</h4>
            </div>
          </CopyTextToClipboard>
        )
      case 'carrier':
        return (
          <div className={`relative flex flex-auto flex-col`}>
            <h6 className={`font-semibold`}>
              {truncateString(policy.carrier, 20)}
            </h6>
            <h4 className={``}>{truncateString(policy.writing, 20)}</h4>
          </div>
        )
      case 'effective_date':
        return (
          <div className={`relative flex flex-auto flex-col items-end`}>
            <h4 className={`letter-spacing-1`}>
              {getFormattedDate(policy.effective_date)}
            </h4>
            <h6 className={`letter-spacing-1`}>
              {getFormattedDate(policy.expiration_date)}
            </h6>
          </div>
        )
      case 'policy_type':
        return (
          <div className={`relative mr-4 flex flex-col items-end space-y-1`}>
            <TagBasic text={policy.policy_type} />
            {policy.nonrenewed ? (
              <TagBasic text={`NRNWD`} color="red" />
            ) : policy.nottaken ? (
              <TagBasic text={`NTTKN`} color="red" />
            ) : policy.rewritten ? (
              <TagBasic text={`RWRTN`} color="purple" />
            ) : policy.canceled ? (
              <TagBasic text={`CNCLD`} color="red" />
            ) : policy.ams360quote ? (
              <TagBasic text={`QTE`} color="orange" />
            ) : policy.renewed ? (
              <TagBasic text={`RNWD`} color="blue" />
            ) : (
              <TagBasic text={`ACTV`} color="green" />
            )}
          </div>
        )
      case 'premium':
        return (
          <CopyTextToClipboard val={cellValue}>
            <div className="flex justify-center text-xs">
              <div className="flex w-[90px] justify-end text-teal-500">
                {`$ ${formatMoney(cellValue)}`}
              </div>
            </div>
          </CopyTextToClipboard>
        )
      case 'reps':
        return (
          <div className="w-[85px] pl-10">
            <Avatar.Group
              count={policy.users.length > 3 ? policy.users.length : null}
            >
              {policy.users.map((u) => (
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
        return ''
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
    setState({
      ...state,
      reports: {
        ...state.reports,
        data: {
          ...state.reports.data,
          nb: { ...state.reports.data.nb, filtered: sorted },
        },
      },
    })
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

  const isTagActive = (m) => {
    return effective.includes(m)
  }
  const isRepActive = (m) => {
    return visibleReps?.includes(m)
  }

  const checkMonth = (d) => {
    const base = DateTime.fromISO(d)
    const month = base.month - 1
    return effective.includes(month)
  }

  const checkRep = (users) => {
    let isInc
    users
      .filter((x) => x.producer == true)
      .forEach((u) => {
        isInc = visibleReps?.includes(u.id)
      })
    return isInc
  }

  const setMonthFilter = (m) => {
    if (effective.includes(m)) {
      const newBase = effective.filter((x) => x != m)
      setEffective(newBase)
    } else {
      const b = [...effective, m]
      const newBase = basicSort(b)
      setEffective(newBase)
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

  return (
    <div className="flex h-full w-full flex-col md:flex-row">
      {showFilter ? (
        <div
          className={`flex h-auto w-full flex-col space-y-4 rounded-lg py-4 px-4 md:w-[400px] panel-flat-${type} ${type}-shadow`}
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
          <div className="spacy-y-4 flex flex-col">
            <h4>Filter Lines</h4>
            <Checkbox
              color="primary"
              labelColor="primary"
              size="xs"
              defaultSelected={true}
              value="Commercial Lines"
              onChange={(e) => setLineFilter(e, 'Commercial Lines')}
            >
              Commercial Lines
            </Checkbox>
            <Checkbox
              color="error"
              labelColor="error"
              size="xs"
              defaultSelected={true}
              value="Personal Lines"
              onChange={(e) => setLineFilter(e, 'Personal Lines')}
            >
              Personal Lines
            </Checkbox>
            <Checkbox
              color="success"
              labelColor="success"
              size="xs"
              defaultSelected={false}
              value="Benefits"
              onChange={(e) => setLineFilter(e, 'Benefits')}
            >
              Benefits
            </Checkbox>
          </div>
          <div className="flex flex-col">
            <h4 className="mb-2">Effective</h4>
            <div className="flex flex-wrap lg:gap-2">
              {getMonths().map((x) => (
                <div
                  key={x.m}
                  onClick={() => setMonthFilter(x.m)}
                  className={`tag-basic mr-2 mb-2 min-w-[40px] cursor-pointer lg:mr-0 lg:mb-0 ${
                    isTagActive(x.m)
                      ? `deal-tag-blue`
                      : `tag-gray-bg tag-inactive`
                  }`}
                >
                  {x.month}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col">
            <h4 className="mb-2">Reps</h4>
            <div className="flex flex-col space-y-2">
              {prods?.map((x) => (
                <div
                  key={x.id}
                  onClick={() => setRepFilter(x.id)}
                  className={`cursor-pointer ${
                    isRepActive(x.id) ? `` : `tag-inactive`
                  }`}
                >
                  <User src={x.image_file} name={x.name} size="sm" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
      <div className="flex h-full w-full flex-col px-2 pb-2">
        <div className="flex h-16 w-full items-center justify-between py-4">
          <div className="flex w-full items-center px-2">
            <Input
              className={`z-10`}
              type="search"
              aria-label="Table Search Bar"
              size="sm"
              fullWidth
              underlined
              placeholder="Search"
              labelLeft={<FaSearch />}
              onChange={(e) => searchTable(e.target.value)}
            />
          </div>
          <div className="px-4">
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
        {!state.reports.data.nb.loading ? (
          <Table
            compact
            hoverable={false}
            sticked
            bordered={false}
            animated="true"
            shadow={false}
            lined={true}
            aria-label="Policies Table"
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
                column.key !== 'reps' ? (
                  <Table.Column key={column.key} allowsSorting>
                    <div className="table-column-header pl-2">
                      {column.label}
                    </div>
                  </Table.Column>
                ) : (
                  <Table.Column key={column.key}>
                    <div className="table-column-header pl-4">
                      {column.label}
                    </div>
                  </Table.Column>
                )
              }
            </Table.Header>
            <Table.Body
              items={tableData}
              loadingState={() => {
                return state.reports.data.nb.loading
              }}
            >
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
                rowsPerPage={14}
                total={Math.ceil(Number(tableData.length / 14))}
              />
            ) : null}
          </Table>
        ) : (
          <div className="flex h-full w-full items-center justify-center py-48">
            <Loading
              type="points"
              size="lg"
              color="secondary"
              textColor="primary"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default NewBusinessTable
