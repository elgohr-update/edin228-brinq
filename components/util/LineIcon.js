import { Avatar, useTheme } from '@nextui-org/react'
import React from 'react'
import { RiBuilding4Fill } from 'react-icons/ri';
import { GiHomeGarage } from 'react-icons/gi';
import { MdMedicalServices } from 'react-icons/md';

const LineIcon = ({line, size="sm", iconSize=15}) => {
    const { type } = useTheme();
    return (
        line == 'Commercial Lines' ? 
            <Avatar 
                squared
                pointer
                size={size}
                color="primary"
                className={`z-10 font-bold ${type}-shadow`}
                icon={<RiBuilding4Fill size={iconSize} fill="white" />}
            />
        :
        line == 'Personal Lines' ? 
            <Avatar 
                squared
                pointer
                size={size} 
                color="error"
                className={`z-10 font-bold ${type}-shadow`}
                icon={<GiHomeGarage size={iconSize} fill="white" />}
            />
        :
            <Avatar 
                squared
                pointer
                size={size} 
                color="success"
                className={`z-10 font-bold ${type}-shadow`}
                icon={<MdMedicalServices size={iconSize} fill="white" />}
            />
    )
}

export default LineIcon