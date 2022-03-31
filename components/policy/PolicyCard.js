import React, { useState } from 'react'
import { useTheme } from '@nextui-org/react';
import { AiOutlineLeft,AiOutlineDown } from 'react-icons/ai';
import { BsListTask } from 'react-icons/bs';
import LineIcon from '../util/LineIcon';
import { formatMoney, getFormattedDate, truncateString } from '../../utils/utils';
import TagBasic from '../ui/tag/TagBasic';
import TaskCard from './../task/TaskCard';

const PolicyCard = ({policy,border=false,vertical=false,color='sky',gradientColor="orange",panel=false,shadow=false}) => {
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
        return modifyStyle.p ? `panel-flat-${type}` : ``
    }
    const isShadow = () =>{
        return modifyStyle.s? `${type}-shadow` : ``
    }
    const isBorder = () =>{
        return modifyStyle.b ? `${isDark?`border-slate-200`:`border-slate-200`} border` : ``
    }
    const getColor = () => {
        const def = {bg:`bg-sky-300/80`,text:`text-sky-400`}
        switch (color) {
            case 'emerald':
                return {bg:`bg-emerald-300/80`,text:`text-emerald-400`}
            case 'purple':
                return {bg:`bg-purple-300/80`,text:`text-purple-400`}
            case 'pink':
                return {bg:`bg-pink-300/80`,text:`text-pink-400`}
            case 'teal':
                return {bg:`bg-teal-300/80`,text:`text-teal-400`}
            case 'amber':
                return {bg:`bg-amber-300/80`,text:`text-amber-400`}
            case 'fuchsia':
                return {bg:`bg-fuchsia-300/80`,text:`text-fuchsia-400`}
            case 'rose':
                return {bg:`bg-rose-300/80`,text:`text-rose-400`}
            case 'violet':
                return {bg:`bg-violet-300/80`,text:`text-violet-400`}
            case 'indigo':
                return {bg:`bg-indigo-300/80`,text:`text-indigo-400`}
            case 'cyan':
                return {bg:`bg-cyan-300/80`,text:`text-cyan-400`}
            case 'red':
                return {bg:`bg-red-300/80`,text:`text-red-400`}
            case 'yellow':
                return {bg:`bg-yellow-300/80`,text:`text-yellow-400`}
            case 'orange':
                return {bg:`bg-orange-300/80`,text:`text-orange-400`}
            case 'lime':
                return {bg:`bg-lime-300/80`,text:`text-lime-400`}
            default:
                return def;
        }
    }

    const returnGradient = () => {
        switch(gradientColor) {
            case 'orange':
                return 'orange-gradient-1'
            case 'orange-reverse':
                return 'orange-reverse-gradient-1'
            case 'pink':
                return 'pink-gradient-1'
            case 'green':
                return 'green-gradient-1'
            case 'blue':
                return 'blue-gradient-1'
            case 'peach':
                return 'peach-gradient-1'
            case 'blood-orange':
                return 'blood-orange-gradient-1'
            case 'grand-blue':
                return 'grand-blue-gradient-1'
            case 'celestial':
                return 'celestial-gradient-1'
            case 'purple-to-green':
                return 'purple-to-green-gradient-1'
            case 'pink-to-orange':
                return 'pink-to-orange-gradient-1'
            case 'pink-to-blue':
                return 'pink-to-blue-gradient-1'
            case 'green-to-orange':
                return 'green-to-orange-gradient-1'
            case 'grand-blue-to-orange':
                return 'grand-blue-to-orange-gradient-1'
            case 'green-to-blue-2':
                return 'green-to-blue-gradient-2'
            case 'blue-to-orange-2':
                return 'blue-to-orange-gradient-2'
            case 'orange-to-red-2':
                return 'orange-to-red-gradient-2'
            case 'orange-to-green-gradient-2':
                return 'orange-to-green-gradient-2'
            case 'blue-to-orange-gradient-3':
                return 'blue-to-orange-gradient-3'
            case 'purple-to-blue-gradient-2':
                return 'purple-to-blue-gradient-2'
        }
    }
    const baseClass = `relative transition-all duration-200 ease-out ${!showMore?`max-h-60`:`max-h-screen`} flex-col w-full p-2 rounded-lg ${isBorder()} ${isVertical()} ${isPanel()} ${isShadow()}`
    return (
        <div className={baseClass}>
            <div className={`flex w-full items-center`}>
                <div className="mr-4">
                    <LineIcon iconSize={18} size="sm" line={policy.line} />
                </div>
                <div className={`relative flex flex-col space-y-1 items-end mr-4`}>
                    <TagBasic text={policy.policy_type} />
                    <TagBasic text={`active`} color="green" />
                </div>
                <div className={`relative flex flex-col flex-1`}>
                    <h6 className={`font-semibold`}>{truncateString(String(policy.policy_number),16)}</h6>
                    <h4 className={``}>{policy.policy_type_full}</h4>
                </div>
                <div className={`relative flex flex-col flex-1`}>
                    <h6 className={`font-semibold`}>{truncateString(policy.carrier,20)}</h6>
                    <h4 className={``}>{truncateString(policy.writing,20)}</h4>
                </div>
                <div className={`relative flex flex-col items-end flex-1`}>
                    <h4 className={`letter-spacing-1`}>{getFormattedDate(policy.effective_date)}</h4>
                    <h6 className={`letter-spacing-1`}>{getFormattedDate(policy.expiration_date)}</h6>
                </div>
                <div className={`relative flex justify-end flex-1`}>
                    <h6 className={`text-teal-500 font-bold`}>$ {formatMoney(policy.premium)}</h6>
                </div>
                <div onClick={() => toggleShowMore()} className={`relative flex items-center justify-end ml-4 px-1 h-full hover:text-sky-500 cursor-pointer transition duration-100 ease-out`}>
                    <BsListTask />{showMore ? <AiOutlineDown /> :<AiOutlineLeft />}
                </div>
            </div>
            {
                showMore? 
                <div className="pt-2">
                    <div className={`top2-border-flair pink-to-blue-gradient-1`} />
                    <div className={`flex flex-col w-full py-2`}>
                        <div className={`flex w-full items-center space-x-2`}>
                            <div className="mr-8">
                            </div>
                            <h4 className={`relative flex flex-1 tracking-widest`}>
                                DESCRIPTION
                            </h4>
                            <h4 className={`relative flex items-end w-50 tracking-widest`}>
                                COMPLETED
                            </h4>
                            <div></div>
                            <div></div>
                            <div></div>
                            <h4 className={`relative flex items-end w-50 tracking-widest`}>
                                DUE
                            </h4>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <h4 className={`relative flex w-50 tracking-widest`}>
                                REP
                            </h4>
                            <div></div>
                        </div>
                        {policy.tasks.map( t => {
                            return <TaskCard key={t.id} task={t} />
                        })}
                    </div>
                </div>
                
                :null
            }
        </div>
    )
}

export default PolicyCard