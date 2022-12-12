import React from 'react'
import { getIcon } from '../../../utils/utils'

function PhoneToggle() {
  return (
    <div className="fixed cursor-pointer bottom-0 text-white right-0 flex orange-gradient-top-1 w-[40px] h-[40px] justify-center items-center rounded-tl-lg">
        {getIcon('phone')}
    </div>
  )
}

export default PhoneToggle