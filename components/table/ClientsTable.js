import { Table, useTheme, Button, Input, Avatar, Tooltip, Progress, useCollator, Checkbox, useAsyncList } from '@nextui-org/react';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { FaFilter, FaSearch } from 'react-icons/fa';
import { truncateString, formatMoney, getSearch, getFormattedDate } from '../../utils/utils';
import UserAvatar from '../user/Avatar';
import Link from 'next/link';
import { useAppContext } from '../../context/state';
import LineIcon from '../util/LineIcon';
import TagBasic from '../ui/tag/TagBasic';

const ClientsTable = () => {
    const router = useRouter()
    const { type } = useTheme();
    const [search, setSearch] = useState('')
    const {state, setState} = useAppContext();
    const [showFilter, setShowFilter] = useState(true)
    const [minPrem, setMinPrem] = useState(null)
    const [maxPrem, setMaxPrem] = useState(null)
    const [minPolicies, setMinPolicies] = useState(null)
    const [maxPolicies, setMaxPolicies] = useState(null)
    const [visibleLines, setVisibleLines] = useState(null)
    const [visibleReps, setVisibleReps] = useState(null)
    const [visibleTags, setVisibleTags] = useState(null)
    const [lineList, setLineList] = useState(['Commercial Lines','Personal Lines','Benefits'])

    const rows = state.reports.data.clients.raw
    const tableData = state.reports.data.clients.filtered

    useEffect(() => {
        if (search.length > 1){
            const filtered = getSearch(rows,search)
            setState({...state,reports:{...state.reports,data:{...state.reports.data,clients:{...state.reports.data.clients,filtered:filtered}}}})
        }else {
            const filtered = state.reports.data.clients.raw
            setState({...state,reports:{...state.reports,data:{...state.reports.data,clients:{...state.reports.data.clients,filtered:filtered}}}})
        }
    }, [search,rows])

    useEffect(() => {
        const mnPrem = minPrem && minPrem != 0?  Number(minPrem) : 0
        const mxPrem = maxPrem && maxPrem != 0? Number(maxPrem) : 9999999
        const mnPol = minPolicies && minPolicies != 0?  Number(minPolicies) : 0
        const mxPol = maxPolicies && maxPolicies != 0? Number(maxPolicies) : 9999999
        
        function lineCheck(val){
            if (!lineList){
                return true
            }
            return lineList.includes(val)
        }

        const filtered = rows.filter(entry => 
            entry.premium >= mnPrem
            && entry.premium <= mxPrem
            && entry.policy_count >= mnPol
            && entry.policy_count <= mxPol
            && lineCheck(entry.line)
            // && this.usersCheck(entry.users)
        ) 
        setState({...state,reports:{...state.reports,data:{...state.reports.data,clients:{...state.reports.data.clients,filtered:filtered}}}}) 

    },[minPrem,maxPrem,minPolicies, maxPolicies,rows,lineList])


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
        key: "policy_count",
        label: "POLICIES",
      },
      {
        key: "premium",
        label: "PREMIUM",
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
                    <div className="flex w-[30px]">
                        <Tooltip content={cellValue}>
                            <LineIcon iconSize={18} size="sm" line={cellValue} />
                        </Tooltip>
                    </div>
                )
            case "client_name":
                const checkTheme = () => {
                    return type === 'dark' ?
                        `cursor-pointer hover:bg-gray-600/10 p-4 rounded  transition duration-100 ease-out`
                    :
                        `cursor-pointer hover:bg-gray-500/10 p-4 rounded  transition duration-100 ease-out`
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
                                    <div className="flex items-center flex-wrap pt-2 space-x-2">
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
                return '';
        }
    };
    const collator = useCollator({ numeric: true });
    async function load() {
        return {items:tableData}
    }
    async function sort({ items, sortDescriptor }) {
        return {
            items: items.sort((a, b) => {
            let first = a[sortDescriptor.column];
            let second = b[sortDescriptor.column];
            let cmp = collator.compare(first, second);
            if (sortDescriptor.direction === "descending") {
                cmp *= -1;
            }
            return cmp;
            }),
        };
    }
    const list = useAsyncList({ load, sort });

    function selectItems(items) { 
        const base = items.entries()
    }

    function setLineFilter(checked,line){
        if (checked){
            const filtered = [...lineList, line]
            setLineList(filtered)
        }
        else {
            const filtered = lineList.filter(x => x != line)
            setLineList(filtered)
        }
    }
    

    return (
        <div className="flex flex-col md:flex-row h-full w-full">
            {showFilter ?
                <div className={`flex flex-col w-full md:w-[400px] h-auto space-y-4 py-4 px-4 panel-flat-${type} ${type}-shadow`}>
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
                            onChange={ e => setMinPrem(e.target.value)}
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
                            onChange={ e => setMaxPrem(e.target.value)}
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
                            onChange={ e => setMinPolicies(e.target.value)}
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
                            onChange={ e => setMaxPolicies(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col spacy-y-4">
                        <h4>Filter Lines</h4>
                        <Checkbox.Group value={lineList}>
                            <Checkbox color="primary" labelColor="primary" size="sm" value="Commercial Lines" onChange={(e) => setLineFilter(e.target.checked,'Commercial Lines')}>
                                Commercial Lines
                            </Checkbox>
                            <Checkbox color="error" labelColor="error" size="sm" value="Personal Lines" onChange={(e) => setLineFilter(e.target.checked,'Personal Lines')}>
                                Personal Lines
                            </Checkbox>
                            <Checkbox color="success" labelColor="success" size="sm" value="Benefits" onChange={(e) => setLineFilter(e.target.checked,'Benefits')}>
                                Benefits
                            </Checkbox>   
                        </Checkbox.Group>
                    </div>
                </div>    
            :null
            }
            <div className="flex flex-col h-full w-full px-2 pb-2">
                <div className="w-full items-center flex justify-between h-16 py-4">
                    <div className="flex items-center justify-end">
                        <Button color="warning" auto flat icon={<FaFilter fill="currentColor" />} onClick={() => setShowFilter(!showFilter)}/>
                    </div>
                    <div className="flex items-center w-full pr-2">
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
                </div>
                <Table
                    compact
                    hoverable={false}
                    sticked
                    bordered={false}
                    animated="true"
                    shadow={false}
                    lined={true}
                    aria-label="Clients Table"
                    sortDescriptor={list.sortDescriptor}
                    onSortChange={list.sort}
                    // selectionMode="multiple"
                    // onSelectionChange={(selectedKeys)=>selectItems(selectedKeys)}
                    css={{
                        height: "100%",
                        minWidth: "100%",
                        borderWidth: "0px",
                    }}
                >
                    <Table.Header columns={columns}>
                        {(column) => (
                            column.key === 'client_name' || column.key === 'premium' || column.key === 'policy_count' ?
                                <Table.Column key={column.key} allowsSorting>
                                    <div className="table-column-header pl-2">
                                        {column.label}
                                    </div>
                                </Table.Column>
                            :
                                <Table.Column key={column.key}>
                                    <div className="table-column-header pl-2">
                                        {column.label}
                                    </div>
                                </Table.Column>
                        )}
                    </Table.Header>
                    <Table.Body items={list.items} loadingState={list.loadingState}>
                        {(item) => (
                            <Table.Row>
                                {(columnKey) => (
                                    <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>
                                )}
                            </Table.Row>
                        )}
                    </Table.Body>
                    {tableData.length > 8 ? 
                        <Table.Pagination
                            shadow
                            align="end"
                            noMargin
                            intialPage={1}
                            total={Math.floor(Number(tableData.length/8))}
                            rowsPerPage={8}
                        />: null
                    }
                </Table>
            </div>
        </div>
        
    )
}

export default ClientsTable

