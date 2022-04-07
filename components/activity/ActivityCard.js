import React, { useState } from 'react'
import { useTheme } from '@nextui-org/react';
import { AiOutlineLeft,AiOutlineDown } from 'react-icons/ai';
import { BsBox } from 'react-icons/bs';
import LineIcon from '../util/LineIcon';
import { formatMoney, getFormattedDate, getFormattedDateTime, truncateString } from '../../utils/utils';
import TagBasic from '../ui/tag/TagBasic';
import UserAvatar from '../user/Avatar';
import Link from 'next/link';

const ActivityCard = ({activity,border=false,panel=false,shadow=false,hideClient=false,hidePolicy=false}) => {
    const { isDark, type } = useTheme();
    
    const isPanel = () =>{
        return panel ? `panel-flat-${type}` : ``
    }
    const isShadow = () =>{
        return shadow ? `${type}-shadow` : ``
    }
    const isBorder = () =>{
        return border ? `${isDark?`border-slate-900`:`border-slate-200`} border` : ``
    }
    const baseClass = `relative flex-col w-full p-2 rounded-lg ${isBorder()} ${isPanel()} ${isShadow()}`
    return (
        <div className={baseClass}>
            <div className={`flex w-full`}>
                <div className="mr-4 z-90">
                    <UserAvatar squared={false} tooltip={false} isUser={true} passUser={activity.users.find(x => x.id === activity.author_id)} />
                </div>
                <div className={`relative flex flex-col w-full`}>
                    <div className={`flex items-center justify-between w-full`}>
                        <div className="flex items-end space-x-2">
                            <h4>By {activity.author}</h4>
                            <div className="small-subtext">{getFormattedDateTime(activity.date)}</div>
                        </div>
                        <h4 className="text-xs small-subtext">{activity.activity_type}</h4>
                    </div>
                    <div className="flex py-1">
                        {activity.system_action ? <span className="flex mr-1"><h6>{activity.author}</h6></span> : null}
                        <span className="flex flex-1 flex-grow flex-wrap"><h6 dangerouslySetInnerHTML={{ __html: activity.description }} /></span>
                    </div>
                    <div className={`flex items-center space-x-2`}>
                        {
                            hideClient ? null : 
                            <Link href="/">
                                <a>
                                    <h6 className="text-sky-500">{activity.client_name}</h6>
                                </a>
                            </Link>
                        }
                        {
                            hidePolicy || activity.system_action ? null :
                            <div className="flex items-center w-full space-x-2">
                                <TagBasic text={activity.policy_type} />
                                <Link href="/">
                                    <a className="hover:text-sky-500 transition duration-100">
                                        <h4 className="flex items-center space-x-2"><BsBox /><div>{activity.policy_number}</div></h4>
                                    </a>
                                </Link>
                            </div> 
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ActivityCard