import React, { useState } from 'react'
import { useNotificationContext, useNotificationUpdateContext } from '../../context/state'
import { AiOutlineCopy } from 'react-icons/ai'
import uuid from 'react-uuid'
import { timeout } from '../../utils/utils'

export default function CopyTextToClipboard({ val, children }) {
  const { notification } = useNotificationContext()
  const { setNotification } = useNotificationUpdateContext()
  const id = uuid()
  const copyText = async () => {
    navigator.clipboard.writeText(val)
    setNotification([
      ...notification,
      {
        id: id,
        icon: <AiOutlineCopy />,
        text: 'Copied Text!',
        position: 'bottom-right',
        color: 'white',
        background: 'blue',
        seen: false,
      },
    ])
    
  }
  return (
    <div className="relative" onClick={() => copyText()}>
      {children}
    </div>
  )
}
