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
import { FaFilter, FaSearch } from 'react-icons/fa'
import {
  truncateString,
  formatMoney,
  getSearch,
  getFormattedDate,
} from '../../utils/utils'
import UserAvatar from '../user/Avatar'
import { useAppContext } from '../../context/state'
import LineIcon from '../util/LineIcon'
import TagBasic from '../ui/tag/TagBasic'
import ClientTableCell from './ClientTableCell'

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
          return <ClientTableCell cellValue={cellValue} clientId={policy.client.id} tags={policy.client.tags} type={type}/>
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
            <TagBasic text={policy.policy_type} />
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
              size="sm"
              initialChecked={true}
              value="Commercial Lines"
              onChange={(e) => setLineFilter(e, 'Commercial Lines')}
            >
              Commercial Lines
            </Checkbox>
            <Checkbox
              color="error"
              labelColor="error"
              size="sm"
              initialChecked={true}
              value="Personal Lines"
              onChange={(e) => setLineFilter(e, 'Personal Lines')}
            >
              Personal Lines
            </Checkbox>
            <Checkbox
              color="success"
              labelColor="success"
              size="sm"
              initialChecked={true}
              value="Benefits"
              onChange={(e) => setLineFilter(e, 'Benefits')}
            >
              Benefits
            </Checkbox>
          </div>
        </div>
      ) : null}
      <div className="flex h-full w-full flex-col px-2 pb-2">
        <div className="flex h-16 w-full items-center justify-between py-4">
          <div className="flex items-center justify-end">
            <Button
              color="warning"
              auto
              light
              icon={<FaFilter fill="currentColor" />}
              onClick={() => setShowFilter(!showFilter)}
            />
          </div>
          <div className="flex w-full items-center pr-2">
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
                return state.reports.data.policies.loading
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
            {tableData.length > 10 ? (
              <Table.Pagination
                shadow
                align="start"
                noMargin
                rowsPerPage={10}
                total={Math.ceil(Number(tableData.length / 10))}
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

export default PoliciesTable
