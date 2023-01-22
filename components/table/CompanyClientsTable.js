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
import { formatMoney, getSearch, sortByProperty } from '../../utils/utils'
import UserAvatar from '../user/Avatar'
import { useAppContext } from '../../context/state'
import LineIcon from '../util/LineIcon'
import ClientTableCell from './ClientTableCell'

const CompanyClientsTable = ({data=null, companyId=null, parent=false, writing=false}) => {
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
  const [rows, setRows] = useState(null)
  const [tableData, setTableData] = useState(null)

  const searchTable = (val) => {
    console.log('search')
  }

  useEffect(() => {
    const base = data
    setRows(base)
    setTableData(base)
  }, [data])

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
      key: 'policies',
      label: 'POLICIES',
    },
    {
      key: 'premium_with',
      label: 'PREMIUM',
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

  const renderCell = (client, columnKey, companyId, parent, writing ) => {
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
            style={2}
            companyId={companyId}
            parent={parent}
            writing={writing}
          />
        )
      case 'policies':
        return (
          <div className="flex justify-center text-xs">
            <div className="flex w-[50px] justify-end">{cellValue.length}</div>
          </div>
        )
      case 'premium_with':
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
  }

  return (
    <div className="flex flex-col w-full h-full md:flex-row">
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
        </div>
        {tableData ? (
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
                    <Table.Cell>{renderCell(item, columnKey, companyId, parent, writing )}</Table.Cell>
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

export default CompanyClientsTable
