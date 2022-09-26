import { Avatar, useTheme } from '@nextui-org/react'
import React from 'react'
import { RiBuilding4Fill } from 'react-icons/ri';
import { GiHomeGarage } from 'react-icons/gi';
import { MdMedicalServices } from 'react-icons/md';

const LineIcon = ({line, size="sm", iconSize=15, active=true}) => {
    const { type } = useTheme();
    return (
        line == 'Commercial Lines' ? 
            <Avatar 
                squared
                pointer
                size={size}
                color={active ? "primary" : '#ffffff'}
                className={`z-10 font-bold ${type}-shadow`}
                icon={<RiBuilding4Fill size={iconSize} fill="white" />}
            />
        :
        line == 'Personal Lines' ? 
            <Avatar 
                squared
                pointer
                size={size} 
                color={active ? "error" : '#ffffff'}
                className={`z-10 font-bold ${type}-shadow`}
                icon={<GiHomeGarage size={iconSize} fill="white" />}
            />
        :
            <Avatar 
                squared
                pointer
                size={size} 
                color={active ? "success" : '#ffffff'}
                className={`z-10 font-bold ${type}-shadow`}
                icon={<MdMedicalServices size={iconSize} fill="white" />}
            />
    )
}

export default LineIcon