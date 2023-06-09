import React from 'react'
import { isMobile, truncateString } from '../../../utils/utils'

export default function NavAction({
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
      className={`relative flex cursor-pointer items-center px-1 py-1 text-xs tracking-wider transition duration-100 ease-out ${isActive()}`}
    >
      <div className={`mr-2 ${isActiveIcon()}`}>{icon}</div>
      <div className={`mr-2 flex`}>{title}</div>
      <div className={`${isActiveBorder()} navlink-border`} />
    </div>
  )
}
