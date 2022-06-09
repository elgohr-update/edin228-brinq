import React, { useState } from 'react'
import { useTheme } from '@nextui-org/react';
import Link from 'next/link';

const LinkedMenuItem = ({label='',icon='',href='',isColor=false,color='error', isBold=true}) => {
    const { isDark, type } = useTheme();
    
    return (
        <>
            <Link href={href}>
                <a>
                    <div className={`flex items-center rounded-lg cursor-pointer px-4 py-2 w-full transtion ease-out duration-100 ${isColor? `text-color-${color}`:''}  `}>
                        <h5 className="mr-4">{icon}</h5>
                        <h5 className={`${isBold?'font-semibold':''}`}>{label}</h5>
                    </div>
                </a>
            </Link>
        </>
    )
}

export default LinkedMenuItem