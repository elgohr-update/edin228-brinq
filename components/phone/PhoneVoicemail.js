import { useTheme } from '@nextui-org/react'
import React from 'react'
import { getIcon } from '../../utils/utils'

function PhoneVoicemail() {
  const { type } = useTheme()
  return (
    <div className="flex flex-col w-full h-full">
      <div
        className={`relative flex w-full items-center justify-center panel-theme-${type} overflow-hidden`}
      >
        <div className="flex items-center py-4 text-xs tracking-widest uppercase">
          <span className="mr-2">{getIcon('voicemail')}</span>
          <span>Voicemail</span>
        </div>
        <div className={`bottom-border-flair pink-to-blue-gradient-1`} />
      </div>
      <div className="flex flex-col w-full h-full p-4">2</div>
    </div>
  )
}

export default PhoneVoicemail
