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
  getIcon,
} from '../../utils/utils'
import UserAvatar from '../user/Avatar'
import {
  useAppContext,
  useParentCompanyDrawerContext,
} from '../../context/state'
import LineIcon from '../util/LineIcon'
import TagBasic from '../ui/tag/TagBasic'
import ClientTableCell from './ClientTableCell'
import CopyTextToClipboard from '../ui/CopyTextToClipboard'

const ParentCompaniesTable = () => {
  const { type } = useTheme()
  const { state, setState } = useAppContext()
  const [showFilter, setShowFilter] = useState(true)
  const [minPrem, setMinPrem] = useState(null)
  const [maxPrem, setMaxPrem] = useState(null)
  const [minPolicies, setMinPolicies] = useState(null)
  const [maxPolicies, setMaxPolicies] = useState(null)
  const [lineList, setLineList] = useState([
    'Commercial Lines',
    'Personal Lines',
    'Benefits',
  ])
  const [sortDescriptor, setSortDescriptor] = useState(null)
  const { parentCompanyDrawer, setParentCompanyDrawer } =
    useParentCompanyDrawerContext()

  const openParentSidebar = (cid) => {
    setParentCompanyDrawer({
      isOpen: true,
      companyId: cid,
    })
  }
  const rows = state.reports.data.carriers.raw
  const tableData = state.reports.data.carriers.filtered

  const searchTable = (val) => {
    if (val.length > 1) {
      const filtered = getSearch(rows, val)
      setState({
        ...state,
        reports: {
          ...state.reports,
          data: {
            ...state.reports.data,
            carriers: { ...state.reports.data.carriers, filtered: filtered },
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
            carriers: { ...state.reports.data.carriers, filtered: filtered },
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

    function lineCheck(entry) {
      if (!lineList) {
        return true
      }
      const isAll =
        lineList.includes('Commercial Lines') &&
        lineList.includes('Personal Lines') &&
        lineList.includes('Benefits')
      const isCl = entry.premium_cl > 0 && lineList.includes('Commercial Lines')
      const isPl = entry.premium_pl > 0 && lineList.includes('Personal Lines')
      const isB = entry.premium_b > 0 && lineList.includes('Benefits')
      const filtered =
        !isAll && lineList.includes('Commercial Lines')
          ? isCl
          : !isAll && lineList.includes('Personal Lines')
          ? isPl
          : !isAll && lineList.includes('Benefits')
          ? isB
          : isAll
          ? true
          : false
      return filtered
    }

    const filtered = rows.filter(
      (entry) =>
        entry.premium >= mnPrem &&
        entry.premium <= mxPrem &&
        entry.policy_count >= mnPol &&
        entry.policy_count <= mxPol &&
        lineCheck(entry)
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
          carriers: { ...state.reports.data.carriers, filtered: newData },
        },
      },
    })
  }, [minPrem, maxPrem, minPolicies, maxPolicies, rows, lineList])

  const columns = [
    {
      key: 'brokerage',
      label: 'BROKERAGE',
    },
    {
      key: 'name',
      label: 'NAME',
    },
    {
      key: 'premium',
      label: 'TOTAL PREMIUM',
    },
    {
      key: 'premium_cl',
      label: 'CL PREMIUM',
    },
    {
      key: 'premium_pl',
      label: 'PL PREMIUM',
    },
    {
      key: 'premium_b',
      label: 'B PREMIUM',
    },
    {
      key: 'policy_count',
      label: 'POLICIES',
    },
    {
      key: 'naic_code',
      label: 'NAIC',
    },
  ]

  const renderCell = (policy, columnKey) => {
    const cellValue = policy[columnKey]
    switch (columnKey) {
      case 'name':
        return (
          <div
            onClick={() => openParentSidebar(policy?.id)}
            className="text-xs transition duration-100 ease-out cursor-pointer hover:text-sky-500"
          >
            {cellValue}
          </div>
        )
      case 'brokerage':
        return cellValue ? (
          <div className="flex justify-center text-xs text-sky-500">
            {getIcon('circleCheck')}
          </div>
        ) : (
          <div className="flex justify-center text-xs text-red-500">
            {getIcon('circleX')}
          </div>
        )
      case 'policy_count':
        return (
          <CopyTextToClipboard val={cellValue}>
            <div className="flex justify-center text-xs">
              <div className="flex w-[90px] justify-end">{cellValue}</div>
            </div>
          </CopyTextToClipboard>
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
      case 'premium_cl':
        return (
          <CopyTextToClipboard val={cellValue}>
            <div className="flex justify-center text-xs">
              <div className="flex w-[90px] justify-end text-sky-500">
                {`$ ${formatMoney(cellValue)}`}
              </div>
            </div>
          </CopyTextToClipboard>
        )
      case 'premium_pl':
        return (
          <CopyTextToClipboard val={cellValue}>
            <div className="flex justify-center text-xs">
              <div className="flex w-[90px] justify-end text-red-500">
                {`$ ${formatMoney(cellValue)}`}
              </div>
            </div>
          </CopyTextToClipboard>
        )
      case 'premium_b':
        return (
          <CopyTextToClipboard val={cellValue}>
            <div className="flex justify-center text-xs">
              <div className="flex w-[90px] justify-end text-green-500">
                {`$ ${formatMoney(cellValue)}`}
              </div>
            </div>
          </CopyTextToClipboard>
        )
      default:
        return (
          <CopyTextToClipboard val={cellValue}>
            <div className="text-xs">{cellValue}</div>
          </CopyTextToClipboard>
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
          carriers: { ...state.reports.data.carriers, filtered: sorted },
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

  return (
    <div className="flex flex-col w-full h-full xl:flex-row">
      {showFilter ? (
        <div
          className={`flex flex-col space-y-4 rounded-lg py-4 px-4 xl:w-[400px] panel-flat-${type} ${type}-shadow`}
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
              color="primary"
              labelColor="primary"
              size="sm"
              defaultSelected={true}
              value="Commercial Lines"
              onChange={(e) => setLineFilter(e, 'Commercial Lines')}
            >
              Commercial Lines
            </Checkbox>
            <Checkbox
              color="error"
              labelColor="error"
              size="sm"
              defaultSelected={true}
              value="Personal Lines"
              onChange={(e) => setLineFilter(e, 'Personal Lines')}
            >
              Personal Lines
            </Checkbox>
            <Checkbox
              color="success"
              labelColor="success"
              size="sm"
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
        {!state.reports.data.carriers.loading ? (
          <Table
            compact
            hoverable={false}
            sticked
            bordered={false}
            animated="true"
            shadow={false}
            lined={true}
            aria-label="Table"
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
                return state.reports.data.carriers.loading
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
            {tableData.length > 30 ? (
              <Table.Pagination
                shadow
                align="start"
                noMargin
                rowsPerPage={30}
                total={Math.ceil(Number(tableData.length / 30))}
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

export default ParentCompaniesTable
