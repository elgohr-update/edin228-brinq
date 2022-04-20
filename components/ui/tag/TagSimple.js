import React from 'react'
import { Tooltip, useTheme } from '@nextui-org/react';

const TagSimple = ({text='',color='sky',shadow=true}) => {
    const { isDark, type } = useTheme();
    const isShadow = () =>{
        return shadow ? `${type}-shadow` : ``
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
        <div>
            <Tooltip content={text}>
                <div className={`tag-simple ${getColor()} ${isShadow()}`} />
            </Tooltip>
        </div>
    )
}

export default TagSimple