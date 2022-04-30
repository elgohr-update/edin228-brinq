import {
  Table,
  useTheme,
  Input,
  Avatar,
  Tooltip,
  Progress,
  useCollator,
} from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { FaSearch } from 'react-icons/fa'
import {
  truncateString,
  formatMoney,
  getSearch,
  getFormattedDate,
} from '../../utils/utils'
import UserAvatar from '../user/Avatar'
import Link from 'next/link'
import { useAppContext, useClientDrawerContext } from '../../context/state'
import LineIcon from '../util/LineIcon'
import TagContainer from '../ui/tag/TagContainer'

export default function RenewalsTable(data) {
  const router = useRouter()
  const { month, year } = router.query
  const { type } = useTheme()
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
  const [sortDescriptor, setSortDescriptor] = useState('ascending')

  useEffect(() => {
    const dat = data.data.map((x) => {
      return {
        ...x,
        client_name: truncateString(x.client_name, 70),
        id: x.client_id,
      }
    })
    setRows(dat)
    setTableData(dat)
  }, [data])

  const searchTable = (val) => {
    if (val.length > 1) {
      const filtered = getSearch(rows, val)
      setTableData(filtered)
    } else {
      setTableData(rows)
    }
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
      key: 'policy_count',
      label: 'Policies',
    },
    {
      key: 'premium',
      label: 'PREMIUM',
    },
    {
      key: 'progress',
      label: 'PROGRESS',
    },
    {
      key: 'reps',
      label: 'REPS',
    },
  ]

  const openSidebar = (client) => {
    setClientDrawer({ ...clientDrawer, nav: 1, isOpen: true, clientId: client.id, renewalMonth: month, renewalYear: year })
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
        const checkTheme = () => {
          return type === 'dark'
            ? `h-full w-full hover:bg-gray-600/10 p-4 rounded  transition duration-100 ease-out`
            : `h-full w-full hover:bg-gray-500/10 p-4 rounded  transition duration-100 ease-out`
        }
        return (
          <div className="px-2 text-xs">
            <div
              className={checkTheme()}
              onClick={() => openSidebar(client, true)}
            >
              <Link href={`/clients/${client.id}`}>
                <a className="transition duration-100 ease-in-out hover:text-sky-500">
                  {cellValue}
                </a>
              </Link>
              <TagContainer tags={client?.tags} />
            </div>
          </div>
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
      case 'progress':
        const percentage = Math.round(
          (client.tasks_completed / client.tasks_total) * 100
        )
        return (
          <div className="flex flex-col px-4">
            <div className="flex w-full justify-end text-xs">
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
          <div className="letter-spacing-1 flex justify-center text-xs">
            {getFormattedDate(client.expiration_date)}
          </div>
        )
      case 'reps':
        return (
          <div className="flex items-center justify-center">
            <Avatar.Group
              count={client.users.length > 3 ? client.users.length : null}
            >
              {client.users.map((u) => (
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

  return (
    <div className="flex h-full w-full flex-col md:px-2">
      <div className="flex h-16 w-full items-center justify-between py-4">
        <div className="flex w-full items-center">
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
        {/* <div className="flex items-center justify-end">
                    <Button color="warning" auto flat icon={<FaFilter fill="currentColor" />} />
                </div> */}
      </div>
      <Table
        hoverable={true}
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
                <div className="table-column-header pl-5 text-xs">
                  {column.label}
                </div>
              </Table.Column>
            ) : column.key === 'line' || column.key === 'reps' ? (
              <Table.Column key={column.key} allowsSorting>
                <div className="table-column-header flex items-center justify-center px-1 text-xs">
                  {column.label}
                </div>
              </Table.Column>
            ) : column.key === 'progress' ? (
              <Table.Column key={column.key} allowsSorting>
                <div className="table-column-header px-1 text-xs">
                  {column.label}
                </div>
              </Table.Column>
            ) : (
              <Table.Column key={column.key} allowsSorting>
                <div className="table-column-header flex items-center justify-center px-1 text-xs">
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
        {tableData.length > 8 ? (
          <Table.Pagination
            shadow
            align="end"
            noMargin
            total={Math.ceil(Number(tableData.length / 8))}
            rowsPerPage={8}
          />
        ) : null}
      </Table>
    </div>
  )
}
