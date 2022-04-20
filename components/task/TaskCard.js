import React, { useState } from 'react'
import { useTheme } from '@nextui-org/react';
import { BsCheckCircleFill } from 'react-icons/bs';
import { BiCircle } from 'react-icons/bi';
import { getFormattedDate } from '../../utils/utils';
import UserAvatar from '../user/Avatar';

const TaskCard = ({task,border=false,vertical=false,color='sky',gradientColor="orange",panel=false,shadow=false}) => {
    const { isDark, type } = useTheme();
    const [showMore, setShowMore] = useState(false)
    const [selected, setSelected] = useState(false)

    const toggleShowMore = () => {
        setShowMore(!showMore)
    }

    const isVertical = () =>{
        return vertical ? `flex-col space-y-2` : `flex-row items-center`
    }
    const isPanel = () =>{
        return panel ? `panel-flat-${type}` : ``
    }
    const isShadow = () =>{
        return shadow ? `${type}-shadow` : ``
    }
    const isBorder = () =>{
        return border ? `${isDark?`border-slate-900`:`border-slate-200`} border` : ``
    }
    const isSelected = () => {
        return selected ? `bg-gray-500/10 ${type}-shadow`:`hover:bg-gray-500/10 `
    }

    const baseClass = `${isSelected()} cursor-pointer flex flex-col w-full h-full relative transition-all duration-100 ease-out w-full p-2 rounded-lg ${isBorder()} ${isVertical()} ${isPanel()} ${isShadow()}`
    return (
        <div className={baseClass}>
            <div className={`flex w-full items-center space-x-4`} onClick={() => setSelected(!selected)}>
                <div className="">
                    {task?.done ? task?.completed ? <div className="text-color-success"><BsCheckCircleFill/></div> : <div className="text-color-warning"><BsCheckCircleFill/></div> : <BiCircle/>}
                </div>
                <div className={`relative flex flex-col space-y-1 flex-1`}>
                    <div className="text-xs">{task?.title}</div>
                </div>
                <div className={`relative flex flex-col space-y-1 items-end w-50`}>
                    <h6 className={`letter-spacing-1 text-color-success`}>{task.done?getFormattedDate(task?.completed_date):null}</h6>
                </div>
                <div className={`relative flex flex-col space-y-1 items-end w-50`}>
                    <h4 className={`letter-spacing-1 ${task.done?`line-through`:'opacity-100'}`}>{getFormattedDate(task?.date)}</h4>
                </div>
                <div className={`relative flex flex-col space-y-1  w-50`}>
                    <UserAvatar 
                        isUser
                        size="sm"
                        squared={false}
                        passUser={task.users.find(x => x.id == task.assigned_id)}
                    />
                </div>
            </div>
            {
                selected ? 
                <div>
                    asdasdsadsadsadssad
                </div>
                :null
            }
        </div>
    )
}

export default TaskCard