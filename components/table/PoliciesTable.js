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
} from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { AiOutlineFilter } from 'react-icons/ai'
import {
  truncateString,
  formatMoney,
  getSearch,
  getFormattedDate,
  sortByProperty,
} from '../../utils/utils'
import UserAvatar from '../user/Avatar'
import { useAppContext } from '../../context/state'
import LineIcon from '../util/LineIcon'
import TagBasic from '../ui/tag/TagBasic'
import ClientTableCell from './ClientTableCell'
import BrinqSelect from '../ui/select/BrinqSelect'
import ClientDrawer from '../ui/drawer/ClientDrawer'

const PoliciesTable = () => {
  const { type } = useTheme()
  const { state, setState } = useAppContext()
  const [showFilter, setShowFilter] = useState(true)
  const [minPrem, setMinPrem] = useState(null)
  const [maxPrem, setMaxPrem] = useState(null)
  const [visibleReps, setVisibleReps] = useState(null)
  const [visibleTags, setVisibleTags] = useState(null)
  const [lineList, setLineList] = useState([
    'Commercial Lines',
    'Personal Lines',
    'Benefits',
  ])
  const [sortDescriptor, setSortDescriptor] = useState('ascending')
  const [isOpen, setIsOpen] = useState(false)
  const [clientDrawer, setClientDrawer] = useState(null)
  const [pageSize, setPageSize] = useState(15)
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
  const rows = state.reports.data.policies.raw
  const tableData = state.reports.data.policies.filtered

  const searchTable = (val) => {
    if (val.length > 1) {
      const filtered = getSearch(rows, val)
      setState({
        ...state,
        reports: {
          ...state.reports,
          data: {
            ...state.reports.data,
            policies: { ...state.reports.data.policies, filtered: filtered },
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
            policies: { ...state.reports.data.policies, filtered: filtered },
          },
        },
      })
    }
  }

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
        lineCheck(entry.line)
      // && this.usersCheck(entry.users)
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
          policies: { ...state.reports.data.policies, filtered: newData },
        },
      },
    })
  }, [minPrem, maxPrem, rows, lineList])

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

  const renderCell = (policy, columnKey, drawerCallback) => {
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
          <ClientTableCell
            cellValue={cellValue}
            clientId={policy.client.id}
            tags={policy.client.tags}
            type={type}
            // drawerCallback={drawerCallback}
          />
        )
      case 'policy_number':
        return (
          <div className={`relative flex flex-col`}>
            <h6 className={`font-semibold`}>
              {truncateString(String(policy.policy_number), 16)}
            </h6>
            <h4 className={``}>{policy.policy_type_full}</h4>
          </div>
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
            <TagBasic
              tooltip
              tooltipContent={policy.policy_type_full}
              text={`${policy.policy_type}`}
            />
            <TagBasic text={`active`} color="green" />
          </div>
        )
      case 'premium':
        return (
          <div className="flex justify-center text-xs">
            <div className="flex w-[90px] justify-end text-teal-500">
              {`$ ${formatMoney(cellValue)}`}
            </div>
          </div>
        )
      case 'reps':
        const ordered = sortByProperty(policy.users, 'producer')
        return (
          <div className="w-[85px] pl-10">
            <Avatar.Group
              count={policy.users.length > 3 ? policy.users.length : null}
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
          policies: { ...state.reports.data.policies, filtered: sorted },
        },
      },
    })
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

  const pageSizeSet = (e) => {
    setPageSize(e)
  }

  const clientDrawerSet = (e) => {
    setIsOpen(true)
    setClientDrawer(e)
  }

  return (
    <div className="flex flex-col w-full h-full md:flex-row">
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
          <div className="flex flex-col spacy-y-4">
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
              defaultSelected={true}
              value="Benefits"
              onChange={(e) => setLineFilter(e, 'Benefits')}
            >
              Benefits
            </Checkbox>
          </div>
        </div>
      ) : null}
      <div className="flex flex-col w-full h-full px-2 pb-2">
        <div className="flex items-center justify-between w-full h-16 py-4">
          <div className="flex items-center w-full px-2">
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
          <div className="flex w-[140px] items-center justify-end px-4">
            <div>
              <BrinqSelect
                fullWidth={false}
                callBack={pageSizeSet}
                initialValue={pageSize}
                initialOptions={pageSizeOptions}
                labelField={'value'}
                clearable={false}
              />
            </div>
          </div>
          <div className="px-4">
            <Button
              color="warning"
              auto
              flat
              size="xs"
              icon={<AiOutlineFilter fill="currentColor" />}
              onClick={() => setShowFilter(!showFilter)}
            >
              Filter
            </Button>
          </div>
        </div>
        {!state.reports.data.policies.loading ? (
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
                    <div className="pl-2 table-column-header">
                      {column.label}
                    </div>
                  </Table.Column>
                ) : (
                  <Table.Column key={column.key}>
                    <div className="pl-4 table-column-header">
                      {column.label}
                    </div>
                  </Table.Column>
                )
              }
            </Table.Header>
            <Table.Body
              items={tableData}
              loadingState={() => {
                return state.reports.data.policies.loading
              }}
            >
              {(item) => (
                <Table.Row>
                  {(columnKey) => (
                    <Table.Cell>{renderCell(item, columnKey, clientDrawerSet)}</Table.Cell>
                  )}
                </Table.Row>
              )}
            </Table.Body>
            {tableData?.length > pageSize ? (
              <Table.Pagination
                shadow
                align="start"
                noMargin
                total={Math.ceil(Number(tableData?.length / pageSize))}
                rowsPerPage={pageSize}
              />
            ) : null}
          </Table>
        ) : (
          <div className="flex items-center justify-center w-full h-full py-48">
            <Loading
              type="points"
              size="lg"
              color="secondary"
              textColor="primary"
            />
          </div>
        )}
        {isOpen ? (
          <ClientDrawer
            clientId={clientDrawer}
            isRenewal={false}
            callBack={() => setIsOpen(!isOpen)}
          />
        ) : null}
      </div>
    </div>
  )
}

export default PoliciesTable
