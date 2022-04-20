import { useTheme } from '@nextui-org/react'
import React from 'react'

function Panel({children, flat=false, noBg=false, shadow=true, px=2,py=2, overflow=true, horizontal=false}) {
    const { type } = useTheme()
    return (
        <div className={`flex ${horizontal? 'flex-col md:flex-row':'flex-col'} ${overflow?`overflow-y-auto`:null} rounded-lg px-${px} py-${py} w-full ${noBg?null:`panel-${flat?'flat':'theme'}-${type}`} ${shadow? `${type}-shadow`:null}`}>
            {children}
        </div>
    )
}

export default Panel