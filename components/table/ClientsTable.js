import { Table, useTheme, Button, Input, Avatar, Tooltip, useCollator, Checkbox } from '@nextui-org/react';
import React, { useEffect, useState, useTransition } from 'react'
import { FaFilter, FaSearch } from 'react-icons/fa';
import { formatMoney, getSearch } from '../../utils/utils';
import UserAvatar from '../user/Avatar';
import Link from 'next/link';
import { useAppContext } from '../../context/state';
import LineIcon from '../util/LineIcon';
import TagBasic from '../ui/tag/TagBasic';
import TagContainer from '../ui/tag/TagContainer';

const ClientsTable = () => {
    const { type } = useTheme();
    const [isPending, startTransition] = useTransition()
    const [search, setSearch] = useState('')
    const {state, setState} = useAppContext();
    const [showFilter, setShowFilter] = useState(true)
    const [minPrem, setMinPrem] = useState(null)
    const [maxPrem, setMaxPrem] = useState(null)
    const [minPolicies, setMinPolicies] = useState(null)
    const [maxPolicies, setMaxPolicies] = useState(null)
    const [visibleReps, setVisibleReps] = useState(null)
    const [visibleTags, setVisibleTags] = useState(null)
    const [lineList, setLineList] = useState(['Commercial Lines','Personal Lines','Benefits'])
    const [sortDescriptor,setSortDescriptor] = useState('ascending')

    const rows = state.reports.data.clients.raw
    const tableData = state.reports.data.clients.filtered

    const searchTable = (val) => {
        startTransition( () => {
            if (val.length > 1){
                const filtered = getSearch(rows,val)
                setState({...state,reports:{...state.reports,data:{...state.reports.data,clients:{...state.reports.data.clients,filtered:filtered}}}})
            }else {
                const filtered = rows
                setState({...state,reports:{...state.reports,data:{...state.reports.data,clients:{...state.reports.data.clients,filtered:filtered}}}})
            }        
        })
    }

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
                    <div className="flex items-center justify-center">
                        <Tooltip content={cellValue}>
                            <LineIcon iconSize={18} size="sm" line={cellValue} />
                        </Tooltip>
                    </div>
                )
            case "client_name":
                const checkTheme = () => {
                    return type === 'dark' ?
                        `h-full w-full hover:bg-gray-600/10 p-4 rounded  transition duration-100 ease-out`
                    :
                        `h-full w-full hover:bg-gray-500/10 p-4 rounded  transition duration-100 ease-out`
                }
                return (
                    <div className="text-xs px-2">
                        <div className={checkTheme()} onClick={() => openSidebar(client)}>
                            <Link href={`/client/${client.id}`}>
                                <a className="hover:text-sky-500 transition duration-100 ease-in-out">
                                    {cellValue}
                                </a>
                            </Link>
                            <TagContainer tags={client?.tags} />
                        </div>
                    </div>
                )
            case "policy_count":
                return (
                    <div className="text-xs flex justify-center">
                        <div className="flex justify-end w-[50px]">
                            {cellValue}
                        </div>
                    </div>
                )
            case "premium":
                return (
                    <div className="text-xs flex justify-center">
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
                                    size={`sm`}
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
    
    async function sort(sortDescriptor) {
        setSortDescriptor(sortDescriptor)
        const sorted = tableData.sort((a, b) => {
            let first = a[sortDescriptor.column];
            let second = b[sortDescriptor.column];
            let cmp = collator.compare(first, second);
            if (sortDescriptor.direction === "descending") {
                cmp *= -1;
            }
            return cmp;
        })
        setState({...state,reports:{...state.reports,data:{...state.reports.data,policies:{...state.reports.data.policies,filtered:sorted}}}}) 
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
                <div className={`flex flex-col w-full md:w-[400px] rounded-lg h-auto space-y-4 py-4 px-4 panel-flat-${type} ${type}-shadow`}>
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
                        <Checkbox color="primary" labelColor="primary" size="sm" initialChecked={true} value="Commercial Lines" onChange={(e) => setLineFilter(e,'Commercial Lines')}>
                            Commercial Lines
                        </Checkbox>
                        <Checkbox color="error" labelColor="error" size="sm" initialChecked={true} value="Personal Lines" onChange={(e) => setLineFilter(e,'Personal Lines')}>
                            Personal Lines
                        </Checkbox>
                        <Checkbox color="success" labelColor="success" size="sm" initialChecked={true} value="Benefits" onChange={(e) => setLineFilter(e,'Benefits')}>
                            Benefits
                        </Checkbox>   
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
                            onChange={ e => searchTable(e.target.value)}
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
                    sortDescriptor={sortDescriptor}
                    onSortChange={(s) => sort(s)}
                    css={{
                        height: "100%",
                        minWidth: "100%",
                        borderWidth: "0px",
                    }}
                >
                    <Table.Header columns={columns}>
                        {(column) => (
                            column.key === 'client_name'  ?
                                <Table.Column key={column.key} allowsSorting>
                                    <div className="text-xs table-column-header pl-5">
                                        {column.label}
                                    </div>
                                </Table.Column>
                            :
                            column.key === 'line' || column.key === 'reps' ?
                                <Table.Column key={column.key} allowsSorting>
                                    <div className="flex justify-center items-center text-xs table-column-header px-1">
                                        {column.label}
                                    </div>
                                </Table.Column>
                            :
                            <Table.Column key={column.key}  allowsSorting>
                                <div className="flex items-center justify-center text-xs table-column-header px-1">
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
                    {tableData.length > 10 ? 
                        <Table.Pagination
                            shadow
                            align="center"
                            noMargin
                            rowsPerPage={10}
                            total={Math.floor(Number(tableData.length/10))}
                        />: null
                    }
                </Table>
            </div>
        </div>
        
    )
}

export default ClientsTable

