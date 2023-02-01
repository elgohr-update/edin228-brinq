import React from 'react'
import { isMobile, truncateString } from '../../../utils/utils'

export default function MobileNavAction({
  onClick,
  icon,
  title,
  activeItem,
  itemId,
}) {
  const mobile = isMobile()
  const active = activeItem == itemId
  const isActive = () => {
    if (activeItem == itemId) {
      return 'opacity-100 active-path-small navlink-active'
    }
    return 'opacity-70 hover:opacity-100'
  }
  const isActiveBorder = () => {
    if (activeItem == itemId) {
      return 'pink-to-blue-gradient-1'
    }
  }
  const isActiveIcon = () => {
    if (activeItem == itemId) {
      return 'active-icon-glow'
    }
    return ''
  }
  return (
    <div
      onClick={onClick}
      className={`relative flex cursor-pointer flex-col justify-center w-full items-center px-1 py-1 text-xs tracking-wider transition duration-100 ease-out ${isActive()}`}
    >
      <div className={`text-2xl ${isActiveIcon()}`}>{icon}</div>
      <div className={``}>{title}</div>
      <div className={`${isActiveBorder()} navlink-border`} />
    </div>
  )
}
