import { Table, useTheme, Button, Input, Avatar, Tooltip, useCollator, Checkbox } from '@nextui-org/react';
import React, { useEffect, useState, useTransition } from 'react'
import { FaFilter, FaSearch } from 'react-icons/fa';
import { truncateString, formatMoney, getSearch, getFormattedDate } from '../../utils/utils';
import UserAvatar from '../user/Avatar';
import Link from 'next/link';
import { useAppContext } from '../../context/state';
import LineIcon from '../util/LineIcon';
import TagBasic from '../ui/tag/TagBasic';

const PoliciesTable = () => {
    const { type } = useTheme();
    const [isPending, startTransition] = useTransition()
    const [search, setSearch] = useState('')
    const {state, setState} = useAppContext();
    const [showFilter, setShowFilter] = useState(true)
    const [minPrem, setMinPrem] = useState(null)
    const [maxPrem, setMaxPrem] = useState(null)
    const [visibleReps, setVisibleReps] = useState(null)
    const [visibleTags, setVisibleTags] = useState(null)
    const [lineList, setLineList] = useState(['Commercial Lines','Personal Lines','Benefits'])
    const [sortDescriptor,setSortDescriptor] = useState('ascending')

    const rows = state.reports.data.policies.raw
    const tableData = state.reports.data.policies.filtered

    const searchTable = (val) => {
        startTransition( () => {
            if (val.length > 1){
                const filtered = getSearch(rows,val)
                setState({...state,reports:{...state.reports,data:{...state.reports.data,policies:{...state.reports.data.policies,filtered:filtered}}}})
            }else {
                const filtered = rows
                setState({...state,reports:{...state.reports,data:{...state.reports.data,policies:{...state.reports.data.policies,filtered:filtered}}}})
            }        
        })
    }

    useEffect(() => {
        const mnPrem = minPrem && minPrem != 0?  Number(minPrem) : 0
        const mxPrem = maxPrem && maxPrem != 0? Number(maxPrem) : 9999999
        
        function lineCheck(val){
            if (!lineList){
                return true
            }
            return lineList.includes(val)
        }

        const filtered = rows.filter(entry => 
            entry.premium >= mnPrem
            && entry.premium <= mxPrem
            && lineCheck(entry.line)
            // && this.usersCheck(entry.users)
        ) 
        setState({...state,reports:{...state.reports,data:{...state.reports.data,policies:{...state.reports.data.policies,filtered:filtered}}}}) 
    },[minPrem,maxPrem,rows,lineList])


    const columns = [
      {
        key: "line",
        label: "LINE",
      },
      {
        key: "policy_type",
        label: "POLICY",
      },
      {
        key: "policy_number",
        label: "POLICY NUMBER",
      },
      {
        key: "client_name",
        label: "NAME",
      },
      {
        key: "carrier",
        label: "CARRIER",
      },
      {
        key: "premium",
        label: "PREMIUM",
      },
      {
        key: "effective_date",
        label: "EFF DATE",
      },
      {
        key: "reps",
        label: "REPS",
      }
    ];

    const openSidebar = (client) => {
        setState({...state,drawer:{...state.drawer, client:{isOpen:true,clientId:client}}})
    }

    const renderCell = (policy, columnKey) => {
        const cellValue = policy[columnKey];
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
                        <div className={checkTheme()} onClick={() => openSidebar(policy.client_id)}>
                            <Link href={`/client/${policy.client_id}`}>
                                <a className="hover:text-sky-500 transition duration-100 ease-in-out">
                                    {cellValue}
                                </a>
                            </Link>
                            {
                                policy.client?.tags ?
                                    <div className="flex items-center flex-wrap pt-2 space-x-2">
                                        {
                                            policy.client?.tags.map( x => {
                                                return <TagBasic key={x.id} text={x.name} color={x.color} />
                                            })
                                        }
                                    </div>
                                :null
                            }
                        </div>
                    </div>
                )
            case "policy_number":
                return (
                    <div className={`relative flex flex-col`}>
                        <h6 className={`font-semibold`}>{truncateString(String(policy.policy_number),16)}</h6>
                        <h4 className={``}>{policy.policy_type_full}</h4>
                    </div>
                )
            case "carrier":
                return (
                    <div className={`relative flex flex-col flex-1`}>
                        <h6 className={`font-semibold`}>{truncateString(policy.carrier,20)}</h6>
                        <h4 className={``}>{truncateString(policy.writing,20)}</h4>
                    </div>
                )
            case "effective_date":
                return (
                    <div className={`relative flex flex-col items-end flex-1`}>
                        <h4 className={`letter-spacing-1`}>{getFormattedDate(policy.effective_date)}</h4>
                        <h6 className={`letter-spacing-1`}>{getFormattedDate(policy.expiration_date)}</h6>
                    </div>
                )
            case "policy_type":
                return (
                    <div className={`relative flex flex-col space-y-1 items-end mr-4`}>
                        <TagBasic text={policy.policy_type} />
                        <TagBasic text={`active`} color="green" />
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
                        <Avatar.Group count={policy.users.length > 3? policy.users.length : null}>
                            {policy.users.map( u => (
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
                    aria-label="Policies Table"
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
                            column.key !== 'reps' ?
                                <Table.Column key={column.key} allowsSorting>
                                    <div className="table-column-header pl-2">
                                        {column.label}
                                    </div>
                                </Table.Column>
                            :
                                <Table.Column key={column.key}>
                                    <div className="table-column-header pl-4">
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
                    {tableData.length > 8 ? 
                        <Table.Pagination
                            shadow
                            align="center"
                            noMargin
                            rowsPerPage={8}
                            total={Math.floor(Number(tableData.length/8))}
                        />: null
                    }
                </Table>
            </div>
        </div>
        
    )
}

export default PoliciesTable

