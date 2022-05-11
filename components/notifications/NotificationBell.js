import { Avatar, useTheme } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { BiBell } from 'react-icons/bi';
import { useTheme as useNextTheme } from 'next-themes'
import { useRouter } from 'next/router'


const NotificationBell = () => {
    const { setTheme } = useNextTheme();
    const { isDark, type } = useTheme();
    const router = useRouter()

    const notifications = [
        { 
            id:1,
            description: `lorem ipsum dolor sit amet, consect`,
            author: 'John Doe',
            read:false
        }
    ]

    return (
        <div className="flex items-center justify-center w-full h-full relative cursor-pointer">
            <div className="flex items-center justify-center hover:text-sky-500 transition duration-100 ease-out">
                <BiBell size={20} />
            </div>
            <div className={notifications.length > 0 ?`z-20 notif-bell-badge border-2 ${isDark ? `border-black`:`border-white`}` :'hidden'} />
        </div>
    )
}

export default NotificationBell