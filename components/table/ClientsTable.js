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
import { AiOutlineFilter} from 'react-icons/ai'
import { formatMoney, getSearch, sortByProperty } from '../../utils/utils'
import UserAvatar from '../user/Avatar'
import { useAppContext } from '../../context/state'
import LineIcon from '../util/LineIcon'
import ClientTableCell from './ClientTableCell'

const ClientsTable = () => {
  const { type } = useTheme()
  const [search, setSearch] = useState('')
  const { state, setState } = useAppContext()
  const [showFilter, setShowFilter] = useState(true)
  const [minPrem, setMinPrem] = useState(null)
  const [maxPrem, setMaxPrem] = useState(null)
  const [minPolicies, setMinPolicies] = useState(null)
  const [maxPolicies, setMaxPolicies] = useState(null)
  const [visibleReps, setVisibleReps] = useState(null)
  const [visibleTags, setVisibleTags] = useState(null)
  const [lineList, setLineList] = useState([
    'Commercial Lines',
    'Personal Lines',
    'Benefits',
  ])
  const [sortDescriptor, setSortDescriptor] = useState('ascending')

  const rows = state.reports.data.clients.raw
  const tableData = state.reports.data.clients.filtered

  const searchTable = (val) => {
    if (val.length > 1) {
      const filtered = getSearch(rows, val)
      setState({
        ...state,
        reports: {
          ...state.reports,
          data: {
            ...state.reports.data,
            clients: { ...state.reports.data.clients, filtered: filtered },
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
            clients: { ...state.reports.data.clients, filtered: filtered },
          },
        },
      })
    }
  }

  useEffect(() => {
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
        entry.policy_count >= mnPol &&
        entry.policy_count <= mxPol &&
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
          clients: { ...state.reports.data.clients, filtered: newData },
        },
      },
    })
  }, [minPrem, maxPrem, minPolicies, maxPolicies, rows, lineList])

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
      key: 'policy_count',
      label: 'POLICIES',
    },
    {
      key: 'premium',
      label: 'PREMIUM',
    },
    {
      key: 'naics_code',
      label: 'naic',
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
          />
        )
      case 'policy_count':
        return (
          <div className="flex justify-center text-xs">
            <div className="flex w-[50px] justify-end">{cellValue}</div>
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
        const ordered = sortByProperty(client.users, 'producer')
        return (
          <div className="w-[85px] pl-10">
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
        return (
          <div className="flex justify-center text-xs">
            <div className="flex w-[50px] justify-end">{cellValue}</div>
          </div>
        )
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
          clients: { ...state.reports.data.clients, filtered: sorted },
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

  return (
    <div className="flex flex-col w-full h-full xl:flex-row">
      {showFilter ? (
        <div
          className={`flex h-auto w-full flex-col space-y-4 rounded-lg py-4 px-4 xl:w-[400px] panel-flat-${type} ${type}-shadow`}
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
        </div>
      ) : null}
      <div className="flex flex-col w-full h-full px-2 pb-2">
        <div className="flex items-center flex-auto h-16 py-4">
          <div className="flex items-center flex-auto w-full px-2">
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
              icon={<AiOutlineFilter fill="currentColor" />}
              onClick={() => setShowFilter(!showFilter)}
            >
              {' '}
              Filter
            </Button>
          </div>
        </div>
        {!state.reports.data.clients.loading ? (
          <Table
            compact
            hoverable={false}
            sticked
            bordered={false}
            animated="true"
            shadow={false}
            lined={true}
            aria-label="Clients Table"
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
                ) : (
                  <Table.Column key={column.key} allowsSorting>
                    <div className="flex items-center justify-center px-1 text-xs table-column-header">
                      {column.label}
                    </div>
                  </Table.Column>
                )
              }
            </Table.Header>
            <Table.Body
              items={tableData}
              loadingState={() => {
                return
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
            {tableData.length > 13 ? (
              <Table.Pagination
                shadow
                align="start"
                noMargin
                rowsPerPage={13}
                total={Math.ceil(Number(tableData.length / 13))}
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
      </div>
    </div>
  )
}

export default ClientsTable
