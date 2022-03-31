import { Avatar, Switch, Tooltip, useTheme } from '@nextui-org/react'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { useTheme as useNextTheme } from 'next-themes'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react';


const UserAvatar = ({tooltip=false,size="md",tooltipPlacement="bottomEnd", isLink=true, squared=true,isUser=false,passUser={}, isGrouped=false }) => {
    const { setTheme } = useNextTheme();
    const { isDark, type } = useTheme();
    const router = useRouter()
    const { data: session } = useSession()

    const user = isUser ? 
        passUser : 
        session?.user

    return (
        <div className="flex items-center justify-center w-full h-full relative cursor-pointer z-40">
            {
                tooltip && isLink ? 
                <Link href={`/user/${user?.id}`}>
                    <a>
                        <Tooltip content={user?.name} placement={tooltipPlacement}>
                            <Avatar 
                                bordered={false}
                                squared={squared}
                                className={`${type}-shadow`}
                                pointer
                                size={size} 
                                zoomed
                                text={user?.name}
                                src={user?.image ? user?.image : user?.image_file}  
                            />
                        </Tooltip>
                    </a>
                </Link>
                :
                isLink ?
                    <Link href={`/user/${user?.id}`}>
                        <a>
                            <Avatar 
                                bordered={false}
                                squared={squared}
                                className={`${type}-shadow`}
                                pointer
                                size={size} 
                                zoomed
                                text={user?.name}
                                src={user?.image ? user?.image : user?.image_file}  
                            />
                        </a>
                    </Link>
                :
                tooltip ? 
                <Tooltip content={user?.name} placement={tooltipPlacement}>
                    <Avatar 
                        bordered={false}
                        squared={squared}
                        className={`${type}-shadow`}
                        size={size} 
                        zoomed
                        text={user?.name}
                        src={user?.image ? user?.image : user?.image_file}  
                    />
                </Tooltip>
                :
                isGrouped ?
                    <Avatar 
                        squared={squared}
                        className={`${type}-shadow`}
                        size={size} 
                        color="gradient"
                        bordered={false}
                        zoomed
                        text={user?.name}
                        src={user?.image ? user?.image : user?.image_file} 
                    />
                :
                <Avatar 
                    squared={squared}
                    bordered={false}
                    className={`${type}-shadow`}
                    size={size} 
                    color="gradient"
                    zoomed
                    text={user?.name}
                    src={user?.image ? user?.image : user?.image_file} 
                />
            }
        </div>
    )
}

export default UserAvatar