import { Table, useTheme, Button, Input, Avatar, Tooltip, Progress, useCollator } from '@nextui-org/react';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { FaFilter, FaSearch } from 'react-icons/fa';
import { truncateString, formatMoney, getSearch, getFormattedDate } from '../../utils/utils';
import UserAvatar from '../user/Avatar';
import Link from 'next/link';
import { useAppContext } from '../../context/state';
import LineIcon from '../util/LineIcon';
import TagBasic from '../ui/tag/TagBasic';

const RenewalsTable = (data) => {
    const router = useRouter()
    const { type } = useTheme();
    const [search, setSearch] = useState('')
    const [rows, setRows] = useState(data.data.map( x => {return {...x,client_name:truncateString(x.client_name,40), id:x.client_id}}))
    const [tableData, setTableData] = useState(data.data.map( x => {return {...x,client_name:truncateString(x.client_name,40), id:x.client_id}}))
    const {state, setState} = useAppContext();

    

    useEffect(() => {
        const dat = data.data.map( x => {return {...x,client_name:truncateString(x.client_name,40), id:x.client_id}})
        setRows(dat)
        setTableData(dat)   
    }, [data])

    useEffect(() => {
        if (search.length > 3){
            const filtered = getSearch(rows,search)
            setTableData(filtered)
        }else {
            setTableData(rows)
        }
    }, [search])

    const columns = [
      {
        key: "line",
        label: "LINE",
      },
      {
        key: "client_name",
        label: "NAME",
      },
      {
        key: "expiring",
        label: "EXPIRING",
      },
      {
        key: "policy_count",
        label: "RENEWING POL",
      },
      {
        key: "premium",
        label: "PREMIUM",
      },
      {
        key: "progress",
        label: "PROGRESS",
      },
      {
        key: "reps",
        label: "REPS",
      }
    ];

    const openSidebar = (client) => {
        setState({...state,drawer:{...state.drawer, client:{isOpen:true,clientId:client.id}}})
    }

    const renderCell = (client, columnKey) => {
        const cellValue = client[columnKey];
        switch (columnKey) {
            case "line":
                return (
                    <Tooltip content={cellValue}>
                        <LineIcon iconSize={18} size="sm" line={cellValue} />
                    </Tooltip>
                )
            case "client_name":
                const checkTheme = () => {
                    return type === 'dark' ?
                        `h-full w-full hover:bg-gray-600/10 p-4 rounded  transition duration-100 ease-out`
                    :
                        `h-full w-full hover:bg-gray-500/10 p-4 rounded  transition duration-100 ease-out`
                }
                return (
                    <div className="px-2">
                        <div className={checkTheme()} onClick={() => openSidebar(client)}>
                            <Link href={`/client/${client.id}`}>
                                <a className="hover:text-sky-500 transition duration-100 ease-in-out">
                                    {cellValue}
                                </a>
                            </Link>
                            {
                                client.tags ?
                                    <div className="flex items-center flex-wrap pt-2">
                                        {
                                            client.tags.map( x => {
                                                return <TagBasic key={x.id} text={x.name} color={x.color} />
                                            })
                                        }
                                    </div>
                                :null
                            }
                        </div>
                    </div>
                )
            case "policy_count":
                return (
                    <div className="flex w-[30px]">
                        <div className="flex justify-end w-[90px]">
                            {cellValue}
                        </div>
                    </div>
                )
            case "premium":
                return (
                    <div className="flex">
                        <div className="flex justify-end w-[90px] text-teal-500">
                            {`$ ${formatMoney(cellValue)}`}
                        </div>
                    </div>
                )
            case "progress":
                const percentage = Math.round(( client.tasks_completed / client.tasks_total ) * 100)
                return (
                    <div className="flex flex-col px-4">
                        <div className="flex w-full justify-end text-xs">
                            {Number(percentage) ? percentage : 0}%
                        </div>
                        <Progress shadow={true} size="sm" color="gradient" value={percentage} />
                    </div>
                )
            case "expiring":
                return (
                    <div className="letter-spacing-1">
                        {getFormattedDate(client.expiration_date)}
                    </div>
                )
            case "reps":
                return(
                    <div className="pl-10 w-[85px]">
                        <Avatar.Group count={client.users.length > 3? client.users.length : null}>
                            {client.users.map( u => (
                                <UserAvatar
                                    tooltip={true}
                                    tooltipPlacement="topEnd"
                                    isUser={true}
                                    passUser={u}
                                    key={u.id}
                                    isGrouped={true}
                                    squared={false}
                                />
                            ))}
                        </Avatar.Group>     
                    </div>
                )
            default:
                return cellValue;
        }
    };
    const collator = useCollator({ numeric: true });
    function load({ signal }) {
        // const res = await fetch("https://swapi.py4e.com/api/people/?search", {
        //     signal,
        // });
        // const json = await res.json();
        // return {
        //     items: json.results,
        // };
        return {items:tableData}
    }
    async function sort() {
        const data = tableData.sort((a, b) => {
            let first = a[sortDescriptor.column];
            let second = b[sortDescriptor.column];
            let cmp = collator.compare(first, second);
            if (sortDescriptor.direction === "descending") {
                cmp *= -1;
            }
            return cmp;
        })
        setTableRows(data)
    }
    return (
        <div className="flex flex-col h-full w-full md:px-2">
            <div className="w-full items-center flex justify-between h-16 py-4">
                <div className="flex items-center w-full">
                    <Input 
                        className={`z-10`}
                        type="search"
                        aria-label="Table Search Bar"
                        size="sm" 
                        fullWidth
                        underlined
                        placeholder="Search" 
                        labelLeft={<FaSearch />}
                        onChange={ e => setSearch(e.target.value)}
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
                css={{
                    height: "100%",
                    minWidth: "100%",
                    borderWidth: "0px",
                }}
            >
                <Table.Header columns={columns}>
                    {(column) => (
                        column.key === 'client_name' || column.key === 'premium' || column.key === 'progress' || column.key === 'reps' ?
                            <Table.Column key={column.key}>
                                <div className="table-column-header pl-4">
                                    {column.label}
                                </div>
                            </Table.Column>
                        :
                            <Table.Column key={column.key}>
                                <div className="table-column-header">
                                    {column.label}
                                </div>
                            </Table.Column>
                    )}
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
                {tableData.length > 7 ? 
                    <Table.Pagination
                        shadow
                        noMargin
                        align="end"
                        rowsPerPage={7}
                    />: null
                }
            </Table>
             
        </div>
        
    )
}

export default RenewalsTable

