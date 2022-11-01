import { Button, useTheme } from '@nextui-org/react'
import React from 'react'
import { getIcon } from '../../../utils/utils'

function AgencyHeader({ data = null }) {
  const { isDark, type } = useTheme()
  return (
    <div
      className={`relative flex w-full rounded-lg p-4 panel-flat-${type} ${type}-shadow`}
    >
      <div
        className={`flex shrink-0 items-center justify-center border-2 overflow-hidden ${
          !isDark ? `border-black` : `border-white`
        } rounded-full panel-theme-${type} ${type}-shadow h-[80px] w-[80px]`}
      >
        {data?.icon ? (
          'icon'
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="text-2xl ">{getIcon('imagePlus')}</div>
            <div className="text-xs tracking-widest uppercase">Icon</div>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-center w-full ml-4">
        <div>{data?.name}</div>
        <div className="text-2xl font-bold">{data?.name}</div>
      </div>
      <div className="absolute bottom-2 right-2">
        <Button
          auto
          flat
          size="xs"
        >
          <span className="lg:mr-2">{getIcon('edit')}</span><span className="hidden lg:flex">Edit</span>
        </Button>
      </div>
    </div>
  )
}

export default AgencyHeader
