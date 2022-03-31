import React from 'react'
import { useTheme } from '@nextui-org/react';
import { MdPermContactCalendar } from 'react-icons/md';

const ContactCard = ({contact,border=false,vertical=false,panel=false,shadow=false}) => {
    const { isDark, type } = useTheme();
    
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
    const baseClass = `relative flex flex-1 min-w-[240px] p-2 rounded-lg ${isBorder()} ${isVertical()} ${isPanel()} ${isShadow()}`
    return (
        <div className={baseClass}>
            <div className={`${vertical ? 'flex justify-end': `flex`} z-20`}>
                <div className={`flex items-center ${type}-shadow justify-center mr-2 rounded ${isDark?'bg-slate-500/20':'bg-white/40'} p-2 w-[30px] h-[30px]`}>
                    <div className={``}><MdPermContactCalendar /></div>
                </div>
            </div>
            <div className={`relative flex flex-col z-20 ${vertical ? '': `w-full`}`}>
                <h6 className={`font-semibold`}>{contact.first_name} {contact.last_name}</h6>
                <h4 className={``}>{contact.email}</h4>
            </div>
        </div>
    )
}

export default ContactCard