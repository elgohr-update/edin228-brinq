import React from 'react'
import { useTheme } from '@nextui-org/react'

const ActionMenuItem = ({
  onClick,
  label = '',
  icon = '',
  isBold = true,
}) => {
  const { isDark, type } = useTheme()

  return (
    <>
      <div
        onClick={onClick}
        className={`transtion flex w-full cursor-pointer items-center rounded-sm p-2 duration-100 ease-out`}
      >
        <h6 className="z-40 mr-4 overflow-hidden text-sm font-bold text-sky-500 active-icon-glow">{icon}</h6>
        <h6 className={`${isBold ? 'font-semibold' : ''} z-50`}>{label}</h6>
      </div>
    </>
  )
}

export default ActionMenuItem
