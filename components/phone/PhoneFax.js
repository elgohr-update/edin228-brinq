import { Image, useTheme } from '@nextui-org/react'
import React from 'react'
import { getIcon } from '../../utils/utils'

function PhoneFax() {
  const { type } = useTheme()
  return (
    <div className="flex flex-col w-full h-full">
      <div
        className={`relative flex w-full items-center px-2 panel-theme-${type} overflow-hidden`}
      >
        <div className="flex items-center justify-center mr-2 ">
          <Image
            showSkeleton
            maxDelay={10000}
            width={20}
            height={20}
            src={`https://cdn.brinq.io/assets/RingCentral/Icon.png`}
            alt="Default Image"
          />
        </div>
        <div className="flex items-center py-4 text-xs tracking-widest uppercase">
          <span>{getIcon('fax')}</span>
          <span className="mx-2 font-bold text-yellow-500 text-md"> / </span>
          <span>Fax</span>
        </div>
        <div className={`bottom-border-flair pink-to-blue-gradient-1`} />
      </div>
      <div className="flex flex-col w-full h-full p-4">3</div>
    </div>
  )
}

export default PhoneFax
