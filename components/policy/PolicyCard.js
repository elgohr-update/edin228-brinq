import React, { useState } from 'react'
import { useTheme, Avatar } from '@nextui-org/react';
import { AiOutlineLeft,AiOutlineDown } from 'react-icons/ai';
import { BsListTask } from 'react-icons/bs';
import LineIcon from '../util/LineIcon';
import { formatMoney, getFormattedDate, truncateString } from '../../utils/utils';
import TagBasic from '../ui/tag/TagBasic';
import TaskCard from './../task/TaskCard';
import UserAvatar from '../user/Avatar';

const PolicyCard = ({policy,border=false,truncate=20,vertical=false,shadow=false}) => {
    const { isDark, type } = useTheme();
    const [showMore, setShowMore] = useState(false)
    const [modifyStyle, setModifyStyle] = useState({p:false,s:false,b:false})

    const toggleShowMore = () => {
        setShowMore(!showMore)
        if (!showMore){
            setModifyStyle(
                {p:true,s:true,b:false}
            )
        }else{
            setModifyStyle(
                {p:false,s:false,b:false}
            )
        }
    }

    const isVertical = () =>{
        return vertical ? `flex-col space-y-2` : `flex-row items-center`
    }
    const isPanel = () =>{
        return modifyStyle.p ? `panel-flatter-${type}` : ``
    }
    const isShadow = () =>{
        return modifyStyle.s? `${type}-shadow` : ``
    }
    const isBorder = () =>{
        return modifyStyle.b ? `${isDark?`border-slate-200`:`border-slate-200`} border` : ``
    }
    
    const baseClass = `flex h-auto min-h-[64px] relative text-xs transition-all ${border?`${isDark?`border-slate-900`:`border-slate-200`} border`:null} ${shadow?`${type}-shadow`:null} duration-200 ease-out flex-col w-full p-2 rounded-lg ${isBorder()} ${isVertical()} ${isPanel()} ${isShadow()}`
    return (
        <div className={baseClass}>
            <div className={`flex flex-col h-auto md:flex-row w-full md:items-center`}>
                <div className="flex items-center w-full md:w-fit md:min-w-[240px]">
                    <div className="mr-4">
                        <LineIcon iconSize={18} size="sm" line={policy.line} />
                    </div>
                    <div className={`relative flex space-x-1 md:space-x-0 flex-col space-y-1 items-end mr-4`}>
                        <TagBasic text={policy.policy_type} />
                        {   
                            policy.nonrenewed ? <TagBasic text={`NRNWD`} color="red" /> :
                            policy.nottaken ? <TagBasic text={`NTTKN`} color="red" /> :
                            policy.rewritten ? <TagBasic text={`RWRTN`} color="purple" /> :
                            policy.canceled ? <TagBasic text={`CNCLD`} color="red" /> :
                            policy.ams360quote ? <TagBasic text={`QTE`} color="orange" /> :
                            policy.renewed ? <TagBasic text={`RNWD`} color="blue" /> :
                            <TagBasic text={`ACTV`} color="green" />
                        }   
                    </div>
                    <div className={`relative flex flex-col w-full md:min-w-[150px] md:max-w-[150px] md:mr-2`}>
                        <h6 className={`font-semibold`}>{truncateString(String(policy.policy_number),16)}</h6>
                        <h4 className={``}>{truncateString(policy.policy_type_full,truncate)}</h4>
                    </div>
                    <div onClick={() => toggleShowMore()} className={`md:hidden relative flex items-center justify-end ml-4 px-1 h-full hover:text-sky-500 cursor-pointer transition duration-100 ease-out`}>
                        <BsListTask />{showMore ? <AiOutlineDown /> : <AiOutlineLeft />}
                    </div>
                </div>
                <div className={`relative flex md:hidden flex-col flex-1 py-2`}>
                    <h6 className={`font-semibold`}>{truncateString(policy.carrier,truncate)}</h6>
                    <h4 className={``}>{truncateString(policy.writing,truncate)}</h4>
                </div>
                <div className="flex items-center md:pt-0 flex-1">
                    <div className={`hidden relative md:flex flex-col flex-1`}>
                        <h6 className={`font-semibold`}>{truncateString(policy.carrier,truncate)}</h6>
                        <h4 className={``}>{truncateString(policy.writing,truncate)}</h4>
                    </div>
                    <div className={`relative flex flex-col items-end md:flex-1`}>
                        <h4 className={`letter-spacing-1`}>{getFormattedDate(policy.effective_date)}</h4>
                        <h6 className={`letter-spacing-1`}>{getFormattedDate(policy.expiration_date)}</h6>
                    </div>
                    <div className={`relative flex justify-end w-full md:flex-1 pr-6 md:pr-4`}>
                        <h6 className={`text-teal-500 font-bold`}>$ {formatMoney(policy.premium)}</h6>
                    </div>
                    <div className="flex items-center w-full flex-1">
                        <div className={`relative flex justify-end flex-1`}>
                            <Avatar.Group count={policy.users.length > 3? client.users.length : null}>
                                {policy.users.filter(x => !x.producer).map( u => (
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
                        <div onClick={() => toggleShowMore()} className={`hidden relative md:flex items-center justify-end ml-4 px-1 h-full hover:text-sky-500 cursor-pointer transition duration-100 ease-out`}>
                            <BsListTask />{showMore ? <AiOutlineDown /> : <AiOutlineLeft />}
                        </div>
                    </div>
                </div>
                
                
            </div>
            {
                showMore? 
                <div className="flex h-auto w-full pt-2">
                    <div className={`top2-border-flair pink-to-blue-gradient-1`} />
                    <div className={`flex flex-col w-full py-2`}>
                        <div className="flex flex-col space-y-1">
                            {policy.tasks.map( t => {
                                return <TaskCard key={t.id} task={t} />
                            })}    
                        </div>
                        
                    </div>
                </div>
                
                :null
            }
        </div>
    )
}

export default PolicyCard