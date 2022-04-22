import React from 'react'
import { useTheme } from '@nextui-org/react';

const ActionMenuItem = ({onClick,label='',icon='',isColor=false,color='error',isBold=true}) => {
    const { isDark, type } = useTheme();
    
    return (
        <>
            <div onClick={onClick} className={`flex items-center rounded-lg cursor-pointer px-2 py-2 w-full transtion ease-out duration-100 hover:text-sky-500 hover:bg-sky-300/10`}>
                <h5 className="mr-4">{icon}</h5>
                <h5 className={`${isBold?'font-semibold':''}`}>{label}</h5>
            </div>
        </>
    )
}

export default ActionMenuItem