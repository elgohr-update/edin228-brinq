import React from 'react'
import { useTheme } from '@nextui-org/react';
import { MdPermContactCalendar } from 'react-icons/md';
import Link from 'next/link';
import TagBasic from '../ui/tag/TagBasic';
import { abbreviateMoney } from '../../utils/utils';
import TagSimple from '../ui/tag/TagSimple';
import TagContainer from '../ui/tag/TagContainer';

const ClientCrossReferenceCard = ({cref, border=false,vertical=false,panel=false,shadow=false}) => {
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
    const baseClass = `relative flex flex-auto shrink-0 items-center justify-between px-2 rounded-lg ${isBorder()} ${isPanel()} ${isShadow()}`
    return (
        <div className={baseClass}>
            <div className={`relative flex flex-col z-20 w-full`}>
                <Link href={`/clients/${cref.client.id}`}>
                    <a>
                        <h6 className={`hover:text-sky-500 transition duration-100 font-semibold`}>{cref.client.client_name}</h6>
                    </a>
                </Link>
                <TagContainer tags={cref.client?.tags} simple />
            </div>
            <h6 className="text-teal-500 font-semibold">
                ${abbreviateMoney(cref.client.premium)}
            </h6>
        </div>
    )
}

export default ClientCrossReferenceCard