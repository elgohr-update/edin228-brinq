import { useTheme } from '@nextui-org/react'
import React from 'react'

function Panel({children, flat=false, noBg=false, shadow=true, px=2,py=2, overflow=true}) {
    const { type } = useTheme()
    return (
        <div className={`flex flex-col ${overflow?`overflow-y-auto`:null} rounded-lg px-${px} py-${py} w-full ${noBg?null:`panel-${flat?'flat':'theme'}-${type}`} ${shadow? `${type}-shadow`:null}`}>
            {children}
        </div>
    )
}

export default Panel