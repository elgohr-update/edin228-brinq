import React, { useState } from 'react'
import { useTheme } from '@nextui-org/react';
import Link from 'next/link';

const LinkedMenuItem = ({label='',icon='',href='',isColor=false,color='error', isBold=true}) => {
    const { isDark, type } = useTheme();
    
    return (
        <>
            <Link href={href}>
                <a>
                    <div className={`flex items-center justify-between rounded-lg cursor-pointer px-4 py-2 w-full transtion ease-out duration-100 ${isColor? `text-color-${color}`:''}  ${isDark? `hover:bg-gray-600/10 ` : `hover:bg-slate-500/10 `}`}>
                        <h5>{icon}</h5>
                        <h5 className={`${isBold?'font-semibold':''}`}>{label}</h5>
                    </div>
                </a>
            </Link>
        </>
    )
}

export default LinkedMenuItem