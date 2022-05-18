import React from 'react'

export default function NavAction({onClick,icon,title, activeItem, itemId}) {
    const isActive = () => {
        if (activeItem == itemId){
            return 'opacity-100 active-path-small navlink-active'
        }
        return 'opacity-70 hover:opacity-100'
    }
    const isActiveBorder = () => {
        if (activeItem == itemId){
            return 'pink-to-blue-gradient-1'
        }
    }
    const isActiveIcon = () => {
        if (activeItem == itemId){
            return 'active-icon-glow'
        }
        return ''
    }
    return (
        <div onClick={onClick} className={`flex cursor-pointer relative text-xs tracking-wider transition duration-100 ease-out items-center px-1 py-1 ${isActive()}`}>
            <div className={`mr-2 ${isActiveIcon()}`}>{icon}</div>
            <div className={`flex mr-2`}>{title}</div>
            <div className={`${isActiveBorder()} navlink-border`} />
        </div>
    )
}
