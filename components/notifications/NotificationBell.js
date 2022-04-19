import { Avatar, useTheme } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { AiFillBell } from 'react-icons/ai';
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
            <Avatar 
                squared
                pointer
                size="md" 
                ghost="true"
                className={`z-10 ${type}-shadow`}
                icon={<AiFillBell size={20} fill="currentColor" />}
            />
            <div className={notifications.length > 0 ?`z-20 notif-bell-badge` :'hidden'} />
        </div>
    )
}

export default NotificationBell