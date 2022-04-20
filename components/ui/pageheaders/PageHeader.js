import { useTheme } from '@nextui-org/react'
import React from 'react'
import { useAppContext } from '../../../context/state'

const PageHeader = ({children}) => {
    const { state, setState } = useAppContext()
    const { isDark, type } = useTheme()
    return (
        <div className={`flex w-full py-2 items-center justify-between px-4 sticky top-0 z-50 ${state.scrollY > 0 ? `${type}-shadow panel-flat-${type}`: null}`}>
            {children}
        </div>
    )
}

export default PageHeader