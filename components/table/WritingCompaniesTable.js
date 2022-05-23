import {
  Table,
  useTheme,
  Button,
  Input,
  Avatar,
  Tooltip,
  useCollator,
  Popover,
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
  getConstantIcons,
} from '../../utils/utils'
import UserAvatar from '../user/Avatar'
import {
  useAppContext,
  useParentCompanyDrawerContext,
  useWritingCompanyDrawerContext,
} from '../../context/state'
import LineIcon from '../util/LineIcon'
import TagBasic from '../ui/tag/TagBasic'
import ClientTableCell from './ClientTableCell'

const WritingCompaniesTable = () => {
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
  const [sortDescriptor, setSortDescriptor] = useState('ascending')
  const { writingCompanyDrawer, setWritingCompanyDrawer } =
    useWritingCompanyDrawerContext()

  const { parentCompanyDrawer, setParentCompanyDrawer } =
    useParentCompanyDrawerContext()

  const rows = state.reports.data.carriers.raw
  const tableData = state.reports.data.carriers.filtered

  const openSidebar = (cid) => {
    setWritingCompanyDrawer({
      isOpen: true,
      companyId: cid,
    })
  }

  const openParentSidebar = (cid) => {
    setParentCompanyDrawer({
      isOpen: true,
      companyId: cid,
    })
  }

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
      key: 'b',
      label: 'With Brokerage',
    },
    {
      key: 'parent_id',
      label: 'Parent',
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
      case 'b':
        const isWithBrokerage = () => {
          const parents = policy?.parent_companies.filter(
            (x) => x.parent.brokerage == true
          )
          return parents.length > 0 ? true : false
        }
        return isWithBrokerage() ? (
          <div className="flex justify-center text-xs text-sky-500">
            {getConstantIcons('circleCheck')}
          </div>
        ) : (
          <div className="flex justify-center text-xs text-red-500">
            {getConstantIcons('circleX')}
          </div>
        )
      case 'parent_id':
        const parentCheck = () => {
          const parent = policy?.parent_companies[0]?.parent
          const otherParents = policy?.parent_companies.filter(
            (x) => x.parent_id != parent.id
          )
          return { parent: parent, extra: otherParents }
        }
        const parentData = parentCheck()
        return (
          <div className="flex items-center space-x-1">
            <div
              onClick={() => openParentSidebar(parentData?.parent?.id)}
              className="cursor-pointer text-xs transition duration-100 ease-out hover:text-sky-500"
            >
              {parentData?.parent?.name}
            </div>
            {parentData?.extra.length > 0 ? (
              <Popover placement={`top`}>
                <Popover.Trigger>
                  <h4 className="cursor-pointer">
                    +{parentData?.extra?.length} More
                  </h4>
                </Popover.Trigger>
                <Popover.Content>
                  <div className="flex flex-col p-4">
                    {parentData?.extra?.map((x) => (
                      <h6
                        key={x.parent.id}
                        onClick={() => openParentSidebar(x.parent.id)}
                        className="cursor-pointer text-xs transition duration-100 ease-out hover:text-sky-500"
                      >
                        {x.parent.name}
                      </h6>
                    ))}
                  </div>
                </Popover.Content>
              </Popover>
            ) : null}
          </div>
        )
      case 'name':
        return (
          <div
            onClick={() => openSidebar(policy?.id)}
            className="cursor-pointer text-xs transition duration-100 ease-out hover:text-sky-500"
          >
            {cellValue}
          </div>
        )
      case 'policy_count':
        return (
          <div className="flex justify-center text-xs">
            <div className="flex w-[90px] justify-end">{cellValue}</div>
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
      case 'premium_cl':
        return (
          <div className="flex justify-center text-xs">
            <div className="flex w-[90px] justify-end text-sky-500">
              {`$ ${formatMoney(cellValue)}`}
            </div>
          </div>
        )
      case 'premium_pl':
        return (
          <div className="flex justify-center text-xs">
            <div className="flex w-[90px] justify-end text-red-500">
              {`$ ${formatMoney(cellValue)}`}
            </div>
          </div>
        )
      case 'premium_b':
        return (
          <div className="flex justify-center text-xs">
            <div className="flex w-[90px] justify-end text-green-500">
              {`$ ${formatMoney(cellValue)}`}
            </div>
          </div>
        )
      default:
        return <div className="text-xs">{cellValue}</div>
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
    <div className="flex h-full w-full flex-col md:flex-row">
      {showFilter ? (
        <div
          className={`flex flex-col space-y-4 rounded-lg py-4 px-4 md:w-[400px] panel-flat-${type} ${type}-shadow`}
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
          <div className="spacy-y-4 flex flex-col">
            <h4>Filter Lines</h4>
            <Checkbox
              color="primary"
              labelColor="primary"
              size="xs"
              initialChecked={true}
              value="Commercial Lines"
              onChange={(e) => setLineFilter(e, 'Commercial Lines')}
            >
              Commercial Lines
            </Checkbox>
            <Checkbox
              color="error"
              labelColor="error"
              size="xs"
              initialChecked={true}
              value="Personal Lines"
              onChange={(e) => setLineFilter(e, 'Personal Lines')}
            >
              Personal Lines
            </Checkbox>
            <Checkbox
              color="success"
              labelColor="success"
              size="xs"
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

export default WritingCompaniesTable
