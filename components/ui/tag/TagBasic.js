import React from 'react'
import { Tooltip, useTheme } from '@nextui-org/react';
import { textAbbrev } from '../../../utils/utils';

const TagBasic = ({text='',color='sky',autoWidth=false, opacity=false, shadow=false,tooltip=false,tooltipContent=null}) => {
    const { isDark, type } = useTheme();
    const isShadow = () =>{
        return shadow ? `${type}-shadow` : ``
    }
    const isOpacity = () =>{
        return opacity ? `opacity-60` : ``
    }
    const getColor = () => {
        const def = 'tag-gray-bg'
        switch (color) {
            case 'green':
                return 'deal-tag-green'
            case 'blue':
                return 'deal-tag-blue'
            case 'red':
                return 'deal-tag-red'
            case 'orange':
                return 'deal-tag-orange'
            case 'purple':
                return 'deal-tag-purple'
            case 'pink':
                return 'deal-tag-pink'
            case 'yellow':
                return 'deal-tag-yellow'
            case 'subtle':
                return 'deal-tag-subtle'
            default:
                return def;
        }
    }

    return (
        
            tooltip ? 
            <Tooltip content={tooltipContent}>
                <div className={`${autoWidth ? `w-auto` : `min-w-[45px]` } tag-basic tag-text-shadow ${getColor()} ${isShadow()} ${isOpacity()}`}>
                    { textAbbrev(text) }
                </div> 
            </Tooltip>
            :
            <div className={`${autoWidth ? `w-auto` : `min-w-[45px]` } tag-basic tag-text-shadow ${getColor()} ${isShadow()} ${isOpacity()}`}>
                { textAbbrev(text) }
            </div>
        
    )
}

export default TagBasic