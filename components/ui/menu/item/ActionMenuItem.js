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
        className={`transtion flex w-full cursor-pointer items-center rounded-lg px-2 py-2 duration-100 ease-out`}
      >
        <h5 className="mr-4">{icon}</h5>
        <h5 className={`${isBold ? 'font-semibold' : ''}`}>{label}</h5>
      </div>
    </>
  )
}

export default ActionMenuItem
