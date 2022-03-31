import { Button, Switch, useTheme } from '@nextui-org/react'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { AiOutlineDown } from 'react-icons/ai';
import { useTheme as useNextTheme } from 'next-themes'
import { useRouter } from 'next/router'
import { BsPlusLg } from 'react-icons/bs';
import HiddenBackdrop from '../../util/HiddenBackdrop';


const NewActionMenu = () => {
    const { setTheme } = useNextTheme();
    const { isDark, type } = useTheme();
    const [openMenu, setOpenMenu] = useState(false)
    const router = useRouter()

    const closeMenu = () => {
        setOpenMenu(false)
    }

    return (
        <div className="flex items-center justify-center w-full h-full relative">
            <Button size="md" className={`${type}-shadow`} color="gradient" auto onClick={ () => setOpenMenu(!openMenu)}>
                <div className="pr-2">
                    <BsPlusLg />
                </div>
                <div className="pl-2">
                    <AiOutlineDown />
                </div>
            </Button>
            {openMenu?<HiddenBackdrop onClick={() => closeMenu()} />:null}            
            <div className={openMenu?`z-50 transition-all duration-200 ease-out opacity-1 absolute top-[50px] right-[2px] h-60 w-[200px] rounded panel-theme-${type} ${type}-shadow`: 'absolute transition-all duration-200 ease-out opacity-0 top-[-37px]'}>
                
            </div>
        </div>
    )
}

export default NewActionMenu